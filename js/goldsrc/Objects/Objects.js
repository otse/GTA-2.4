import Block from "./Shapes/Block";
import Surface from "./Shapes/Surface";
import Car from "../Cars/Car";
export var Objects;
(function (Objects) {
    function factory(data) {
        switch (data.type) {
            //case 'Ped': return new Ped(data);
            //case 'Player': return new Player(data);
            case 'Car': return new Car(data);
            case 'Block': return new Block(data);
            case 'Surface': return new Surface(data);
            //case 'Lamp': return new Lamp(data);
            default:
                return null;
        }
    }
    function makeNullable(data) {
        if (data.object2)
            console.warn('Data has object2');
        let object = factory(data);
        if (!object)
            console.warn('Object2 not typable');
        data.object2 = object;
        return object || null;
    }
    Objects.makeNullable = makeNullable;
})(Objects || (Objects = {}));
export default Objects;
