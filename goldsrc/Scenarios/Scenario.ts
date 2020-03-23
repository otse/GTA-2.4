import Data2 from "../Objects/Data";
import Datas from "../Objects/Datas";

export interface Scenario {
	name: string;
	loadCb: () => void;
	updateCb: () => void;
};

export default Scenario;