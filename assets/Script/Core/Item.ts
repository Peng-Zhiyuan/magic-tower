import Board from "./Board";
import MapObject from "./MapObject";
import { ObjType } from "./ObjType";

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
}