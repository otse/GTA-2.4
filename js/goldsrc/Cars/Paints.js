import CarPhysics from "./Every line is a physic";
import CarMetas from "./Metas";
// Automobiles, trains
// Resources
// https://gta.fandom.com/wiki/Vehicles_in_GTA_2
// http://en.wikigta.org/wiki/Code_lists_%28GTA2%29
var PaintJobs;
(function (PaintJobs) {
    let Enum;
    (function (Enum) {
        Enum[Enum["BLUE1"] = 0] = "BLUE1";
        Enum[Enum["PURPLE1"] = 1] = "PURPLE1";
        Enum[Enum["BLACK"] = 2] = "BLACK";
        Enum[Enum["BLUE2"] = 3] = "BLUE2";
        Enum[Enum["BLUE_GRAY"] = 4] = "BLUE_GRAY";
        Enum[Enum["BRIGHT_GREEN"] = 5] = "BRIGHT_GREEN";
        Enum[Enum["BRIGHT_RED"] = 6] = "BRIGHT_RED";
        Enum[Enum["BROWN1"] = 7] = "BROWN1";
        Enum[Enum["BROWN2"] = 8] = "BROWN2";
        Enum[Enum["SILVER_BLUE"] = 9] = "SILVER_BLUE";
        Enum[Enum["CREAM"] = 10] = "CREAM";
        Enum[Enum["YELLOW"] = 11] = "YELLOW";
        Enum[Enum["CYAN"] = 12] = "CYAN";
        Enum[Enum["DARK_BEIGE"] = 13] = "DARK_BEIGE";
        Enum[Enum["DARK_BLUE"] = 14] = "DARK_BLUE";
        Enum[Enum["DEEP_BLUE"] = 15] = "DEEP_BLUE";
        Enum[Enum["DARK_GREEN"] = 16] = "DARK_GREEN";
        Enum[Enum["DARK_RED"] = 17] = "DARK_RED";
        Enum[Enum["DARK_RUST"] = 18] = "DARK_RUST";
        Enum[Enum["GOLD"] = 19] = "GOLD";
        Enum[Enum["GREEN"] = 20] = "GREEN";
        Enum[Enum["GRAY"] = 21] = "GRAY";
        Enum[Enum["YELLOW_GREEN"] = 22] = "YELLOW_GREEN";
        Enum[Enum["OLIVE"] = 23] = "OLIVE";
        Enum[Enum["ORANGE"] = 24] = "ORANGE";
        Enum[Enum["PALE_BLUE"] = 25] = "PALE_BLUE";
        Enum[Enum["PINK_RED"] = 26] = "PINK_RED";
        Enum[Enum["PURPLE2"] = 27] = "PURPLE2";
        Enum[Enum["RED"] = 28] = "RED";
        Enum[Enum["RUST"] = 29] = "RUST";
        Enum[Enum["SILVER"] = 30] = "SILVER";
        Enum[Enum["SKY_BLUE"] = 31] = "SKY_BLUE";
        Enum[Enum["TURQUOISE"] = 32] = "TURQUOISE";
        Enum[Enum["WHITE_GRAY"] = 33] = "WHITE_GRAY";
        Enum[Enum["WHITE"] = 34] = "WHITE";
        Enum[Enum["COP"] = 35] = "COP";
    })(Enum = PaintJobs.Enum || (PaintJobs.Enum = {}));
    PaintJobs.deltasSheets = {};
    function init() {
        const list = CarPhysics.List();
        for (let name in list) {
            const physic = list[name];
            const meta = CarMetas.getNullable(name);
            const sheet = {
                file: `D_GTA2_CAR_${physic.model}`,
                padding: 4,
                width: (meta.IMG_WIDTH * 10) + 36,
                height: (meta.IMG_HEIGHT * 2) + 4,
                nr: {
                    w: 10,
                    h: 2
                },
                piece: {
                    w: meta.IMG_WIDTH,
                    h: meta.IMG_HEIGHT
                }
            };
            PaintJobs.deltasSheets[name] = sheet;
        }
        console.log('build car delta sheets');
        window.carsDeltas = PaintJobs.deltasSheets;
    }
    PaintJobs.init = init;
    const squares = {
        dent_behind_left: { x: 1, y: 1 },
        dent_behind_right: { x: 2, y: 1 },
        dent_front_right: { x: 3, y: 1 },
        dent_front_left: { x: 4, y: 1 },
        dent_in_the_roof_here: { x: 5, y: 1 },
        tail_light_right: { x: 6, y: 1 },
        tail_light_left: { x: 6, y: 1 },
        head_light_right: { x: 7, y: 1 },
        head_light_left: { x: 7, y: 1 },
        front_door1: { x: 8, y: 1 },
        front_door2: { x: 9, y: 1 },
        front_door3: { x: 10, y: 1 },
        front_door4: { x: 1, y: 2 },
        rear_door1: { x: 2, y: 2 },
        rear_door2: { x: 3, y: 2 },
        rear_door3: { x: 4, y: 2 },
        rear_door4: { x: 5, y: 2 },
        tv_van_dish: { x: 6, y: 2 }
    };
})(PaintJobs || (PaintJobs = {}));
export default PaintJobs;
