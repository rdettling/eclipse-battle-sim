## Battle Simulation Logic

The backend simulates space battles between two fleets (attacker and defender) using the following process:

1. **Input Structure**  
   The backend receives JSON data describing the ships for both attacker and defender, including their types, upgrades, and stats.

2. **Simulation Loop**  
   For each simulation (default: 1000 times), the following steps are performed:
   - **Missile Phase**  
     Each ship with missiles targets an enemy ship, dealing damage. If all ships on one side are destroyed by missiles, the battle ends immediately.
   - **Battle Rounds**  
     If both sides still have ships, the battle proceeds in rounds. In each round:
     - Ships attack in order of initiative.
     - Each ship targets the enemy ship with the most remaining health.
     - Damage is calculated based on the ship's weapons and upgrades.
     - Destroyed ships are removed from further combat.
     - The round continues until all ships on one side are destroyed or no ships can attack.
   - **Victory Determination**  
     The simulation records which side wins each battle.

3. **Result Calculation**  
   After all simulations, the backend calculates the win probability for each side and returns these probabilities as a JSON response.
