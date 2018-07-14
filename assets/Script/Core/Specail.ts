import MapObject from "./MapObject";

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
}
