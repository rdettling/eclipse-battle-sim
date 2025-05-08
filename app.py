from flask import Flask, request, jsonify, render_template, send_from_directory
from random import choice


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
WEAPON_DAMAGE = {
    "ion": 1,
    "plasma": 2,
    "soliton": 3,
    "antimatter": 4,
}

def count_weapons(upgrades, types, suffix):
    """Count the number of each weapon type in upgrades."""
    return {
        t.replace(suffix, ""): upgrades.count(t)
        for t in types
    }

def expand_ships(ship_dict, side):
    """Expand ship data into a list of ship dicts for simulation."""
    ships = []
    for ship_type, info in ship_dict.items():
        count = info.get("count", 0)
        upgrades = info.get("upgrades", [])
        stats = info.get("stats", {})
        cannons = count_weapons(upgrades, CANNON_TYPES, "Cannon")
        missiles = count_weapons(upgrades, MISSILE_TYPES, "Missile")
        for i in range(count):
            ships.append({
                "id": f"{side}-{ship_type}-{i+1}",
                "health": stats.get("hull", 0) + 1,
                "initiative": stats.get("initiative", 0),
                "side": side,
                "plus": stats.get("computer", 0),
                "minus": stats.get("shield", 0),
                "cannons": cannons.copy(),
                "missiles": missiles.copy(),
            })
    return ships

def roll_dice(ship, opponent_minus, weapon_type):
    """Simulate dice rolls for a ship's weapons."""
    effective_plus = max(0, ship["plus"] - opponent_minus)
    total_damage = 0
    for weapon, count in ship.get(weapon_type, {}).items():
        for _ in range(count):
            roll = choice([0, 2, 3, 4, 5, 6])
            if roll == 6 or (roll != 0 and roll + effective_plus >= 6):
                total_damage += WEAPON_DAMAGE[weapon]
    return total_damage

def simulate_battle(attacker_ships, defender_ships):
    """Simulate a single battle and return the winner."""
    all_ships = sorted(
        attacker_ships + defender_ships,
        key=lambda x: (-x["initiative"], x["side"] == "attacker"),
    )
    damage_taken = {ship["id"]: 0 for ship in all_ships}

    # Missile phase
    for ship in all_ships:
        if any(count > 0 for count in ship["missiles"].values()):
            opponent_ships = defender_ships if ship["side"] == "attacker" else attacker_ships
            target_ships = [s for s in opponent_ships if damage_taken[s["id"]] < s["health"]]
            if target_ships:
                target_ship = max(target_ships, key=lambda s: s["health"] - damage_taken[s["id"]])
                damage = roll_dice(ship, target_ship["minus"], "missiles")
                damage_taken[target_ship["id"]] += damage
                if damage_taken[target_ship["id"]] >= target_ship["health"]:
                    pass  # Ship destroyed
                if all(damage_taken[s["id"]] >= s["health"] for s in defender_ships):
                    return "attacker"
                if all(damage_taken[s["id"]] >= s["health"] for s in attacker_ships):
                    return "defender"

    # Cannon rounds
    while True:
        round_active = False
        for ship in all_ships:
            if damage_taken[ship["id"]] >= ship["health"]:
                continue
            opponent_ships = defender_ships if ship["side"] == "attacker" else attacker_ships
            target_ships = [s for s in opponent_ships if damage_taken[s["id"]] < s["health"]]
            if not target_ships:
                continue
            target_ship = max(target_ships, key=lambda s: s["health"] - damage_taken[s["id"]])
            round_active = True
            damage = roll_dice(ship, target_ship["minus"], "cannons")
            damage_taken[target_ship["id"]] += damage
            if damage_taken[target_ship["id"]] >= target_ship["health"]:
                pass  # Ship destroyed
            if all(damage_taken[s["id"]] >= s["health"] for s in defender_ships):
                return "attacker"
            if all(damage_taken[s["id"]] >= s["health"] for s in attacker_ships):
                return "defender"
        if not round_active:
            break

@app.route("/submit_ships", methods=["POST"])
def submit_ships():
    data = request.get_json()
    attacker_ships = expand_ships(data.get("attacker", {}), "attacker")
    defender_ships = expand_ships(data.get("defender", {}), "defender")
    simulations = 1000
    attacker_victories = sum(
        simulate_battle(attacker_ships, defender_ships) == "attacker"
        for _ in range(simulations)
    )
    defender_victories = simulations - attacker_victories
    win_probability = {
        "attacker_win_probability": attacker_victories / simulations,
        "defender_win_probability": defender_victories / simulations,
    }
    return jsonify(win_probability)

if __name__ == "__main__":
    app.run(debug=True)
