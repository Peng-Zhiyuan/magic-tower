import MapObject from "./MapObject";
import MapManager from "./MapManager";

export default class MapHelper
{
    static destoryObj(obj: MapObject)
    {
        obj.memoryDestory()
        MapManager.removeObject(obj)
    }
}