import Token from "./Token";
import { ObjType } from "./ObjType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapObject extends cc.Component 
{
    id: string
    objName: string
    token: Token
    type: ObjType
    layer: cc.TiledLayer
    property: object

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
