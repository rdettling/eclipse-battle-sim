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
        // Update tooltip when selection changes
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            this.setAttribute('data-tooltip', selectedOption.text);
        } else {
            this.removeAttribute('data-tooltip');
        }
    });
    
    // Set initial tooltip if there's a default value
    if (select.value) {
        select.setAttribute('data-tooltip', select.options[select.selectedIndex].text);
    }
    
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

function addNewShip(side) {
    const shipsDiv = document.getElementById(`${side}-ships`);
    const shipType = 'interceptor'; // Default to interceptor for new ships
    
    // Create a new container for this ship group
    const shipGroup = document.createElement('div');
    shipGroup.className = 'ship-group';
    
    // Create the ship row
    const shipRow = createShipRow(shipType, side);
    
    // Add a remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-ship-btn';
    removeBtn.textContent = '×';
    removeBtn.onclick = function() {
        shipGroup.remove();
    };
    
    // Add elements to the group
    shipGroup.appendChild(shipRow);
    
    // Add the group to the ships container
    shipsDiv.appendChild(shipGroup);
    
    // Update stats for the new ship
    updateShipStats(shipType, side);
}

function createShipRow(shipType, side) {
    const row = document.createElement('div');
    row.className = 'ship-row mb-3';
    
    // First row: Ship name, upgrade slots, and count
    const topRow = document.createElement('div');
    topRow.className = 'ship-top-row';
    
    // Ship name with type selector
    const shipName = document.createElement('div');
    shipName.className = 'ship-name';
    
    const typeSelect = document.createElement('select');
    typeSelect.className = 'form-control form-control-sm ship-type-select';
    typeSelect.name = `${side}_${shipType}_type`;
    
    // Get existing ship types for this side
    const existingShips = new Set();
    document.querySelectorAll(`#${side}-ships .ship-type-select`).forEach(select => {
        if (select !== typeSelect) {  // Don't include the current select
            existingShips.add(select.value);
        }
    });
    
    // Add ship type options, excluding existing ones
    for (const [type, config] of Object.entries(shipConfigs)) {
        if (!existingShips.has(type)) {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = shipDisplayNames[type];
            typeSelect.appendChild(option);
        }
    }
    
    // Set initial value
    typeSelect.value = shipType;
    
    // Add change event to update ship configuration when type changes
    typeSelect.addEventListener('change', function() {
        const newType = this.value;
        const upgradeSlots = row.querySelector('.upgrade-slots');
        const statsDiv = row.querySelector('.stats-summary-container');
        
        // Update upgrade slots
        upgradeSlots.innerHTML = '';
        for (let i = 0; i < shipConfigs[newType].upgradeSlots; i++) {
            upgradeSlots.appendChild(createUpgradeSlot(newType, side, i));
        }
        
        // Update stats
        statsDiv.id = `${side}-${newType}-stats`;
        updateShipStats(newType, side);
    });
    
    shipName.appendChild(typeSelect);
    
    // Upgrade slots
    const upgradeSlots = document.createElement('div');
    upgradeSlots.className = 'upgrade-slots';
    
    for (let i = 0; i < shipConfigs[shipType].upgradeSlots; i++) {
        upgradeSlots.appendChild(createUpgradeSlot(shipType, side, i));
    }
    
    // Count select
    const countSelect = createCountSelect(shipType, side);
    
    // Add a remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-ship-btn';
    removeBtn.textContent = '×';
    removeBtn.onclick = function() {
        row.closest('.ship-group').remove();
    };
    
    // Add all elements to the top row
    topRow.appendChild(shipName);
    topRow.appendChild(upgradeSlots);
    topRow.appendChild(countSelect);
    topRow.appendChild(removeBtn);
    
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