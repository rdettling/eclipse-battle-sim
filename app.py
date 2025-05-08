from flask import Flask, request, jsonify, render_template, send_from_directory
from random import choice
import os


app = Flask(__name__)

# Ensure static files are served correctly
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

@app.route("/")
def index():
    return render_template("index.html")

# Weapon types
CANNON_TYPES = ["ionCannon", "plasmaCannon", "solitonCannon", "antimatterCannon"]
MISSILE_TYPES = ["ionMissile", "plasmaMissile", "solitonMissile", "antimatterMissile"]

def expand_ships(ship_dict, side):
    ships = []

    for ship_type, info in ship_dict.items():
        print(f'{ship_type} {info}')
        count = info.get("count", 0)
        upgrades = info.get("upgrades", [])
        stats = info.get("stats", {})

        # Count cannons and missiles from upgrades
        cannons = {w.replace("Cannon", ""): 0 for w in CANNON_TYPES}
        missiles = {w.replace("Missile", ""): 0 for w in MISSILE_TYPES}
        for upgrade in upgrades:
            if upgrade in CANNON_TYPES:
                key = upgrade.replace("Cannon", "")
                cannons[key] += 1
            elif upgrade in MISSILE_TYPES:
                key = upgrade.replace("Missile", "")
                missiles[key] += 1

        for i in range(count):
            ship = {
                "id": f"{side}-{ship_type}-{i+1}",
                "health": stats.get("hull", 0) + 1,
                "initiative": stats.get("initiative", 0),
                "side": side,
                "plus": stats.get("computer", 0),
                "minus": stats.get("shield", 0),
                "cannons": cannons.copy(),
                "missiles": missiles.copy(),
                # Add any other fields your simulation expects
            }
            ships.append(ship)
    return ships


@app.route("/submit_ships", methods=["POST"])
def submit_ships():
    data = request.get_json()

    attacker_ships = expand_ships(data.get("attacker", {}), "attacker")
    defender_ships = expand_ships(data.get("defender", {}), "defender")

    simulations = 2000

    print("Attacker ships:")
    for ship in attacker_ships: 
        print(ship)
    print("Defender ships:")
    for ship in defender_ships:
        print(ship)

    # Simulate 2000 battles and count victories
    attacker_victories = sum(
        simulate_battle(attacker_ships, defender_ships) == "attacker"
        for _ in range(simulations)
    )
    defender_victories = simulations - attacker_victories

    # Calculate win probabilities
    win_probability = {
        "attacker_win_probability": attacker_victories / simulations,
        "defender_win_probability": defender_victories / simulations,
    }

    print(win_probability)
    return jsonify(win_probability)


def simulate_battle(attacker_ships, defender_ships):
    all_ships = sorted(
        attacker_ships + defender_ships,
        key=lambda x: (-x["initiative"], x["side"] == "attacker"),
    )

    damage_taken = {ship["id"]: 0 for ship in all_ships}

    print("Starting battle simulation")

    # Missile phase with immediate victory condition check
    print("\nMissile Phase")
    for ship in all_ships:
        if any(count > 0 for count in ship["missiles"].values()):
            opponent_ships = (
                defender_ships if ship["side"] == "attacker" else attacker_ships
            )
            target_ships = [
                s for s in opponent_ships if damage_taken[s["id"]] < s["health"]
            ]
            if target_ships:
                target_ship = max(
                    target_ships, key=lambda s: s["health"] - damage_taken[s["id"]]
                )
                damage = roll_dice(ship, target_ship["minus"], "missiles")
                print(
                    f"{ship['id']} (side: {ship['side']}) targets {target_ship['id']} with missiles and deals: {damage} damage"
                )
                damage_taken[target_ship["id"]] += damage
                if damage_taken[target_ship["id"]] >= target_ship["health"]:
                    print(f"{target_ship['id']} has been destroyed by missiles.")
                if all(damage_taken[s["id"]] >= s["health"] for s in defender_ships):
                    print("All defender ships are destroyed. Attacker wins.")
                    return "attacker"
                if all(damage_taken[s["id"]] >= s["health"] for s in attacker_ships):
                    print("All attacker ships are destroyed. Defender wins.")
                    return "defender"

    battle_round = 0
    while True:
        print(f"\nRound {battle_round + 1}")
        round_active = False

        for ship in all_ships:
            if damage_taken[ship["id"]] >= ship["health"]:
                print(f"{ship['id']} is destroyed and cannot attack.")
                continue

            opponent_ships = (
                defender_ships if ship["side"] == "attacker" else attacker_ships
            )
            target_ships = [
                s for s in opponent_ships if damage_taken[s["id"]] < s["health"]
            ]
            if not target_ships:
                continue

            target_ship = max(
                target_ships, key=lambda s: s["health"] - damage_taken[s["id"]]
            )
            round_active = True
            damage = roll_dice(ship, target_ship["minus"], "cannons")
            print(
                f"{ship['id']} (side: {ship['side']}) targets {target_ship['id']} with cannons and deals: {damage} damage"
            )
            damage_taken[target_ship["id"]] += damage
            if damage_taken[target_ship["id"]] >= target_ship["health"]:
                print(f"{target_ship['id']} has been destroyed by cannons.")
            if all(damage_taken[s["id"]] >= s["health"] for s in defender_ships):
                print("All defender ships are destroyed. Attacker wins.")
                return "attacker"
            if all(damage_taken[s["id"]] >= s["health"] for s in attacker_ships):
                print("All attacker ships are destroyed. Defender wins.")
                return "defender"

        if not round_active:
            print("No active ships can attack. Ending simulation.")
            break

        battle_round += 1


def apply_damage_iteratively(ship, damage, all_ships, damage_taken):
    target_side = "defender" if ship["side"] == "attacker" else "attacker"
    while damage > 0:
        target_ships = [
            s
            for s in all_ships
            if s["side"] == target_side and damage_taken[s["id"]] < s["health"]
        ]
        if not target_ships:
            print("No more target ships available for damage application.")
            break
        target_ship = max(
            target_ships, key=lambda s: s["health"] - damage_taken[s["id"]]
        )
        remaining_hull = target_ship["health"] - damage_taken[target_ship["id"]]
        damage_to_apply = min(damage, remaining_hull)
        damage_taken[target_ship["id"]] += damage_to_apply
        print(
            f"Applying {damage_to_apply} damage to {target_ship['id']}, remaining health: {max(0, remaining_hull - damage_to_apply)}"
        )
        damage -= damage_to_apply
        if damage_taken[target_ship["id"]] >= target_ship["health"]:
            print(f"{target_ship['id']} has been destroyed.")


def roll_dice(ship, opponent_minus, weapon_type):
    # Define weapon damage values
    weapon_damage = {
        "ion": 1,
        "plasma": 2,
        "soliton": 3,
        "antimatter": 4,
    }
    # Adjust for opponent's minus value
    effective_plus = max(0, ship["plus"] - opponent_minus)
    # Roll dice for each weapon type and sum damage
    total_damage = 0
    for weapon, count in ship.get(weapon_type, {}).items():
        for _ in range(count):
            roll = choice([0, 2, 3, 4, 5, 6])
            # Determine if roll is a hit considering plus and minus adjustments
            if roll == 6 or (roll != 0 and roll + effective_plus >= 6):
                total_damage += weapon_damage[weapon]
                print(
                    f"{ship['id']} rolls a {roll} with {weapon} (effective hit with +{ship['plus']}, -{opponent_minus}): +{weapon_damage[weapon]} damage"
                )
            else:
                print(
                    f"{ship['id']} rolls a {roll} with {weapon} (miss with +{ship['plus']}, -{opponent_minus})"
                )
    return total_damage





if __name__ == "__main__":
    app.run(debug=True)
