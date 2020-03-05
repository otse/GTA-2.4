export var CarMetas;
(function (CarMetas) {
    function getNullable(name) {
        const meta = list[name];
        if (!meta) {
            console.warn('Car Metas null');
            return null;
        }
        return meta;
    }
    CarMetas.getNullable = getNullable;
    const list = {
        "Romero": {
            "IMG_WIDTH": 62,
            "IMG_HEIGHT": 64,
            "GOOD": "ye"
        },
        "Wellard": {
            "IMG_WIDTH": 44,
            "IMG_HEIGHT": 64,
            "GOOD": "ye",
            "ENGINE_TYPE": 3
        },
        "Aniston BD4": {
            "IMG_WIDTH": 62,
            "IMG_HEIGHT": 64,
            "GOOD": "ye",
            "ENGINE_TYPE": 2
        },
        "Pacifier": {
            "IMG_WIDTH": 50,
            "IMG_HEIGHT": 98,
            "GOOD": "ye",
            "COLORLESS": true,
            "DELTA_TRANSPARENCY": [
                1,
                1,
                1
            ],
            "ENGINE_TYPE": 6,
            "AIR_BRAKES": true
        },
        "G4 Bank Van": {
            "IMG_WIDTH": 60,
            "IMG_HEIGHT": 104,
            "GOOD": "ye",
            "COLORLESS": true,
            "ENGINE_TYPE": 4
        },
        "Beamer": {
            "IMG_WIDTH": 62,
            "IMG_HEIGHT": 64,
            "GOOD": "ye"
        },
        "Box Car": {
            "IMG_WIDTH": 42,
            "IMG_HEIGHT": 128,
            "NOTE": "the box car is a train",
            "GOOD": "ye",
            "COLORLESS": true,
            "NO_SPAWN": true
        },
        "Box Truck": {
            "IMG_WIDTH": 52,
            "IMG_HEIGHT": 128,
            "ENGINE_TYPE": 5,
            "AIR_BRAKES": true
        },
        "Bug": {
            "IMG_WIDTH": 50,
            "IMG_HEIGHT": 52,
            "GOOD": "ye",
            "ENGINE_TYPE": 1
        },
        "Bulwark": {
            "IMG_WIDTH": 64,
            "IMG_HEIGHT": 64
        },
        "Bus": {
            "IMG_WIDTH": 52,
            "IMG_HEIGHT": 128,
            "GOOD": "ye",
            "AIR_BRAKES": true,
            "COLORLESS": true
        },
        "Cop Car": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 64,
            "GOOD": "ye",
            "COLORLESS": true
        },
        "Minx": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 58,
            "GOOD": "ye"
        },
        "Eddy": {
            "IMG_WIDTH": 54,
            "IMG_HEIGHT": 62,
            "GOOD": "ye",
            "COLORLESS": true
        },
        "Panto": {
            "IMG_WIDTH": 62,
            "IMG_HEIGHT": 56,
            "GOOD": "ye",
            "ENGINE_TYPE": 1
        },
        "Fire Truck": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 124,
            "ENGINE_TYPE": 5,
            "AIR_BRAKES": true,
            "GOOD": "ye",
            "COLORLESS": true
        },
        "Shark": {
            "IMG_WIDTH": 54,
            "IMG_HEIGHT": 64,
            "GOOD": "ye"
        },
        "GT-A1": {
            "IMG_WIDTH": 54,
            "IMG_HEIGHT": 64
        },
        "Garbage Truck": {
            "IMG_WIDTH": 52,
            "IMG_HEIGHT": 86,
            "GOOD": "ye",
            "COLORLESS": true,
            "ENGINE_TYPE": 5,
            "AIR_BRAKES": true
        },
        "Armed Land Roamer": {
            "IMG_WIDTH": 42,
            "IMG_HEIGHT": 48,
            "GOOD": "ye",
            "COLORLESS": true
        },
        "Hot Dog Van": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 88,
            "GOOD": "ye",
            "COLORLESS": true,
            "ENGINE_TYPE": 4
        },
        "Ice-Cream Van": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 88,
            "GOOD": "ye",
            "COLORLESS": true,
            "ENGINE_TYPE": 4
        },
        "Dementia Limousine": {
            "IMG_WIDTH": 48,
            "IMG_HEIGHT": 78,
            "GOOD": "ye"
        },
        "Dementia": {
            "IMG_WIDTH": 50,
            "IMG_HEIGHT": 46,
            "GOOD": "ye"
        },
        "Land Roamer": {
            "IMG_WIDTH": 42,
            "IMG_HEIGHT": 48,
            "GOOD": "ye",
            "COLORLESS": true
        },
        "Jefferson": {
            "IMG_WIDTH": 46,
            "IMG_HEIGHT": 62,
            "ENGINE_TYPE": 3
        },
        "Stretch Limousine": {
            "IMG_WIDTH": 60,
            "IMG_HEIGHT": 112
        },
        "Sports Limousine": {
            "IMG_WIDTH": 56,
            "IMG_HEIGHT": 110
        },
        "Medicar": {
            "IMG_WIDTH": 62,
            "IMG_HEIGHT": 114,
            "GOOD": "ye",
            "COLORLESS": true
        },
        "Benson": {
            "IMG_WIDTH": 38,
            "IMG_HEIGHT": 64,
            "ENGINE_TYPE": 2
        },
        "Schmidt": {
            "IMG_WIDTH": 38,
            "IMG_HEIGHT": 56,
            "ENGINE_TYPE": 1
        },
        "Miara": {
            "IMG_WIDTH": 62,
            "IMG_HEIGHT": 64,
            "GOOD": "ye",
            "ENGINE_TYPE": 3
        },
        "Big Bug": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 58,
            "ENGINE_TYPE": 1
        },
        "Morton": {
            "IMG_WIDTH": 48,
            "IMG_HEIGHT": 60,
            "ENGINE_TYPE": 1
        },
        "Maurice": {
            "IMG_WIDTH": 56,
            "IMG_HEIGHT": 58
        },
        "Pickup": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 64,
            "ENGINE_TYPE": 1
        },
        "A-Type": {
            "IMG_WIDTH": 60,
            "IMG_HEIGHT": 64
        },
        "Arachnid": {
            "IMG_WIDTH": 54,
            "IMG_HEIGHT": 62
        },
        "Spritzer": {
            "IMG_WIDTH": 60,
            "IMG_HEIGHT": 56,
            "ENGINE_TYPE": 0
        },
        "Stinger": {
            "IMG_WIDTH": 52,
            "IMG_HEIGHT": 62,
            "ENGINE_TYPE": 2
        },
        "Meteor": {
            "IMG_WIDTH": 60,
            "IMG_HEIGHT": 64,
            "ENGINE_TYPE": 3
        },
        "Meteor Turbo": {
            "IMG_WIDTH": 60,
            "IMG_HEIGHT": 64,
            "ENGINE_TYPE": 3
        },
        "Hachura": {
            "IMG_WIDTH": 64,
            "IMG_HEIGHT": 64,
            "ENGINE_TYPE": 3
        },
        "B-Type": {
            "IMG_WIDTH": 56,
            "IMG_HEIGHT": 64
        },
        "Taxi Xpress": {
            "IMG_WIDTH": 56,
            "IMG_HEIGHT": 64,
            "COLORLESS": true
        },
        "SWAT Van": {
            "IMG_WIDTH": 64,
            "IMG_HEIGHT": 98,
            "GOOD": "ye",
            "COLORLESS": true,
            "ENGINE_TYPE": 4
        },
        "Michelli Roadster": {
            "IMG_WIDTH": 50,
            "IMG_HEIGHT": 64,
            "GOOD": "ye"
        },
        "Tank": {
            "IMG_WIDTH": 46,
            "IMG_HEIGHT": 82,
            "GOOD": "ye",
            "COLORLESS": true,
            "ENGINE_TYPE": 6,
            "MAX_SPEED_ORIG": 0.1
        },
        "Tanker": {
            "IMG_WIDTH": 40,
            "IMG_HEIGHT": 128,
            "NO_SPAWN": true,
            "COLORLESS": true
        },
        "Taxi": {
            "IMG_WIDTH": 60,
            "IMG_HEIGHT": 64,
            "GOOD": "ye",
            "COLORLESS": true
        },
        "T-Rex": {
            "IMG_WIDTH": 60,
            "IMG_HEIGHT": 64
        },
        "Tow Truck": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 80,
            "GOOD": "ye",
            "ENGINE_TYPE": 5,
            "AIR_BRAKES": true,
            "COLORLESS": true
        },
        "Train": {
            "IMG_WIDTH": 42,
            "IMG_HEIGHT": 128,
            "COLORLESS": true,
            "NO_SPAWN": true
        },
        "Train Cab": {
            "IMG_WIDTH": 40,
            "IMG_HEIGHT": 128,
            "COLORLESS": true,
            "NO_SPAWN": true
        },
        "Train FB": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 74,
            "COLORLESS": true,
            "NO_SPAWN": true
        },
        "Trance-Am": {
            "IMG_WIDTH": 54,
            "IMG_HEIGHT": 64,
            "GOOD": "ye",
            "ENGINE_TYPE": 3
        },
        "Truck Cab": {
            "IMG_WIDTH": 64,
            "IMG_HEIGHT": 64,
            "ENGINE_TYPE": 5,
            "AIR_BRAKES": true,
            "MAX_SPEED_ORIG": 0.175
        },
        "Truck Cab SX": {
            "IMG_WIDTH": 64,
            "IMG_HEIGHT": 64,
            "ENGINE_TYPE": 5,
            "AIR_BRAKES": true,
            "MAX_SPEED_ORIG": 0.165
        },
        "Container": {
            "IMG_WIDTH": 42,
            "IMG_HEIGHT": 128,
            "COLORLESS": true,
            "NO_SPAWN": true
        },
        "Transporter": {
            "IMG_WIDTH": 40,
            "IMG_HEIGHT": 128,
            "NOTE": "this is a trailer",
            "COLORLESS": true,
            "NO_SPAWN": true
        },
        "TV Van": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 74,
            "ENGINE_TYPE": 4
        },
        "Van": {
            "IMG_WIDTH": 58,
            "IMG_HEIGHT": 74,
            "ENGINE_TYPE": 4
        },
        "U-Jerk Truck": {
            "IMG_WIDTH": 54,
            "IMG_HEIGHT": 56,
            "ENGINE_TYPE": 1
        },
        "Z-Type": {
            "IMG_WIDTH": 56,
            "IMG_HEIGHT": 64,
            "ENGINE_TYPE": 3
        },
        "Rumbler": {
            "IMG_WIDTH": 56,
            "IMG_HEIGHT": 64,
            "ENGINE_TYPE": 3
        },
        "Jagular XK": {
            "IMG_WIDTH": 52,
            "IMG_HEIGHT": 64
        },
        "Furore GT": {
            "IMG_WIDTH": 50,
            "IMG_HEIGHT": 64,
            "ENGINE_TYPE": 3
        },
        "Special Agent Car": {
            "IMG_WIDTH": 64,
            "IMG_HEIGHT": 64,
            "NOTE": "this is an eddy with remap 2 (black)",
            "NO_SPAWN": true
        },
        "Karma Bus": {
            "IMG_WIDTH": 44,
            "IMG_HEIGHT": 100,
            "GOOD": "ye",
            "COLORLESS": true,
            "AIR_BRAKES": true
        }
    };
})(CarMetas || (CarMetas = {}));
export default CarMetas;
