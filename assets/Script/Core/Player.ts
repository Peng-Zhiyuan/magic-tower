import Board from "./Board";
import MapObject from "./MapObject";
import { ObjType } from "./ObjType";
import StaticData from "../StaticData/StaticData";
import { Sheet } from "./Sheet";
import GameMaster, { Arrow } from "../GM/GameMaster";
import Monster from "./Monster";
import ScriptManager from "../Scripting/ScriptManager";
import Npc from "./Npc";
import MapManager from "./MapManager";
import PlayerStatus from "../GM/PlayerStatus";
import { Occupation } from "../GM/Occupation";
import Item from "./Item";
import SpriteLibrary from "./SpriteLibrary";
import Time from "../../Subsystems/-BaseKit/Time";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends MapObject
{
    indexX: number
    indexY: number

    start()
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
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
            
        }
    }


    move(arrow: Arrow)
    {
        GameMaster.movePlayer(arrow)
    }
}
