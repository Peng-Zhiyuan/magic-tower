import MapObject from "./MapObject";
import Memory from "../GM/Memory";
import MapManager from "./MapManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Specail extends MapObject
{

    @property(cc.Sprite)
    sprite: cc.Sprite = null

    set spriteFrame(sf: cc.SpriteFrame)
    {
        this.sprite.spriteFrame = sf
    }

    get spriteFrame()
    {
        return this.sprite.spriteFrame
    }

    onEnterMap()
    {
        var destroy = Memory.getObj(null, this.id, "destory", false)
        if(destroy)
        {
            MapManager.removeObject(this)
        }
    }

    memoryDestory()
    {
        Memory.setObj(null, this.id, "destroy", true)
    }
}
