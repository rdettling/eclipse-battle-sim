// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ship rows for both sides
    const attackerShips = document.getElementById('attacker-ships');
    const defenderShips = document.getElementById('defender-ships');
    
    // Add initial ships
    addNewShip('attacker');
    addNewShip('defender');
    
    // Set up Add Ship buttons
    document.getElementById('add-attacker-ship').addEventListener('click', () => addNewShip('attacker'));
    document.getElementById('add-defender-ship').addEventListener('click', () => addNewShip('defender'));
    
    // Set up form submission
    document.getElementById('ship-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect ship data
        const shipData = {
            attacker: updateShipCounts('attacker'),
            defender: updateShipCounts('defender')
        };
        
        // Send data to server
        fetch('/submit_ships', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(shipData)
        })
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while processing the battle.');
        });
    });
    
    // Set up reset button
    document.getElementById('reset-counts').addEventListener('click', function() {
        const countSelects = document.querySelectorAll('.count-select');
        countSelects.forEach(select => {
            select.value = '0';
        });
    });
}); 