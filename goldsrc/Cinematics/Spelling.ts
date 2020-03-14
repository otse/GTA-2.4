export namespace Spelling {

	interface Typeface {
		space: number;
		height: number;
		beginnings: number[];
	};

	const typefaces: { [key: string]: Typeface } = {
		small: {
			space: 9,
			height: 23,
			beginnings: [
				0, 11, 22, 33, 44, 55, 66, 77, 88, 96, 108, 121, 132, 148, 159, 170, 181, 192, 203, 214, 224, 235, 247, 263, 274, 286, 296,
				//a b  c   d   e   f   g   h   i   j    k    l    m    n    o    p    q    r    s    t    u    v    w    x    y    z
				304, 313, 325, 337, 350, 362, 374, 386, 398, 410, 422, 429, 435, 446, 452, 458, 471, 477, 488, 500, 509, 518, 529
				//1   2    3    4    5    6    7    8    9    0    .    ,    ?    !    ;    ~    '    "    $    (    )    -
			]
		},
		big: {
			space: 33,
			height: 64,
			beginnings: [
				0, 33, 65, 96, 127, 152, 180, 212, 244, 261, 291, 327, 354, 393, 425, 456, 487, 519, 550, 580, 608, 640, 672, 711, 744, 777, /*after z*/ 809,
				0, 22, 54, 85, 120, 150, 181, 211, 242, 274, 306, 323, 340, 371, 388, 405, 442, 459, 490, 507, 540, 562, 583
			]
		}
	}

	interface Sentence {
		symbols: Symbol[];
	};

	interface Symbol {
		char; x; y; x2; y2; w; h; color;
	};

	function symbol(a: string, b: number, c: number, d: number, e: number, f: number, g: number, h: boolean): Symbol {
		return { char: a, x: b, y: c, x2: d, y2: e, w: f, h: g, color: h }
	}

	// https://gtamp.com/text/?bg=0&font=1&color=6&shiny=0&imgtype=0&text=ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.%2C%3F%21%3B%7E%27%22%60%24%28%29-
	// ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890.,?!;~'"`$()-

	const symbols = [
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
		'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
		'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
		'Y', 'Z', ' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
		'.', ',', '?', '!', ';', '~', '\'', '"', '`', '$', '(', ')', '-'];

	export function build(text: string, font: string): Sentence {
		
		let typeface = typefaces[font];

		text = text.toUpperCase();

		let last_x = 0;
		let last_y = 128 / 2 - typeface.height;

		let sentence = { symbols: [] };

		let color = false;

		for (let i = 0; i < text.length; i++) {

			let char = text[i];

			if (' ' == char) {
				last_x += typeface.space;
				continue;
			}
			if ('\n' == char) {
				last_y += typeface.height;
				last_x = 0;
				continue;
			}

			if ('#' == char) {
				color = ! color;
				console.log('color',color);
				continue;
			}

			let index = symbols.indexOf(char);

			if (index == -1)
				continue;

			let x = typeface.beginnings[index];
			let y = 0, z = index + 1;

			//console.log('char', char, 'index', index);

			let w = typeface.beginnings[z] - x;

			sentence.symbols.push(
				symbol(char, last_x, last_y, x, y, w, typeface.height, color)
			);

			last_x += w
		}

		return sentence;
	}
}

export default Spelling;