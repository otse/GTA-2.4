import Datas from "../Objects/Datas";
//import { parkedCarNames } from "../Cars/Script codes";
//import Cars from "../cars/cars";
export var GenParking;
(function (GenParking) {
    function onewayRightVert(w, segs, lanes, sheet) {
        if (lanes < 2)
            console.warn('OnewayRightVert less than 2 lanes');
        let seg = 0;
        for (; seg < segs; seg++) {
            let lane = 0;
            for (; lane < lanes; lane++) {
                let road = {
                    type: 'Surface',
                    sheet: sheet,
                    square: 'sideLine',
                    x: lane + w[0],
                    y: seg + w[1],
                    z: w[2],
                    r: !lane ? 3 : 1
                };
                let parkedCar = {
                    type: 'Car',
                    ///carName: Cars.GetRandomName(),
                    x: road.x,
                    y: road.y,
                    z: road.z
                };
                let parkHere = false;
                if (!seg || seg == segs - 1) {
                    if (!lane) {
                        road.square = 'singleOpen';
                        if (!seg)
                            road.r += 1;
                        else if (seg == segs - 1)
                            road.r -= 1;
                    }
                    else {
                        //road.square = 'sideLine';
                        //road.r = !seg ? 0 : 2;
                        continue; // Skip
                    }
                }
                else if (seg == 1 || seg == segs - 2) {
                    if (!lane) {
                        road.square = 'customNotch';
                        road.r = 1;
                        if (seg == 1)
                            road.f = true;
                    }
                    else if (lane == lanes - 1) {
                        road.square = 'corner';
                        road.r = seg == 1 ? 0 : 3;
                        if (seg != 1) {
                            parkedCar.r = Math.PI / 4;
                            parkedCar.x = road.x + .5;
                            parkedCar.y = road.y - .11;
                            parkHere = true;
                        }
                    }
                    else {
                        road.r = seg == 1 ? 2 : 0;
                    }
                }
                else if (lane) {
                    if (lane == lanes - 1) {
                        road.square = 'parkingSpot';
                        parkedCar.r = Math.PI / 4;
                        parkedCar.x = road.x + .5;
                        parkedCar.y = road.y - .11;
                        parkHere = true;
                    }
                    else
                        road.square = 'clear';
                }
                if (parkHere && Math.random() < .75)
                    Datas.deliver(parkedCar);
                Datas.replaceDeliver(road);
            }
        }
    }
    GenParking.onewayRightVert = onewayRightVert;
    function Big(w, segs, lanes, r, sheet) {
    }
    GenParking.Big = Big;
    function leftBigHorz(w, segs, lanes, sheet) {
        lanes = 4;
        let seg = 0;
        for (; seg < segs; seg++) {
            let lane = 0;
            for (; lane < lanes; lane++) {
                let road = {
                    type: 'Surface',
                    sheet: sheet,
                    square: 'sideLine',
                    x: seg + w[0],
                    y: lane + w[1],
                    z: w[2],
                    r: 1
                };
                let parkedCar = {
                    type: 'Car',
                    ///carName: Cars.GetRandomName(),
                    x: road.x,
                    y: road.y,
                    z: road.z
                };
                let parkHere = false;
                if (!seg) {
                    if (lane == 1) {
                        road.square = 'convexLine';
                        road.r += 1;
                    }
                    else if (lane == 2) {
                        road.square = 'convexLine';
                    }
                    else {
                        continue;
                    }
                }
                else if (seg == 1) {
                    if (lane == 1) {
                        road.square = 'sideLine';
                        road.r += 1;
                    }
                    else if (lane == 2) {
                        road.square = 'sideLine';
                        road.r -= 1;
                    }
                    else {
                        continue;
                    }
                }
                else if (seg == 2) {
                    if (lane == 0) {
                        road.square = 'corner';
                        parkHere = true;
                        parkedCar.r = Math.PI / 4;
                        parkedCar.x = road.x + 0.5 + 0.6;
                        parkedCar.y = road.y + 0.5;
                    }
                    else if (lane == 1) {
                        road.square = 'convexLine';
                        road.r += 2;
                    }
                    else if (lane == 2) {
                        road.square = 'convexLine';
                        road.r -= 1;
                    }
                    else if (lane == 3) {
                        road.square = 'corner';
                        road.r += 1;
                        parkHere = true;
                        parkedCar.r = Math.PI - Math.PI / 4;
                        parkedCar.x = road.x + 0.5 + 0.6;
                        parkedCar.y = road.y + 0.5;
                    }
                }
                else if (seg == segs - 1) {
                    if (lane == 0) {
                        road.square = 'corner';
                        road.r -= 1;
                    }
                    else if (lane == 3) {
                        road.square = 'corner';
                        road.r += 2;
                    }
                    else {
                        road.square = 'sideClear';
                    }
                }
                else if (lane == 1 || lane == 2) {
                    road.square = 'clear';
                }
                else if (lane != 1) {
                    road.square = 'parkingSpot';
                    parkHere = true;
                    // Bottom
                    if (!lane) {
                        road.r += 1;
                        road.f = true;
                        parkedCar.r = Math.PI / 4;
                        parkedCar.x = road.x + 0.5 + 0.6;
                        parkedCar.y = road.y + 0.5;
                    }
                    // Top
                    else {
                        road.r -= 1;
                        parkedCar.r = Math.PI - Math.PI / 4;
                        parkedCar.x = road.x + 0.5 + 0.6;
                        parkedCar.y = road.y + 0.5;
                    }
                }
                if (parkHere && Math.random() > .5)
                    Datas.deliver(parkedCar);
                Datas.replaceDeliver(road);
            }
        }
    }
    GenParking.leftBigHorz = leftBigHorz;
})(GenParking || (GenParking = {}));
export default GenParking;
