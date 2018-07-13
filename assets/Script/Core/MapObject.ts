import Token from "./Token";
import { ObjType } from "./ObjType";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapObject extends cc.Component 
{
    token: Token
    type: ObjType
    layer: cc.TiledLayer
    
    generateToken(tag: string)
    {
        this.token = new Token()
        this.token.tag = tag
        this.token.obj = this
    }
}
