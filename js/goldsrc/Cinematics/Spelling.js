export var Spelling;
(function (Spelling) {
    ;
    ;
    function symbol(a, b, c, d, e, f, g) {
        return { char: a, x: b, y: c, x2: d, y2: e, w: f, h: g };
    }
    // https://gtamp.com/text/?bg=0&font=2&color=0&shiny=0&imgtype=0&text=ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.%2C%3F%21%3B%7E%27%22%60%24%28%29-
    // ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.,?!;~'"`$()-
    const symbols = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', ' ',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        '.', ',', '?', '!', ';', '~', '\'', '"', '`', '$', '(', ')'
    ];
    const numbers = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    ];
    function build(text, font_sizes) {
        text = text.toUpperCase();
        let last_x = 0;
        let last_y = 0;
        let sentence = { symbols: [] };
        let word = 0;
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            if (' ' == char) {
                last_x += 33;
                word++;
                continue;
            }
            if ('\n' == char) {
                last_y = 64;
                last_x = 0;
                continue;
            }
            let index = symbols.indexOf(char);
            if (index == -1)
                continue;
            let x = font_sizes[index];
            let y, z = index + 1;
            if (index < 26) {
                y = 0;
            }
            else {
                y = 64;
                //z -= 25 - index;
            }
            console.log('char', char, 'index', index);
            let w = font_sizes[z] - x;
            sentence.symbols.push(symbol(char, last_x, last_y, x, y, w, 64));
            last_x += w;
        }
        return sentence;
    }
    Spelling.build = build;
})(Spelling || (Spelling = {}));
export default Spelling;
