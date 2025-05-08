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
        image: "hull.png",
        name: "Hull",
        effect: {
            hull: 1
        }
    },
    improvedHull: {
        image: "improved_hull.png",
        name: "Improved Hull",
        effect: {
            hull: 2
        }
    },
    conifoldField: {
        image: "conifold_field.png",
        name: "Conifold Field",
        effect: {
            hull: 3
        }
    },
    sentientHull: {
        image: "sentient_hull.png",
        name: "Sentient Hull",
        effect: {
            hull: 1,
            computer: 1,
        }
    },
    nuclearDrive: {
        image: "nuclear_drive.png",
        name: "Nuclear Drive",
        effect: {
            initiative: 1
        }
    },
    fushionDrive: {
        image: "fusion_drive.png",
        name: "Fushion Drive",
        effect: {
            initiative: 2
        }
    },
    transitionDrive: {
        image: "transition_drive.png",
        name: "Transition Drive",
        effect: {
        }
    },
    tachyonDrive: {
        image: "tachyon_drive.png",
        name: "Tachyon Drive",
        effect: {
            initiative: 3
        }
    },
    nuclearSource: {
        image: "nuclear_source.png",
        name: "Nuclear Source",
        effect: {
            power: 3
        }
    },
    fusionSource: {
        image: "fusion_source.png",
        name: "Fusion Source",
        effect: {
            power: 6
        }
    },
    tachyonSource: {
        image: "tachyon_source.png",
        name: "Tachyon Source",
        effect: {
            power: 9
        }
    }, 
    zeroPointSource: {
        image: "zero-point_source.png",
        name: "Zero-Point Source",
        effect: {
            power: 12
        }
    },
    electronComputer: {
        image: "electron_computer.png",
        name: "Electron Computer",
        effect: {
            computer: 1
        }
    },
    positronComputer: {
        image: "positron_computer.png",
        name: "Positron Computer",
        effect: {
            computer: 2
        }
    },  
    gluonComputer: {
        image: "gluon_computer.png",
        name: "Gluon Computer",
        effect: {
        }
    },
    fluxMissile: {
        image: "flux_missile.png",
        name: "Flux Missile",
        effect: {
        }
    },
    ionCannon: {
        image: "ion_cannon.png",
        name: "Ion Cannon",
        effect: {
        }
    },
    plasmaCannon: {
        image: "plasma_cannon.png",
        name: "Plasma Cannon",
        effect: {
        }
    },
    solitonCannon: {
        image: "soliton_cannon.png",
        name: "Soliton Cannon",
        effect: {
        }
    },
    antimatterCannon: {
        image: "antimatter_cannon.png",
        name: "Antimatter Cannon",
        effect: {
        }
    },
    gaussShield: {
        image: "gauss_shield.png",
        name: "Gauss Shield",
        effect: {
            shield: 1
        }
    },
    phaseShield: {
        image: "phase_shield.png",
        name: "Phase Shield",
        effect: {
            shield: 2
        }
    },
    absorptionShield: {
        image: "absorption_shield.png",
        name: "Absorption Shield",
        effect: {
            shield: 1
        }
    },
    plasmaMissile: {
        image: "plasma_missile.png",
        name: "Plasma Missile",
        effect: {
        }
    }    
}; 
