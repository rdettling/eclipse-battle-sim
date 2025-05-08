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
        
        const shipData = {
            attacker: collectShipsForSide('attacker'),
            defender: collectShipsForSide('defender')
        };
        
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

function collectShipsForSide(side) {
    const ships = {};
    // For each ship group (row) for this side
    document.querySelectorAll(`#${side}-ships .ship-row`).forEach(row => {
        const typeSelect = row.querySelector('.ship-type-select');
        const shipType = typeSelect.value;

        // Get count
        const countSelect = row.querySelector('.ship-count-select');
        const count = parseInt(countSelect.value, 10);

        // Get upgrades
        const upgrades = [];
        row.querySelectorAll('.upgrade-slots .upgrade-slot select').forEach(select => {
            if (select.value) upgrades.push(select.value);
        });

        // Get stats
        const stats = {};
        // You may want to get these from your config or from the UI if they are editable
        // Here, we assume stats are displayed in the stats-summary-container
        const statsDiv = row.querySelector('.stats-summary-container');
        if (statsDiv) {
            statsDiv.querySelectorAll('.stat-item').forEach(item => {
                const [stat, value] = item.textContent.split(':').map(s => s.trim());
                stats[stat] = Number(value);
            });
        }

        if (count > 0) {
            ships[shipType] = {
                count,
                stats,
                upgrades
            };
        }
    });
    return ships;
} 