// Ship configurations
const shipConfigs = {
    interceptor: { 
        maxCount: 8,
        upgradeSlots: 4,
        baseStats: {
            hull: 0,
            computer: 0,
            shield: 0,
            initiative: 2,
            power: 0
        },
        defaultUpgrades: ['ionCannon', 'nuclearDrive', 'nuclearSource'] // Default upgrades for interceptor
    },
    cruiser: { 
        maxCount: 4,
        upgradeSlots: 6,
        baseStats: {
            hull: 0,
            computer: 0,
            shield: 0,
            initiative: 1,
            power: 0
        },
        defaultUpgrades: ['ionCannon', 'nuclearDrive', 'hull', 'electronComputer', 'nuclearSource'] // Default upgrades for cruiser
    },
    dreadnaught: { 
        maxCount: 2,
        upgradeSlots: 8,
        baseStats: {
            hull: 0,
            computer: 0,
            shield: 0,
            initiative: 0,
            power: 0
        },
        defaultUpgrades: ['hull', 'hull', 'nuclearDrive', 'nuclearSource', 'electronComputer', 'ionCannon', 'ionCannon']
    },
    starbase: {
        maxCount: 4,
        upgradeSlots: 5,
        baseStats: {
            hull: 0,
            computer: 0,
            shield: 0,
            initiative: 4,
            power: 0
        },
        defaultUpgrades: ['hull', 'hull', 'electronComputer', 'ionCannon']
    },
    ancient: {
        maxCount: 2,
        upgradeSlots: 3,
        baseStats: {
            hull: 3,
            computer: 2,
            shield: 2,
            initiative: 1,
            power: 3
        },
        defaultUpgrades: ['hull', 'shield', 'power'] // Default upgrades for ancient
    },
    guardian: {
        maxCount: 1,
        upgradeSlots: 4,
        baseStats: {
            hull: 4,
            computer: 3,
            shield: 3,
            initiative: 1,
            power: 4
        },
        defaultUpgrades: ['hull', 'shield', 'computer', 'power'] // Default upgrades for guardian
    },
    gcds: {
        maxCount: 1,
        upgradeSlots: 3,
        baseStats: {
            hull: 3,
            computer: 2,
            shield: 2,
            initiative: 1,
            power: 3
        },
        defaultUpgrades: ['hull', 'shield', 'computer'] // Default upgrades for gcds
    }
};

// Ship display names
const shipDisplayNames = {
    interceptor: "Interceptor",
    cruiser: "Cruiser",
    dreadnaught: "Dreadnaught",
    starbase: "Starbase",
    ancient: "Ancient",
    guardian: "Guardian",
    gcds: "GCDS"
};

// Available upgrades
const availableUpgrades = {
    hull: {
        name: "Hull",
        effect: {
            hull: 1
        }
    },
    improvedHull: {
        name: "Improved Hull",
        effect: {
            hull: 2
        }
    },
    conifoldField: {
        name: "Conifold Field",
        effect: {
            hull: 3
        }
    },
    sentientHull: {
        name: "Sentient Hull",
        effect: {
            hull: 1,
            computer: 1,
        }
    },
    nuclearDrive: {
        name: "Nuclear Drive",
        effect: {
            initiative: 1
        }
    },
    fushionDrive: {
        name: "Fushion Drive",
        effect: {
            initiative: 2
        }
    },
    transitionDrive: {
        name: "Transition Drive",
        effect: {
        }
    },
    tachyonDrive: {
        name: "Tachyon Drive",
        effect: {
            initiative: 3
        }
    },
    nuclearSource: {
        name: "Nuclear Source",
        effect: {
            power: 3
        }
    },
    fusionSource: {
        name: "Fusion Source",
        effect: {
            power: 6
        }
    },
    tachyonSource: {
        name: "Tachyon Source",
        effect: {
            power: 9
        }
    }, 
    zeroPointSource: {
        name: "Zero-Point Source",
        effect: {
            power: 12
        }
    },
    electronComputer: {
        name: "Electron Computer",
        effect: {
            computer: 1
        }
    },
    positronComputer: {
        name: "Positron Computer",
        effect: {
            computer: 2
        }
    },  
    gluonComputer: {
        name: "Gluon Computer",
        effect: {
            computer: 3
        }
    },
    fluxMissile: {
        name: "Flux Missile",
        effect: {
            ionMissile: 2
        }
    },
    ionCannon: {
        name: "Ion Cannon",
        effect: {
            ionCannon: 1
        }
    },
    plasmaCannon: {
        name: "Plasma Cannon",
        effect: {
            plasmaCannon: 1
        }
    },
    solitonCannon: {
        name: "Soliton Cannon",
        effect: {
            solitonCannon: 1
        }
    },
    antimatterCannon: {
        name: "Antimatter Cannon",
        effect: {
            antimatterCannon: 1
        }
    },
    gaussShield: {
        name: "Gauss Shield",
        effect: {
            shield: 1
        }
    },
    phaseShield: {
        name: "Phase Shield",
        effect: {
            shield: 2
        }
    },
    absorptionShield: {
        name: "Absorption Shield",
        effect: {
            shield: 1
        }
    },
    plasmaMissile: {
        name: "Plasma Missile",
        effect: {
            plasmaMissile: 2
        }
    }    
}; 
