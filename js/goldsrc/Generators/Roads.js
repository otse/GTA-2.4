import Datas from '../Objects/Datas';
import StagingArea from './Staging area';
export var GenRoads;
(function (GenRoads) {
    function oneway(axis, w, segs, sheet) {
        //console.log('oneway axis ', axis);
        let staging = new StagingArea;
        let datas;
        datas = twolane2(w, segs, sheet);
        staging.addDatas(datas);
        if (axis == 1)
            staging.ccw(1);
        staging.deliverAll();
    }
    GenRoads.oneway = oneway;
    function oneway2(w, segs, sheet) {
        let seg = 0;
        for (; seg < segs; seg++) {
            let road = {
                type: 'Surface',
                sheet: sheet,
                square: 'single',
                x: w[0],
                y: seg + w[1],
                z: w[2],
                r: 3
            };
            if (!seg || seg == segs - 1) {
                road.square = 'singleOpen';
                if (!seg)
                    road.r += 1;
                else if (seg == segs - 1)
                    road.r -= 1;
            }
            Datas.replaceDeliver(road);
        }
    }
    function twolane(axis, w, segs, sheet) {
        // Go 0 or 1
        console.log('twolane axis ', axis);
        let staging = new StagingArea;
        let datas;
        datas = twolane2(w, segs, sheet);
        staging.addDatas(datas);
        if (axis == 1)
            staging.ccw(1);
        staging.deliverAll();
    }
    GenRoads.twolane = twolane;
    function twolane2(w, segs, sheet) {
        let datas = [];
        const lanes = 2;
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
                    r: !lane ? 2 : 0
                };
                if (!seg || seg == segs - 1) {
                    road.square = 'convexLine';
                    if (!seg && lane ||
                        seg == segs - 1 && !lane)
                        road.r += 1;
                }
                else if (lane == lanes - 1 && seg == 1 ||
                    !lane && seg == segs - 2) {
                    road.square = 'sideStopLine'; // sideStopLine
                    road.f = true;
                }
                datas.push(road);
                ///Datas.replaceDeliver(road);
            }
        }
        return datas;
    }
    function highway(axis, w, segs, lanes, sheet) {
        let staging = new StagingArea;
        let datas;
        datas = highway2(w, segs, lanes, sheet);
        staging.addDatas(datas);
        if (axis == 0)
            staging.ccw(1);
        staging.deliverAll();
    }
    GenRoads.highway = highway;
    function highway2(w, segs, lanes, sheet) {
        let datas = [];
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
                    r: !lane ? 3 : 1
                };
                if (lane > 0 && lane < lanes - 1)
                    road.square = 'middleTracks';
                else if (!seg || seg == segs - 1) {
                    road.square = 'convexLine';
                    if (!seg && !lane ||
                        seg == segs - 1 && lane)
                        road.r += 1;
                }
                /*else if (lane == lanes - 1 && seg == 1 ||
                    !lane && seg == segs - 2) {
                    road.square = 'sideStopLine';
                }*/
                datas.push(road);
                ///Datas.replaceDeliver(road);
            }
        }
        return datas;
    }
})(GenRoads || (GenRoads = {}));
export default GenRoads;
