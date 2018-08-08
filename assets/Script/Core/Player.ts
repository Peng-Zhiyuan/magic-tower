
import MapObject from "./MapObject";
import GameMaster, { Arrow } from "../Core.GM/GameMaster";
import SpriteLibrary from "./SpriteLibrary";
import CoreLuncher from "../Game/CoreLuncher";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends MapObject
{

    start()
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.sprite.spriteFrame = SpriteLibrary.get("player-forward-1")
    }


    _sprite: cc.Sprite
    get sprite(): cc.Sprite
    {
        if(this._sprite != null)
        {
            return this._sprite;
        }
        this._sprite = this.getComponent(cc.Sprite)
        return this._sprite
    }


    onKeyDown(event)
    {
        let code: number = event.keyCode
        
        switch(code)  
        {
            case cc.KEY.w:
                this.move(Arrow.Up)
                this.sprite.spriteFrame = SpriteLibrary.get("player-back-1")
                break;
            case cc.KEY.a:
                this.move(Arrow.Left)
                this.sprite.spriteFrame = SpriteLibrary.get("player-left-1")
                break;
            case cc.KEY.s:
                this.move(Arrow.Down)
                this.sprite.spriteFrame = SpriteLibrary.get("player-forward-1")
                break;
            case cc.KEY.d:
                this.move(Arrow.Right)
                this.sprite.spriteFrame = SpriteLibrary.get("player-right-1")
                break;
            case 187:
                CoreLuncher.save()
                break;
            case 189:
                CoreLuncher.laod()
                break;
            
        }
    }


    move(arrow: Arrow)
    {
        GameMaster.movePlayer(arrow)
    }
}
