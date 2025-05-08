// --- UI Helper Functions ---

const ATTACKER_EXCLUDED_TYPES = new Set(['starbase', 'ancient', 'guardian', 'gcds']);

/** Create a select dropdown for ship upgrades */
function createUpgradeSlot(shipType, side, slotIndex) {
    const slot = document.createElement('div');
    slot.className = 'upgrade-slot';
    
    const select = document.createElement('select');
    select.className = 'form-control form-control-sm';
    select.name = `${side}_${shipType}_upgrade_${slotIndex}`;
    
    // Add options
    select.appendChild(new Option('No upgrade', ''));
    Object.entries(availableUpgrades).forEach(([upgradeId, upgrade]) => {
        select.appendChild(new Option(upgrade.name, upgradeId));
    });
    
    // Set default upgrade if available
    const defaultUpgrades = shipConfigs[shipType].defaultUpgrades || [];
    if (defaultUpgrades[slotIndex]) select.value = defaultUpgrades[slotIndex];
    
    // Image and placeholder
    const upgradeImage = document.createElement('img');
    upgradeImage.className = 'upgrade-image';
    upgradeImage.style.display = 'none';
    
    const emptyPlaceholder = document.createElement('div');
    emptyPlaceholder.className = 'upgrade-placeholder';
    
    // Update visual
    const updateSlotVisual = () => {
        const selected = select.value;
        if (selected) {
            upgradeImage.src = `/static/upgrades/${availableUpgrades[selected].image}`;
            upgradeImage.style.display = 'block';
            emptyPlaceholder.style.display = 'none';
        } else {
            upgradeImage.style.display = 'none';
            emptyPlaceholder.style.display = 'block';
        }
    };
    
    select.addEventListener('change', () => {
        updateShipStats(shipType, side);
        updateSlotVisual();
    });
    
    updateSlotVisual();
    slot.append(upgradeImage, emptyPlaceholder, select);
    return slot;
}

/** Create a select dropdown for ship count */
function createCountSelect(shipType, side) {
    const select = document.createElement('select');
    select.className = 'form-control form-control-sm ship-count-select';
    select.name = `${side}_${shipType}`;
    for (let i = 0; i <= shipConfigs[shipType].maxCount; i++) {
        select.appendChild(new Option(i, i));
    }
    select.value = 1; // Default to 1
    select.addEventListener('change', () => updateShipStats(shipType, side));
    return select;
}

/** Calculate stats for a ship type and side */
function calculateShipStats(shipType, side) {
    const stats = { ...shipConfigs[shipType].baseStats };
    for (let i = 0; i < shipConfigs[shipType].upgradeSlots; i++) {
        const select = document.querySelector(`select[name="${side}_${shipType}_upgrade_${i}"]`);
        if (select && select.value) {
            const effect = availableUpgrades[select.value].effect || {};
            Object.entries(effect).forEach(([stat, value]) => {
                stats[stat] = (stats[stat] || 0) + value;
            });
        }
    }
    return stats;
}

/** Update the stats summary for a ship */
function updateShipStats(shipType, side) {
    const stats = calculateShipStats(shipType, side);
    const statsDiv = document.querySelector(`#${side}-${shipType}-stats`);
    if (statsDiv) {
        statsDiv.innerHTML = `<div class="stats-summary">${
            Object.entries(stats)
                .map(([stat, value]) => `<span class="stat-item"><strong>${stat}:</strong> ${value}</span>`)
                .join('')
        }</div>`;
    }
}

/** Add a new ship row for a side, using the first available type */
function addNewShip(side) {
    const shipsDiv = document.getElementById(`${side}-ships`);
    const usedTypes = new Set([...shipsDiv.querySelectorAll('.ship-type-select')].map(s => s.value));
    const firstAvailableType = Object.keys(shipConfigs).find(type => {
        if (side === 'attacker' && ATTACKER_EXCLUDED_TYPES.has(type)) return false;
        return !usedTypes.has(type);
    });
    if (!firstAvailableType) return;

    const shipGroup = document.createElement('div');
    shipGroup.className = 'ship-group';
    shipGroup.appendChild(createShipRow(firstAvailableType, side));
    shipsDiv.appendChild(shipGroup);
    updateShipStats(firstAvailableType, side);
    updateAddShipButtonVisibility(side);
}

/** Create a ship row (type, count, upgrades, stats) */
function createShipRow(shipType, side) {
    const row = document.createElement('div');
    row.className = 'ship-row mb-3';
    
    // Top row: type, count, remove
    const topRow = document.createElement('div');
    topRow.className = 'ship-top-row';
    
    // Ship type select
    const shipName = document.createElement('div');
    shipName.className = 'ship-name';
    const typeSelect = document.createElement('select');
    typeSelect.className = 'form-control form-control-sm ship-type-select';
    typeSelect.name = `${side}_${shipType}_type`;
    
    // Populate type options
    const existingShips = new Set([...document.querySelectorAll(`#${side}-ships .ship-type-select`)].map(s => s.value));
    Object.entries(shipConfigs).forEach(([type, config]) => {
        // Exclude certain types for attacker side
        if (side === 'attacker' && ATTACKER_EXCLUDED_TYPES.has(type)) return;
        if (!existingShips.has(type) || type === shipType) {
            typeSelect.appendChild(new Option(shipDisplayNames[type], type));
        }
    });
    typeSelect.value = shipType;
    
    // On type change, update upgrades and stats
    typeSelect.addEventListener('change', function() {
        const newType = this.value;
        const upgradeSlots = row.querySelector('.upgrade-slots');
        const statsDiv = row.querySelector('.stats-summary-container');
        upgradeSlots.innerHTML = '';
        for (let i = 0; i < shipConfigs[newType].upgradeSlots; i++) {
            upgradeSlots.appendChild(createUpgradeSlot(newType, side, i));
        }
        statsDiv.id = `${side}-${newType}-stats`;
        updateShipStats(newType, side);
    });
    shipName.appendChild(typeSelect);
    
    // Count select
    const countSelect = createCountSelect(shipType, side);
    
    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-ship-btn';
    removeBtn.textContent = '×';
    removeBtn.onclick = () => {
        row.closest('.ship-group').remove();
        updateAddShipButtonVisibility(side);
    };
    
    topRow.append(shipName, countSelect, removeBtn);
    
    // Upgrades row
    const upgradeSlots = document.createElement('div');
    upgradeSlots.className = 'upgrade-slots';
    for (let i = 0; i < shipConfigs[shipType].upgradeSlots; i++) {
        upgradeSlots.appendChild(createUpgradeSlot(shipType, side, i));
    }
    
    // Stats summary
    const statsDiv = document.createElement('div');
    statsDiv.id = `${side}-${shipType}-stats`;
    statsDiv.className = 'stats-summary-container';
    
    row.append(topRow, upgradeSlots, statsDiv);
    updateShipStats(shipType, side);
    return row;
}

/** Collect all ships for a side */
function collectShipsForSide(side) {
    const ships = {};
    document.querySelectorAll(`#${side}-ships .ship-row`).forEach(row => {
        const typeSelect = row.querySelector('.ship-type-select');
        const shipType = typeSelect.value;
        const count = parseInt(row.querySelector('.ship-count-select').value, 10);
        const upgrades = [...row.querySelectorAll('.upgrade-slots .upgrade-slot select')]
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

/** Create a summary section for ships */
function createShipSummary(title, ships, colorVar) {
    const container = document.createElement('div');
    container.className = 'ship-summary';
    const heading = document.createElement('div');
    heading.className = 'ship-summary-heading';
    heading.textContent = title;
    heading.style.color = `var(${colorVar})`;
    container.appendChild(heading);
    const list = document.createElement('ul');
    list.className = 'ship-summary-list';
    Object.entries(ships).forEach(([type, info]) => {
        const li = document.createElement('li');
        li.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${info.count}`;
        list.appendChild(li);
    });
    container.appendChild(list);
    return container;
}

/** Display results and summary */
function displayResults(results, shipData) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    const summarySection = document.createElement('div');
    summarySection.className = 'results-summary-section';
    summarySection.appendChild(createShipSummary('Attacker Ships', shipData.attacker, '--attacker-color'));
    summarySection.appendChild(createShipSummary('Defender Ships', shipData.defender, '--defender-color'));
    resultsDiv.appendChild(summarySection);

    const attackerPercent = Math.round(results.attacker_win_probability * 100);
    const defenderPercent = 100 - attackerPercent;

    const barContainer = document.createElement('div');
    barContainer.className = 'win-bar-container';
    const attackerBar = document.createElement('div');
    attackerBar.className = 'win-bar-attacker';
    attackerBar.style.width = `${attackerPercent}%`;
    const defenderBar = document.createElement('div');
    defenderBar.className = 'win-bar-defender';
    defenderBar.style.width = `${defenderPercent}%`;
    barContainer.append(attackerBar, defenderBar);

    const label = document.createElement('div');
    label.className = 'win-bar-label';
    label.textContent = `Attacker: ${attackerPercent}% | Defender: ${defenderPercent}%`;

    resultsDiv.append(barContainer, label);
}

function hasAvailableShipType(side) {
    const shipsDiv = document.getElementById(`${side}-ships`);
    const usedTypes = new Set([...shipsDiv.querySelectorAll('.ship-type-select')].map(s => s.value));
    return Object.keys(shipConfigs).some(type => {
        if (side === 'attacker' && ATTACKER_EXCLUDED_TYPES.has(type)) return false;
        return !usedTypes.has(type);
    });
}

function updateAddShipButtonVisibility(side) {
    const btn = document.getElementById(`add-${side}-ship`);
    if (hasAvailableShipType(side)) {
        btn.style.display = '';
    } else {
        btn.style.display = 'none';
    }
}