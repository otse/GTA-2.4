import { parkedCarNames } from "./Script codes";
// PLURAL "LIKE A C API"
var Cars;
(function (Cars) {
    function GetRandomName() {
        let i = Math.floor(Math.random() * parkedCarNames.length);
        let name = parkedCarNames[i];
        console.log('GetRandomName ' + i + ' ' + name);
        return name;
    }
    Cars.GetRandomName = GetRandomName;
})(Cars || (Cars = {}));
export default Cars;
