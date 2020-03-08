import Anims from "../Sprites/Anims";

const walkSquares = [
	{ x: 1, y: 1 },
	{ x: 2, y: 1 },
	{ x: 3, y: 1 },
	{ x: 4, y: 1 },
	{ x: 5, y: 1 },
	{ x: 6, y: 1 },
	{ x: 7, y: 1 },
	{ x: 8, y: 1 }
];

const runSquares = [
	{ x: 1, y: 2 },
	{ x: 2, y: 2 },
	{ x: 3, y: 2 },
	{ x: 4, y: 2 },
	{ x: 5, y: 2 },
	{ x: 6, y: 2 },
	{ x: 7, y: 2 },
	{ x: 8, y: 2 }
];

const scratchSquares = [
	{ x: 1, y: 8 },
	{ x: 2, y: 8 },
	{ x: 3, y: 8 },
	{ x: 4, y: 8 },
	{ x: 5, y: 8 },
	{ x: 6, y: 8 },
	{ x: 7, y: 8 },
	{ x: 8, y: 8 },
	{ x: 1, y: 9 },
	{ x: 2, y: 9 },
	{ x: 3, y: 9 },
	{ x: 4, y: 9 }
];

const m = .11;

export const pedDefs: Readonly<{ [anim: string]: Anims.Def }> = {
	other:      { frames: 8, moment: .08 },
	walk:       { frames: 8, moment: .11, spriteArray: walkSquares },
	run:        { frames: 8, moment: .08, spriteArray: runSquares },
	scratch:    { frames: 12,moment: .16, spriteArray: scratchSquares },
	punch:      { frames: 8, moment: m },
	walkpunch:  { frames: 8, moment: m },
	runpunch:   { frames: 8, moment: .08 },
	walkgun:    { frames: 8, moment: m },
	rungun:     { frames: 8, moment: .08 },
	jump:       { frames: 8, moment: m },
	door:       { frames: 8, moment: .14 },
	sit:        { frames: 5, moment: m },
	drop:       { frames: 8, moment: m },
	trip1:      { frames: 9, moment: m },
	trip2:      { frames: 8, moment: m },
	drown:      { frames: 8, moment: m },
	cardoor:    { frames: 8, moment: .13 }
};