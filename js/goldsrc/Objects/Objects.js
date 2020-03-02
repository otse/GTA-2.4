import Block from "./Shapes/Block";
import Surface from "./Shapes/Surface";
export var Objects;
(function (Objects) {
    function Factory(data) {
        switch (data.type) {
            //case 'Ped': return new Ped(data);
            //case 'Player': return new Player(data);
            //case 'Car': return new Car(data);
            case 'Block': return new Block(data);
            case 'Surface': return new Surface(data);
            //case 'Lamp': return new Lamp(data);
            default:
                return null;
        }
    }
    function MakeNullable(data) {
        if (data.object2)
            console.warn('Data has object2');
        let object = Factory(data);
        if (!object)
            console.warn('Object2 not typable');
        data.object2 = object;
        return object || null;
    }
    Objects.MakeNullable = MakeNullable;
})(Objects || (Objects = {}));
export default Objects;
