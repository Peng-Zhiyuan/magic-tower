import Board from "./Board";
import MapObject from "./MapObject";
import { ObjType } from "./ObjType";
import Memory from "../GM/Memory";
import MapManager from "./MapManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends MapObject
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
        let a = Memory.getCurrentMapMemory()
        let objMemo = a[this.idInMap]
        if(objMemo != null)
        {
            if(objMemo["destory"])
            {
                MapManager.removeObject(this)
            }
        }
    }

    memoryDestory()
    {
        let memory = Memory.getCurrentMapMemory()
        let objMemo = memory[this.idInMap]
        if(objMemo == null)
        {
            objMemo = {}
            memory[this.idInMap] = objMemo
        }
        objMemo["destory"] = true
    }
}