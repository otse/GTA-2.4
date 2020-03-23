import { parkedCarNames } from "./Script codes";
var Cars;
(function (Cars) {
    // const contexts
    Cars.Names2 = [
        "Romero", "Wellard", "Aniston BD4", "Pacifier",
        "G4 Bank Van", "Beamer", "Box Car", "Box Truck",
        "Bug", "Bulwark", "Bus", "Cop Car",
        "Minx", "Eddy", "Panto", "Fire Truck",
        "Shark", "GT-A1", "Garbage Truck", "Armed Land Roamer",
        "Hot Dog Van", "Ice-Cream Van", "Dementia Limousine", "Dementia",
        "Land Roamer", "Jefferson", "Stretch Limousine", "Sports Limousine",
        "Medicar", "Benson", "Schmidt", "Miara",
        "Big Bug", "Morton", "Maurice", "Pickup",
        "A-Type", "Arachnid", "Spritzer", "Stinger",
        "Meteor", "Meteor Turbo", "Hachura", "B-Type",
        "Taxi Xpress", "SWAT Van", "Michelli Roadster", "Tank",
        "Tanker", "Taxi", "T-Rex", "Tow Truck",
        "Train", "Train Cab", "Train FB", "Trance-Am",
        "Truck Cab", "Truck Cab SX", "Container", "Transporter",
        "TV Van", "Van", "U-Jerk Truck", "Z-Type",
        "Rumbler",
        "Jagular XK",
        "Furore GT", "Special Agent Car", "Karma Bus"
    ];
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
    function getRandomName() {
        let i = Math.floor(Math.random() * parkedCarNames.length);
        let name = parkedCarNames[i];
        console.log('getRandomName ' + i + ' ' + name);
        return name;
    }
    Cars.getRandomName = getRandomName;
})(Cars || (Cars = {}));
export default Cars;
