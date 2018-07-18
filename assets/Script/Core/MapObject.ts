import Token from "./Token";
import { ObjType } from "./ObjType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapObject extends cc.Component 
{
    objName: string
    token: Token
    type: ObjType
    layer: cc.TiledLayer
    property: object

    get idInMap(): string
    {
        let x = this.token.cell.indexX
        let y = this.token.cell.indexY
        return this.layer.getLayerName() + "-" + x + "-" + y
    }
    
    generateToken(tag: string)
    {
        this.token = new Token()
        this.token.tag = tag
        this.token.obj = this
    }

    onEnterMap()
    {

    }
 
    memoryDestory(): void
    {

    }

}
