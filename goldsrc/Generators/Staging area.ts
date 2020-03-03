import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";

import Gen from "./Gen";

class StagingArea {

	min: [number, number, number]
	max: [number, number, number]

	datas: Data2[] = []

	constructor() {
		
	}

	addData(data: Data2) {
		this.datas.push(data);

		this.findExtents();
	}

	addDatas(datas: Data2[]) {
		this.datas = this.datas.concat(datas);

		this.findExtents();
	}

	deliverAll() {
		for (let data of this.datas)
			Datas.replaceDeliver(data);
	}

	private findExtents() {
		let set = false;

		for (let data of this.datas) {
			
			// aabb
			if (!set) {
				this.min = [data.x, data.y, data.z!];
				this.max = [data.x, data.y, data.z!];
				set = true;
			}

			this.min[0] = Math.min(data.x, this.min[0]);
			this.min[1] = Math.min(data.y, this.min[1]);
			this.min[2] = Math.min(data.z!, this.min[2]);
			this.max[0] = Math.max(data.x, this.max[0]);
			this.max[1] = Math.max(data.y, this.max[1]);
			this.max[2] = Math.max(data.z!, this.max[2]);
		}
	}

	turnCCW(turns: number) {
		this.findExtents();

		let newDatas: Data2[] = [];

		for (let y = 0; y < this.max[1]; y++) {
			for (let x = 0; x < this.min[0]; x++) {

			}
		}
	}
}


export default StagingArea;