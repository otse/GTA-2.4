import { parkedCarNames } from "./Script codes";
var Cars;
(function (Cars) {
    var cars;
    function init() {
        cars = [];
    }
    Cars.init = init;
    function getArray() {
        return cars;
    }
    Cars.getArray = getArray;
    function add(car) {
        cars.push(car);
    }
    Cars.add = add;
    function remove(car) {
        cars.splice(cars.indexOf(car), 1);
    }
    Cars.remove = remove;
    function getPaint(car) {
        return '';
    }
    Cars.getPaint = getPaint;
    function GetRandomName() {
        let i = Math.floor(Math.random() * parkedCarNames.length);
        let name = parkedCarNames[i];
        console.log('GetRandomName ' + i + ' ' + name);
        return name;
    }
    Cars.GetRandomName = GetRandomName;
})(Cars || (Cars = {}));
export default Cars;
