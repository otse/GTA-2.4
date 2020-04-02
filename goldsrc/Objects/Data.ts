import { Object2 } from './Object';

// todo, obviously simplify this someday

export type DataType =
	'Ignore' |	'Car' |  'Ped' | 'Ply' | 'Rectangle' | 'Block' | 'Surface' | 'Wall' | 'Lamp';

export interface Data2 {
	type: DataType;
	x: number;
	y: number;
	z: number;
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
	sprite?: Square;

	// wall
	style?: string;
	wall?: 'concave' | 'convex' | 'side';

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
	car?: string; // gci.keys;
	spray?: number;

	// lamp
	intensity?: number;
	radius?: number;

	// meta
	celled?: boolean;
	object?: Object2 | null;
	stacked?: boolean;

	// road blend settings
	adapt_sheet?: boolean;
};

export default Data2;