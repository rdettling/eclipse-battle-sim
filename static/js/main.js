// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ship rows for both sides
    const attackerShipsDiv = document.getElementById('attacker-ships');
    const defenderShipsDiv = document.getElementById('defender-ships');
    
    // Create ship rows
    for (const shipType of Object.keys(shipConfigs)) {
        attackerShipsDiv.appendChild(createShipRow(shipType, 'attacker'));
        defenderShipsDiv.appendChild(createShipRow(shipType, 'defender'));
    }
    
    // Force update of all ship stats to ensure they're displayed immediately
    for (const shipType of Object.keys(shipConfigs)) {
        updateShipStats(shipType, 'attacker');
        updateShipStats(shipType, 'defender');
    }
    
    // Add event listeners
    document.getElementById('submitBtn').addEventListener('click', function() {
        const { attackerShips, defenderShips } = updateShipCounts();
        
        // Send data to server
        fetch('/submit_ships', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                attacker_ships: attackerShips,
                defender_ships: defenderShips
            })
        })
        .then(response => response.json())
        .then(data => {
            displayResults(data.results);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during simulation');
        });
    });
    
    // Add reset button functionality
    document.getElementById('resetBtn').addEventListener('click', function() {
        // Reset all ship counts to 0
        const countSelects = document.querySelectorAll('.ship-count-select');
        countSelects.forEach(select => {
            select.value = 0;
        });
        
        // Update stats for all ships
        for (const shipType of Object.keys(shipConfigs)) {
            updateShipStats(shipType, 'attacker');
            updateShipStats(shipType, 'defender');
        }
    });
}); 