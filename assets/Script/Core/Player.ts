import Board from "./Board";
import MapObject from "./MapObject";
import { ObjType } from "./ObjType";
import StaticData from "../StaticData/StaticData";
import { Sheet } from "./Sheet";
import GameMaster from "../GM/GameMaster";
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
        let boardX = this.token.cell.indexX
        let boardY = this.token.cell.indexY
        let targetX = boardX
        let targetY = boardY
        switch(arrow)
        {
            case Arrow.Up:
                targetY -= 1
                break
            case Arrow.Down:
                targetY += 1
                break
            case Arrow.Left:
                targetX -= 1
                break
            case Arrow.Right:
                targetX += 1
                break
        }
        let valid = this.token.cell.layer.isValid(targetX, targetY)
        if(!valid)
        {
            return
        }
        let targetToken = this.token.cell.layer.getToken(targetX, targetY)
        if(targetToken != null)
        {
            let obj = targetToken.obj
            if(obj.type == ObjType.Monster)
            {
                // battle
                console.log("BATTLE!")
                GameMaster.OnBattle(this, obj as Monster)
            }
            else if(obj.type == ObjType.Specail)
            {
                // TODO: ...
                let row = StaticData.getRow(Sheet.Specail, obj.objName)
                let change_map = row["change_map"] as string
                let dec_item_to_destroy = row["dec_item_to_destroy"] as string
                if(change_map != "")
                {
                    if(change_map == "NEXT")
                    {
                        GameMaster.nextMapAsync()
                    }
                    else
                    {
                        GameMaster.previousMapAsync()
                    }
                }
                if(dec_item_to_destroy != "")
                {
                    let list = dec_item_to_destroy.split(",")
                    let enouph = PlayerStatus.isKeyEnouph(list)
                    let occu = PlayerStatus.occupation
                    if(enouph || occu == Occupation.Thief)
                    {
                        // dec keys
                        if(occu != Occupation.Thief)
                        {
                            PlayerStatus.decKey(list)
                        }

                        // remove door
                        obj.token.pick()
                        obj.node.destroy()

                        // node player
                        this.token.cell.layer.pickAndSet(targetX, targetY, this.token)
                        let pos = this.layer.getPositionAt(targetX, targetY)
                        this.node.setPosition(pos)
                    }
                    else
                    {
                        // do nothing
                    }
                }
                // if(row["block"])
                // {
                //     console.log("block")
                // }
                // else
                // {
                //     // // move data
                //     // this.token.cell.layer.pickAndSet(targetX, targetY, this.token)
                //     // // move node
                //     // let pos = this.layer.getPositionAt(targetX, targetY)
                //     // this.node.setPosition(pos)
                // }
            }
            else if(obj.type == ObjType.Npc)
            {
                let script = obj.property["s"]
                if(script != null)
                {
                    ScriptManager.run(obj as any as Npc, script)
                }
                else
                {
                    console.warn("no script set")
                }
            }
            else if(obj.type == ObjType.Item)
            {
                GameMaster.OnPickItem(this, obj as Item)
            }
        }
        else
        {
            MapManager.moveObject(this, targetX, targetY)
        }
    }    
}

enum Arrow
{
    Up,
    Down,
    Left,
    Right,
}
