// UI Helper Functions
function createUpgradeSlot(shipType, side, slotIndex) {
    const slot = document.createElement('div');
    slot.className = 'upgrade-slot';
    
    const select = document.createElement('select');
    select.className = 'form-control form-control-sm';
    select.name = `${side}_${shipType}_upgrade_${slotIndex}`;
    
    // Add empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'No upgrade';
    select.appendChild(emptyOption);
    
    // Add available upgrades
    for (const [upgradeId, upgrade] of Object.entries(availableUpgrades)) {
        const option = document.createElement('option');
        option.value = upgradeId;
        option.textContent = upgrade.name;
        select.appendChild(option);
    }
    
    // Set the default upgrade for this slot if available
    const defaultUpgrades = shipConfigs[shipType].defaultUpgrades || [];
    if (defaultUpgrades.length > slotIndex) {
        const defaultUpgrade = defaultUpgrades[slotIndex];
        if (availableUpgrades[defaultUpgrade]) {
            select.value = defaultUpgrade;
        }
    }
    
    // Add change event to update stats when upgrade changes
    select.addEventListener('change', function() {
        updateShipStats(shipType, side);
    });
    
    slot.appendChild(select);
    return slot;
}

function createCountSelect(shipType, side) {
    const select = document.createElement('select');
    select.className = 'form-control form-control-sm ship-count-select';
    select.name = `${side}_${shipType}`;
    
    // Add options from 0 to maxCount
    for (let i = 0; i <= shipConfigs[shipType].maxCount; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
    
    // Set default count to 0
    select.value = 0;
    
    // Add change event to update stats when count changes
    select.addEventListener('change', function() {
        updateShipStats(shipType, side);
    });
    
    return select;
}

function calculateShipStats(shipType, side) {
    // Start with base stats
    const stats = {...shipConfigs[shipType].baseStats};
    
    // Add stats from upgrades
    for (let i = 0; i < shipConfigs[shipType].upgradeSlots; i++) {
        const select = document.querySelector(`select[name="${side}_${shipType}_upgrade_${i}"]`);
        if (select && select.value) {
            const upgrade = availableUpgrades[select.value];
            if (upgrade && upgrade.effect) {
                for (const [stat, value] of Object.entries(upgrade.effect)) {
                    stats[stat] = (stats[stat] || 0) + value;
                }
            }
        }
    }
    
    return stats;
}

function updateShipStats(shipType, side) {
    const stats = calculateShipStats(shipType, side);
    const statsDiv = document.querySelector(`#${side}-${shipType}-stats`);
    
    if (statsDiv) {
        let statsHtml = '<div class="stats-summary">';
        for (const [stat, value] of Object.entries(stats)) {
            statsHtml += `<span class="stat-item"><strong>${stat}:</strong> ${value}</span>`;
        }
        statsHtml += '</div>';
        statsDiv.innerHTML = statsHtml;
    }
}

function createShipRow(shipType, side) {
    const row = document.createElement('div');
    row.className = 'ship-row mb-3';
    
    // First row: Ship name, upgrade slots, and count
    const topRow = document.createElement('div');
    topRow.className = 'ship-top-row';
    
    // Ship name
    const shipName = document.createElement('div');
    shipName.className = 'ship-name';
    shipName.textContent = shipDisplayNames[shipType];
    
    // Upgrade slots
    const upgradeSlots = document.createElement('div');
    upgradeSlots.className = 'upgrade-slots';
    
    for (let i = 0; i < shipConfigs[shipType].upgradeSlots; i++) {
        upgradeSlots.appendChild(createUpgradeSlot(shipType, side, i));
    }
    
    // Count select
    const countSelect = createCountSelect(shipType, side);
    
    // Add all elements to the top row
    topRow.appendChild(shipName);
    topRow.appendChild(upgradeSlots);
    topRow.appendChild(countSelect);
    
    // Stats summary
    const statsDiv = document.createElement('div');
    statsDiv.id = `${side}-${shipType}-stats`;
    statsDiv.className = 'stats-summary-container';
    
    // Add rows to the main container
    row.appendChild(topRow);
    row.appendChild(statsDiv);
    
    // Initialize stats
    updateShipStats(shipType, side);
    
    return row;
}

function updateShipCounts() {
    const attackerShips = {};
    const defenderShips = {};
    
    // Get attacker ship counts and upgrades
    for (const shipType of Object.keys(shipConfigs)) {
        const select = document.querySelector(`select[name="attacker_${shipType}"]`);
        if (select) {
            const count = parseInt(select.value) || 0;
            if (count > 0) {
                attackerShips[shipType] = {
                    count: count,
                    upgrades: [],
                    stats: calculateShipStats(shipType, 'attacker')
                };
                
                // Get upgrades for this ship
                for (let i = 0; i < shipConfigs[shipType].upgradeSlots; i++) {
                    const upgradeSelect = document.querySelector(`select[name="attacker_${shipType}_upgrade_${i}"]`);
                    if (upgradeSelect && upgradeSelect.value) {
                        attackerShips[shipType].upgrades.push(upgradeSelect.value);
                    }
                }
            }
        }
    }
    
    // Get defender ship counts and upgrades
    for (const shipType of Object.keys(shipConfigs)) {
        const select = document.querySelector(`select[name="defender_${shipType}"]`);
        if (select) {
            const count = parseInt(select.value) || 0;
            if (count > 0) {
                defenderShips[shipType] = {
                    count: count,
                    upgrades: [],
                    stats: calculateShipStats(shipType, 'defender')
                };
                
                // Get upgrades for this ship
                for (let i = 0; i < shipConfigs[shipType].upgradeSlots; i++) {
                    const upgradeSelect = document.querySelector(`select[name="defender_${shipType}_upgrade_${i}"]`);
                    if (upgradeSelect && upgradeSelect.value) {
                        defenderShips[shipType].upgrades.push(upgradeSelect.value);
                    }
                }
            }
        }
    }
    
    return { attackerShips, defenderShips };
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    // Create results table
    const table = document.createElement('table');
    table.className = 'results-table table table-striped';
    
    // Add header row
    const headerRow = document.createElement('tr');
    ['Ship Type', 'Attacker Count', 'Defender Count', 'Attacker Lost', 'Defender Lost'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    // Add data rows
    for (const [shipType, data] of Object.entries(results)) {
        const row = document.createElement('tr');
        [
            shipDisplayNames[shipType],
            data.attackerCount,
            data.defenderCount,
            data.attackerLost,
            data.defenderLost
        ].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            row.appendChild(td);
        });
        table.appendChild(row);
    }
    
    resultsDiv.appendChild(table);
} 