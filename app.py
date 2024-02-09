from flask import Flask, request, jsonify, render_template
from random import choice


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/submit_ships", methods=["POST"])
def submit_ships():
    data = request.form
    attacker_ships = extract_ship_data(data, "attacker")
    defender_ships = extract_ship_data(data, "defender")

    simulations = 1000

    print(attacker_ships)
    print(defender_ships)

    # Simulate 1000 battles and count victories
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

    return jsonify(win_probability)


def simulate_battle(attacker_ships, defender_ships):
    all_ships = sorted(
        attacker_ships + defender_ships,
        key=lambda x: (-x["priority"], x["side"] == "attacker"),
    )

    damage_taken = {ship["id"]: 0 for ship in all_ships}

    print("Starting battle simulation")
    battle_round = 0

    while True:
        print(f"\nRound {battle_round + 1}")
        round_active = False

        for ship in all_ships:
            if damage_taken[ship["id"]] >= ship["health"]:
                print(f"{ship['id']} is destroyed and cannot attack.")
                continue  # Skip destroyed ships

            # Determine opponent ships
            opponent_ships = (
                defender_ships if ship["side"] == "attacker" else attacker_ships
            )
            # Filter opponent ships that still have remaining health
            target_ships = [
                s for s in opponent_ships if damage_taken[s["id"]] < s["health"]
            ]
            if not target_ships:
                continue  # No targets left for this ship

            # Select the target with the highest remaining health
            target_ship = max(
                target_ships, key=lambda s: s["health"] - damage_taken[s["id"]]
            )
            round_active = True

            # Calculate the damage with the target's minus value considered
            damage = roll_dice_for_cannons(ship, opponent_minus=target_ship["minus"])
            print(
                f"{ship['id']} (side: {ship['side']}) targets {target_ship['id']} and rolls total damage: {damage}"
            )

            # Apply damage to the selected target ship
            damage_taken[target_ship["id"]] += damage
            if damage_taken[target_ship["id"]] >= target_ship["health"]:
                print(f"{target_ship['id']} has been destroyed.")

        if not round_active:
            print("No active ships can attack. Ending simulation.")
            break

        # Check for victory conditions
        if all(damage_taken[s["id"]] >= s["health"] for s in attacker_ships):
            print("All attacker ships are destroyed. Defender wins.")
            return "defender"
        if all(damage_taken[s["id"]] >= s["health"] for s in defender_ships):
            print("All defender ships are destroyed. Attacker wins.")
            return "attacker"

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


def roll_dice_for_cannons(ship, opponent_minus=0):
    # Define cannon damage values
    cannon_damage = {
        "ion": 1,
        "plasma": 2,
        "soliton": 3,
        "antimatter": 4,
    }
    # Adjust for opponent's minus value
    effective_plus = max(0, ship["plus"] - opponent_minus)
    # Roll dice for each cannon type and sum damage
    total_damage = 0
    for cannon_type, cannon_count in ship["cannons"].items():
        for _ in range(cannon_count):
            roll = choice([0, 2, 3, 4, 5, 6])
            # Determine if roll is a hit considering plus and minus adjustments
            if roll == 6 or (roll != 0 and roll + effective_plus >= 6):
                total_damage += cannon_damage[cannon_type]
                print(
                    f"{ship['id']} rolls a {roll} with {cannon_type} (effective hit with +{ship['plus']}, -{opponent_minus}): +{cannon_damage[cannon_type]} damage"
                )
            else:
                print(
                    f"{ship['id']} rolls a {roll} with {cannon_type} (miss with +{ship['plus']}, -{opponent_minus})"
                )
    return total_damage


def extract_ship_data(data, side):
    ships = []
    for key, value in data.items():
        if key.startswith(side) and key.endswith("count") and int(value) > 0:
            ship_base = "-".join(key.split("-")[:-1])  # e.g., "attacker-interceptor"
            ship_type = key.split("-")[1]  # e.g., "interceptor"
            count = int(value)
            cannons = {
                "ion": int(data.get(f"{ship_base}-ion-cannon", 0)),
                "plasma": int(data.get(f"{ship_base}-plasma-cannon", 0)),
                "soliton": int(data.get(f"{ship_base}-soliton-cannon", 0)),
                "antimatter": int(data.get(f"{ship_base}-antimatter-cannon", 0)),
            }
            plus = int(data.get(f"{ship_base}-plus", 0))  # Extract plus value
            minus = int(data.get(f"{ship_base}-minus", 0))  # Extract minus value
            for i in range(count):
                ship_id = (
                    f"{ship_base}-{i+1}"  # Unique identifier for each ship instance
                )
                ships.append(
                    {
                        "id": ship_id,
                        "type": ship_type,
                        "cannons": cannons,
                        "health": int(data.get(f"{ship_base}-hull", 0)) + 1,
                        "priority": int(data.get(f"{ship_base}-priority", 0)),
                        "side": side,
                        "plus": plus,  # Add plus value to ship data
                        "minus": minus,  # Add minus value to ship data
                    }
                )
    return ships


if __name__ == "__main__":
    app.run(debug=True)
