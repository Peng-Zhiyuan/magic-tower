import Token from "./Token";
import { ObjType } from "./ObjType";
import Memory from "../GM/Memory";
import MapManager from "./MapManager";

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

    static fuck()
    {
        return Memory.getCurrentMapMemory()
    }

    onEnterMap()
    {
        let a = MapObject.fuck()//Memory.getCurrentMapMemory()
        let objMemo = a[this.idInMap]
        if(objMemo != null)
        {
            if(objMemo["destory"])
            {
                //MapManager.removeObject(this)
            }
        }
    }

    // onEnterMap()
    // {
    //     let memory = Memory.getCurrentMapMemory()
    //     let objMemo = memory[this.idInMap()]
    //     if(objMemo != null)
    //     {
    //         if(objMemo["destory"])
    //         {
    //             MapManager.removeObject(this)
    //         }
    //     }
        
    // }

    // memoryDestory2(): void
    // {
    //     let memory = Memory.getCurrentMapMemory()
    //     let objMemo = memory[this.idInMap]
    //     if(objMemo == null)
    //     {
    //         objMemo = {}
    //         memory[this.idInMap] = objMemo
    //     }
    //     objMemo["destory"] = true
    // }

}
