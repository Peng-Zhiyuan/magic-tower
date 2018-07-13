import Board from "./Board";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component 
{
    indexX: number
    indexY: number

    moveUp()
    {
        let info = Board.get(this.indexX, this.indexY)
        if(info.obj == "player")
        {
            
        }
    }
    
}
