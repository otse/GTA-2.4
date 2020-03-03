//import { Object2 } from './object';

export type DataType =
	'Ignore' |	'Car' |  'Ped' | 'Ply' | 'Rectangle' | 'Block' | 'Surface' | 'Lamp';

export interface Data2 {
	type: DataType;
	x: number;
	y: number;
	z?: number;
	r?: number;
	f?: boolean;
	color?: string;
	sty?: string;
	shadow?: boolean;

	// ped
	clothes?: string;
	remap?: number;

	// plane
	width?: number;
	height?: number;

	// plane atlasing
	sheet?: string;
	square?: string;

	// block
	faces?: [string?, string?, string?, string?, string?];
	slope?: [number, number, number, number];
	wedge?: [boolean, boolean, boolean, boolean];

	right?: string;
	left?: string;
	front?: string;
	back?: string;
	top?: string;
	bottom?: string;

	// car
	carName?: string; // gci.keys;
	paint?: number;

	// lamp
	intensity?: number;
	radius?: number;

	// meta
	celled?: boolean;
	object2?: Object2 | null;
	stacked?: boolean;
};

export default Data2;