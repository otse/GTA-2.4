import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";

export interface Scenario {
	name: string;
	load: () => any;
	update: () => any;
};

export default Scenario;