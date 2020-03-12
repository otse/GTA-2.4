export namespace Spelling {

	interface Sentence {
		symbols: Symbol[];
		word_lengths: number[];
	};

	interface Symbol {
		char; x; y; x2; y2; w; h;
	};

	function symbol(a: string, b: number, c: number, d: number, e: number, f: number, g: number): Symbol {
		return { char: a, x: b, y: c, x2: d, y2: e, w: f, h: g}
	}

	const lowercase = [
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
		'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
		'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

	const uppercase = [
		'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
		'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
		'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	const numbers = [
		0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

	export function build(text: string, font_sizes: number[]): Sentence {

		let last_x = 0;
		let last_y = 0;

		let word = 0;
		let word_length = 0;

		let sentence = { symbols: [], word_lengths: [] };

		for (let i = 0; i < text.length; i++) {

			let char = text[i];

			if (' ' == char) {
				last_x += 33;
				word++;
				sentence.symbols.push(
					symbol(' ', last_x, 0, -1, -1, 0, 0)
				);
				continue;
			}

			let a = lowercase.indexOf(char);
			let b = uppercase.indexOf(char);

			let index = a != -1 ? a : b != -1 ? b : 0;
			let start = font_sizes[index];

			console.log('char', char, 'index', index);

			let w = font_sizes[index + 1] - start;
			
			sentence.symbols.push(
				symbol(char, last_x, last_y, start, 0, w, 64)
			);

			last_x += w
		}

		return sentence;
	}
}

export default Spelling;