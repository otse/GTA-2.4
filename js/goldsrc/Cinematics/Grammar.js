export var Grammar;
(function (Grammar) {
    ;
    ;
    function analyze(text) {
        let lastX = 0;
        let lastY = 0;
        let wordLength = 0;
        let sentence, { letters: [], wordLengths: [] };
        let letters = [];
        for (let i = 0; i < text.length; i++) {
            let char = text[i];
            if (' ' == char) {
                let w = 33;
                lastX += w;
                let letter = { char: ' ', x: lastX, y: lastY, w: w, h: 64 };
                continue;
            }
            let a = lowercase.indexOf(char);
            let b = uppercase.indexOf(char);
            let index = a != -1 ? a : b != -1 ? b : 0;
            let start = bigAlphabetPos[index];
            console.log('char', char, 'index', index);
            let x = start;
            let y = 0;
            let w = bigAlphabetPos[index + 1] - start;
            let letter = {
                char: char,
                x: lastX,
                y: lastY,
                cx: x,
                cy: 0,
                w: w,
                h: 64
            };
            letters.push(letter);
        }
        return sentence;
    }
})(Grammar || (Grammar = {}));
export default Grammar;
