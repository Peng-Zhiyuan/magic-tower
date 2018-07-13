import BoardCell from "./BoardCell";
import MapObject from "./MapObject";
import { ObjType } from "./ObjType";

export default class Token
{
    tag: string
    cell: BoardCell
    obj: MapObject
    type: ObjType

    pick()
    {
        if(this.cell != null)
        {
            if(this.cell.token == this)
            {
                this.cell.token = null
                this.cell = null
            }
            else
            {
                throw "token: " + this + " ref to a cell, but cell not ref to this token"
            }
        }
    }
}