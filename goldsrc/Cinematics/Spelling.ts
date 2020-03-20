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
				304, 313, 325, 337, 350, 362, 374, 386, 398, 410, 422, 429, 435, 446, 452, 458, 471, 477, 488, 500, 509, 518, 529, 540
				//1   2    3    4    5    6    7    8    9    0    .    ,    ?    !    ;    ~    '    "    $    (    )    -    _
			]
		},

		mission: {
			space: 33,
			height: 64,
			beginnings: []
		}
	}

	interface Sentence {
		symbols: Symbol[];
	}

	interface Symbol {
		char; x; y; x2; y2; w; h; colorize;
	}

	function symbol(a: string, b: number, c: number, d: number, e: number, f: number, g: number, h: boolean): Symbol {
		return { char: a, x: b, y: c, x2: d, y2: e, w: f, h: g, colorize: h }
	}

	// https://gtamp.com/text/?bg=0&font=1&color=6&shiny=0&imgtype=0&text=ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.%2C%3F%21%3B%7E%27%22%60%24%28%29-
	// ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890.,?!;~'"$()-

	const symbols_all = [
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
		'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
		'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
		'Y', 'Z', ' ', '1', '2', '3', '4', '5',
		'6', '7', '8', '9', '0', '.', ',', '?',
		'!', ';', '~', '\'', '"', '$', '(', ')',
		'-', '_'];

	export function build(text: string, font: string): Sentence {
		
		let typeface = typefaces[font];

		text = text.toUpperCase();

		let last_x = 0;
		let last_y = 128 / 2 - typeface.height;

		let sentence = { symbols: [] };

		let colorize = false;

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
				colorize = ! colorize;
				continue;
			}

			let index = symbols_all.indexOf(char);

			if (index == -1)
				continue;

			let x = typeface.beginnings[index];
			let y = 0;

			//console.log('char', char, 'index', index);

			let w = typeface.beginnings[index + 1] - x;

			sentence.symbols.push(
				symbol(char, last_x, last_y, x, y, w, typeface.height, colorize)
			);

			last_x += w
		}

		return sentence;
	}
}

export default Spelling;