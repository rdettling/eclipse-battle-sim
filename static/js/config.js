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
            power: 0,
        },
        defaultUpgrades: ["ionCannon", "nuclearDrive", "nuclearSource"], // Default upgrades for interceptor
    },
    cruiser: {
        maxCount: 4,
        upgradeSlots: 6,
        baseStats: {
            hull: 0,
            computer: 0,
            shield: 0,
            initiative: 1,
            power: 0,
        },
        defaultUpgrades: [
            "ionCannon",
            "nuclearDrive",
            "hull",
            "electronComputer",
            "nuclearSource",
        ], // Default upgrades for cruiser
    },
    dreadnaught: {
        maxCount: 2,
        upgradeSlots: 8,
        baseStats: {
            hull: 0,
            computer: 0,
            shield: 0,
            initiative: 0,
            power: 0,
        },
        defaultUpgrades: [
            "hull",
            "hull",
            "nuclearDrive",
            "nuclearSource",
            "electronComputer",
            "ionCannon",
            "ionCannon",
        ],
    },
    starbase: {
        maxCount: 4,
        upgradeSlots: 5,
        baseStats: {
            hull: 0,
            computer: 0,
            shield: 0,
            initiative: 4,
            power: 3,
        },
        defaultUpgrades: ["hull", "hull", "electronComputer", "ionCannon"],
    },
    ancient: {
        maxCount: 2,
        upgradeSlots: 3,
        baseStats: {
            hull: 1,
            computer: 0,
            shield: 0,
            initiative: 2,
            power: 0,
        },
        defaultUpgrades: ["electronComputer", "ionCannon", "ionCannon"],
    },
    guardian: {
        maxCount: 1,
        upgradeSlots: 4,
        baseStats: {
            hull: 2,
            computer: 0,
            shield: 0,
            initiative: 3,
            power: 0,
        },
        defaultUpgrades: [
            "ionCannon",
            "ionCannon",
            "ionCannon",
            "positronComputer",
        ], // Default upgrades for guardian
    },
    gcds: {
        maxCount: 1,
        upgradeSlots: 5,
        baseStats: {
            hull: 3,
            computer: 0,
            shield: 0,
            initiative: 2,
            power: 0,
        },
        defaultUpgrades: [
            "fluxMissile",
            "fluxMissile",
            "antimatterCannon",
            "positronComputer",
        ], // Default upgrades for gcds
    },
};

// Ship display names
const shipDisplayNames = {
    interceptor: "Interceptor",
    cruiser: "Cruiser",
    dreadnaught: "Dreadnaught",
    starbase: "Starbase",
    ancient: "Ancient",
    guardian: "Guardian",
    gcds: "GCDS",
};

// Available upgrades
const availableUpgrades = {
    hull: {
        image: "hull.png",
        name: "Hull",
        effect: {
            hull: 1,
        },
    },
    improvedHull: {
        image: "improved_hull.png",
        name: "Improved Hull",
        effect: {
            hull: 2,
        },
    },
    conifoldField: {
        image: "conifold_field.png",
        name: "Conifold Field",
        effect: {
            hull: 3,
            cost: 2,
        },
    },
    sentientHull: {
        image: "sentient_hull.png",
        name: "Sentient Hull",
        effect: {
            hull: 1,
            computer: 1,
        },
    },
    nuclearDrive: {
        image: "nuclear_drive.png",
        name: "Nuclear Drive",
        effect: {
            initiative: 1,
            cost: 1,
        },
    },
    fushionDrive: {
        image: "fusion_drive.png",
        name: "Fushion Drive",
        effect: {
            initiative: 2,
            cost: 2,
        },
    },
    transitionDrive: {
        image: "transition_drive.png",
        name: "Transition Drive",
        effect: {},
    },
    tachyonDrive: {
        image: "tachyon_drive.png",
        name: "Tachyon Drive",
        effect: {
            initiative: 3,
            cost: 3,
        },
    },
    nuclearSource: {
        image: "nuclear_source.png",
        name: "Nuclear Source",
        effect: {
            power: 3,
        },
    },
    fusionSource: {
        image: "fusion_source.png",
        name: "Fusion Source",
        effect: {
            power: 6,
        },
    },
    tachyonSource: {
        image: "tachyon_source.png",
        name: "Tachyon Source",
        effect: {
            power: 9,
        },
    },
    zeroPointSource: {
        image: "zero-point_source.png",
        name: "Zero-Point Source",
        effect: {
            power: 12,
        },
    },
    electronComputer: {
        image: "electron_computer.png",
        name: "Electron Computer",
        effect: {
            computer: 1,
        },
    },
    positronComputer: {
        image: "positron_computer.png",
        name: "Positron Computer",
        effect: {
            computer: 2,
            cost: 1,
        },
    },
    gluonComputer: {
        image: "gluon_computer.png",
        name: "Gluon Computer",
        effect: {
            computer: 3,
            cost: 2,
        },
    },
    fluxMissile: {
        image: "flux_missile.png",
        name: "Flux Missile",
        effect: {
            ionMissile: 2,
            initiative: 1,
        },
    },
    ionCannon: {
        image: "ion_cannon.png",
        name: "Ion Cannon",
        effect: {
            ionCannon: 1,
            cost: 1,
        },
    },
    plasmaCannon: {
        image: "plasma_cannon.png",
        name: "Plasma Cannon",
        effect: {
            plasmaCannon: 1,
            cost: 2,
        },
    },
    solitonCannon: {
        image: "soliton_cannon.png",
        name: "Soliton Cannon",
        effect: {
            solitonCannon: 1,
            cost: 3,
        },
    },
    antimatterCannon: {
        image: "antimatter_cannon.png",
        name: "Antimatter Cannon",
        effect: {
            antimatterCannon: 1,
            cost: 4,
        },
    },
    gaussShield: {
        image: "gauss_shield.png",
        name: "Gauss Shield",
        effect: {
            shield: 1,
        },
    },
    phaseShield: {
        image: "phase_shield.png",
        name: "Phase Shield",
        effect: {
            shield: 2,
            cost: 1,
        },
    },
    absorptionShield: {
        image: "absorption_shield.png",
        name: "Absorption Shield",
        effect: {
            shield: 1,
            power: 4,
        },
    },
    plasmaMissile: {
        image: "plasma_missile.png",
        name: "Plasma Missile",
        effect: {
            plasmaMissile: 2,
            cost: 1,
        },
    },
    axionComputer: {
        image: "axion_computer.png",
        name: "Axion Computer",
        effect: {
            computer: 2,
        },
    },
    ionDisruptor: {
        image: "ion_disruptor.png",
        name: "Ion Disruptor",
        effect: {
            ionCannon: 1,
        },
    },
    inversionShield: {
        image: "inversion_shield.png",
        name: "Inversion Shield",
        effect: {
            shield: 2,
            power: 2,
        },
    },
    ionMissile: {
        image: "ion_missile.png",
        name: "Ion Missile",
        effect: {
            ionMissile: 3,
        },
    },
    antimatterMissile: {
        image: "antimatter_missile.png",
        name: "Antimatter Missile",
        effect: {
            antimatterMissile: 1,
        },
    },
    shardHull: {
        image: "shard_hull.png",
        name: "Shard Hull",
        effect: {
            hull: 3,
        },
    },
    nonlinearDrive: {
        image: "nonlinear_drive.png",
        name: "Nonlinear Drive",
        effect: {
            power: 2,
        },
    },
    solitonCharger: {
        image: "soliton_charger.png",
        name: "Soliton Charger",
        effect: {
            solitonCannon: 1,
        },
    },
    muonSource: {
        image: "muon_source.png",
        name: "Muon Source",
        effect: {
            power: 2,
            initiative: 1,
        },
    },
    conformalDrive: {
        image: "conformal_drive.png",
        name: "Conformal Drive",
        effect: {
            initiative: 2,
            cost: 2,
        },
    },
    hypergridSource: {
        image: "hypergrid_source.png",
        name: "Hypergrid Source",
        effect: {
            power: 11,
        },
    },
    plasmaTurret: {
        image: "plasma_turret.png",
        name: "Plasma Turret",
        effect: {
            plasmaCannon: 2,
            cost: 3,
        },
    },
    fluxShield: {
        image: "flux_shield.png",
        name: "Flux Shield",
        effect: {
            shield: 3,
            initiative: 1,
            cost: 2,
        },
    },
    ionTurret: {
        image: "ion_turret.png",
        name: "Ion Turret",
        effect: {
            ionCannon: 2,
        },
    },
    solitonMissile: {
        image: "soliton_missile.png",
        name: "Soliton Missile",
        effect: {
            solitonMissile: 1,
            cost: 1,
        },
    }
};

// Alien race configurations
const alienRaces = {
    human: {
        name: "Human",
        description: "Balanced race with no special bonuses",
        shipOverrides: {}
    },
    orion_hegemony: {
        name: "Orion Hegemony",
        description: "Advanced technology with improved computers",
        shipOverrides: {
            interceptor: {
                baseStats: {
                    initiative: 3
                },
                defaultUpgrades: ["ionCannon", "nuclearDrive", "nuclearSource", 'gaussShield']
            },
            cruiser: {
                baseStats: {
                    initiative: 2,
                    power: 2
                },
                defaultUpgrades: [
                    "ionCannon",
                    "nuclearDrive",
                    "hull",
                    "electronComputer",
                    "nuclearSource",
                    'gaussShield'
                ]
            },
            dreadnaught: {
                baseStats: {
                    power: 3
                },
                defaultUpgrades: [
                    "hull",
                    "hull",
                    "nuclearDrive",
                    "nuclearSource",
                    'electronComputer',
                    'ionCannon',
                    'ionCannon',
                    'gaussShield'
                ]
            },
            starbase: {
                baseStats: {
                    initiative: 5,
                    power: 3
                },
                defaultUpgrades: [
                    'hull',
                    'hull',
                    'electronComputer',
                    'ionCannon',
                    'gaussShield'
                ]
            }
        }
    },
    planta: {
        name: "Planta",
        description: "Planta race with improved shields and computers",
        shipOverrides: {
            interceptor: {
                baseStats: {
                    initiative: 0,
                    power: 2,
                    computer: 1
                },
                upgradeSlots: 3,
                defaultUpgrades: [
                    'ionCannon',
                    'nuclearSource',
                    'nuclearDrive'
                ]
            },
            cruiser: {
                baseStats: {
                    initiative: 0,
                    power: 2,
                    computer: 1
                },
                upgradeSlots: 5,
                defaultUpgrades: [
                    'ionCannon',
                    'nuclearSource',
                    'nuclearDrive',
                    'hull',
                ]
            },
            dreadnaught: {
                baseStats: {
                    power: 2,
                    computer: 1
                },
                upgradeSlots: 7,
                defaultUpgrades: [
                    'hull',
                    'hull',
                    'nuclearDrive',
                    'nuclearSource',
                    'ionCannon',
                    'ionCannon',
                ]
            },
            starbase: {
                baseStats: {
                    initiative: 2,
                    power: 5,
                    computer: 1
                },
                upgradeSlots: 4,
                defaultUpgrades: [
                    'hull',
                    'hull',
                    'electronComputer',
                    'ionCannon']
            }
        }
    },
    eridani_empire: {
        name: "Eridani Empire",
        description: "Eridani Empire race with improved shields and computers",
        shipOverrides: {
            interceptor: {
                baseStats: {
                    power: 1
                }
            },
            cruiser: {
                baseStats: {
                    power: 1
                }
            },
            dreadnaught: {
                baseStats: {
                    power: 1
                }
            }
        }
    }
};
