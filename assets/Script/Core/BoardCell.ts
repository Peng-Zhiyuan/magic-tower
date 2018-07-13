import Token from "./Token";
import BoardLayer from "./BoardLayer";

export default class BoardCell
{
    indexX: number
    indexY: number
    token: Token
    layer: BoardLayer
    
    constructor(layer: BoardLayer, indexX: number, indexY: number)
    {
        this.layer = layer
        this.indexX = indexX
        this.indexY = indexY
    }
}