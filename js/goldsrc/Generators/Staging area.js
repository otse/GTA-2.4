import Datas from "../Objects/Datas";
class StagingArea {
    constructor() {
        this.datas = [];
    }
    addData(data) {
        this.datas.push(data);
        this.findExtents();
    }
    addDatas(datas) {
        this.datas = this.datas.concat(datas);
        this.findExtents();
    }
    deliverAll() {
        for (let data of this.datas)
            Datas.replaceDeliver(data);
    }
    findExtents() {
        let set = false;
        for (let data of this.datas) {
            // aabb
            if (!set) {
                this.min = [data.x, data.y, data.z];
                this.max = [data.x, data.y, data.z];
                set = true;
            }
            this.min[0] = Math.min(data.x, this.min[0]);
            this.min[1] = Math.min(data.y, this.min[1]);
            this.min[2] = Math.min(data.z, this.min[2]);
            this.max[0] = Math.max(data.x, this.max[0]);
            this.max[1] = Math.max(data.y, this.max[1]);
            this.max[2] = Math.max(data.z, this.max[2]);
        }
    }
    turnCCW(turns) {
        this.findExtents();
        let newDatas = [];
        for (let y = 0; y < this.max[1]; y++) {
            for (let x = 0; x < this.min[0]; x++) {
            }
        }
    }
}
export default StagingArea;
