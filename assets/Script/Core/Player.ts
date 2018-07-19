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

    onKeyDown(event)
    {
        let code: number = event.keyCode
        
        switch(code)  
        {
            case cc.KEY.w:
                this.move(Arrow.Up)
                break;
            case cc.KEY.a:
                this.move(Arrow.Left)
                break;
            case cc.KEY.s:
                this.move(Arrow.Down)
                break;
            case cc.KEY.d:
                this.move(Arrow.Right)
                break;
            
        }
    }


    move(arrow: Arrow)
    {
        GameMaster.movePlayer(arrow)
    }
}
