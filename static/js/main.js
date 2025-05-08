// Main Application Logic
document.addEventListener('DOMContentLoaded', () => {
    // Initialize ship rows and update Add Ship button visibility
    ['attacker', 'defender'].forEach(side => {
        addNewShip(side);
        updateAddShipButtonVisibility(side);
        document.getElementById(`add-${side}-ship`).addEventListener('click', () => addNewShip(side));
    });

    // Handle form submission
    document.getElementById('ship-form').addEventListener('submit', e => {
        e.preventDefault();
        const shipData = {
            attacker: collectShipsForSide('attacker'),
            defender: collectShipsForSide('defender')
        };
        fetch('/submit_ships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(shipData)
        })
        .then(response => response.json())
        .then(data => displayResults(data, shipData))
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while processing the battle.');
        });
    });

    // Handle reset button
    document.getElementById('reset-counts').addEventListener('click', () => {
        document.querySelectorAll('.ship-count-select').forEach(select => {
            select.value = '0';
        });
    });
});

/** Collect all ships for a side */
function collectShipsForSide(side) {
    const ships = {};
    document.querySelectorAll(`#${side}-ships .ship-row`).forEach(row => {
        const shipType = row.querySelector('.ship-type-select').value;
        const count = parseInt(row.querySelector('.ship-count-select').value, 10);
        const upgrades = Array.from(row.querySelectorAll('.upgrade-slots .upgrade-slot select'))
            .map(select => select.value)
            .filter(Boolean);
        const stats = {};
        row.querySelectorAll('.stats-summary-container .stat-item').forEach(item => {
            const [stat, value] = item.textContent.split(':').map(s => s.trim());
            stats[stat] = Number(value);
        });
        if (count > 0) {
            ships[shipType] = { count, stats, upgrades };
        }
    });
    return ships;
} 