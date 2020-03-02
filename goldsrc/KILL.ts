import City from "./Chunks/City";

export namespace KILL {

    //export var ply: Player = null;
    export var city: City;
    
    export function init() {
        console.log('gta init');
        
        city = new City;
    }

    export function update() {

    }

}

export default KILL;