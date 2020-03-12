export namespace Spelling {

	interface Sentence {
		symbols: Symbol[];
		word_lengths: number[];
	};

	interface Symbol {
		char; x; y; cx; cy; w; h;
	};

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

		let word_length = 0;

		let sentence = { symbols: [], word_lengths: [] };

		for (let i = 0; i < text.length; i++) {

			let char = text[i];

			if (' ' == char) {
				last_x += 33;
				let letter = { char: ' ', x: last_x, y: 0, cx: -1, cy: -1, w: 0, h: 0 };
				sentence.symbols.push(letter);
				continue;
			}

			let a = lowercase.indexOf(char);
			let b = uppercase.indexOf(char);

			let index = a != -1 ? a : b != -1 ? b : 0;
			let start = font_sizes[index];

			console.log('char', char, 'index', index);

			let x = start;
			let y = 0;
			let w = font_sizes[index + 1] - start;

			let letter = { char: char, x: last_x, y: last_y, cx: x, cy: 0, w: w, h: 64 }

			last_x += w;

			sentence.symbols.push(letter);
		}

		return sentence;
	}
}

export default Spelling;