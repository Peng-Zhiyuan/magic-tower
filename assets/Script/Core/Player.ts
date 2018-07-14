import Board from "./Board";
import MapObject from "./MapObject";
import { ObjType } from "./ObjType";
import StaticData from "../StaticData/StaticData";
import { Sheet } from "./Sheet";

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
            }
            else if(obj.type == ObjType.Specail)
            {
                // TODO: ...
                let row = StaticData.getRow(Sheet.Specail, obj.objName)
                if(row["block"])
                {
                    console.log("block")
                }
                else
                {
                    // move data
                    this.token.cell.layer.pickAndSet(targetX, targetY, this.token)
                    // move node
                    let pos = this.layer.getPositionAt(targetX, targetY)
                    this.node.setPosition(pos)
                }
            }
        }
        else
        {
            // move data
            this.token.cell.layer.pickAndSet(targetX, targetY, this.token)
            // move node
            let pos = this.layer.getPositionAt(targetX, targetY)
            this.node.setPosition(pos)
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
