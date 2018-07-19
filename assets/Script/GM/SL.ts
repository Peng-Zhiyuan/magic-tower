import Dialog from "../UI/dialog/Dialog";
import UIEngine from "../../Subsystems/-UIEngine/UIEngine";
import Select from "../UI/select/Select";
import MapManager from "../Core/MapManager";
import Board from "../Core/Board";
import MapObject from "../Core/MapObject";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SL 
{
    static async dialogAsync(spriteFrameList: cc.SpriteFrame[], text: string)
    {
        let dialog = await UIEngine.forwardAsync("dialog") as Dialog
        await dialog.showAsync(spriteFrameList, text)
    }

    static async selectAsync(textList: string[]): Promise<string>
    {
        let select = await UIEngine.forwardAsync("select") as Select
        let result = await select.showAsync(textList, "")
        return result
    }

    static findObject(name: string): MapObject[]
    {
        let ret = []
        for(let layerName in Board.layerMapping)
        {
            let layer = Board.layerMapping[layerName]
            let w = layer.width
            let h = layer.height
            for(let i = 0; i < w; i++)
            {
                for(let j = 0; j < h; j++)
                {
                    let token = layer.getToken(i, j)
                    if(token != null)
                    {
                        if(token.obj.objName == name)
                        {
                            ret.push(token.obj)
                        }
                    }
                }
            }
        }
        return ret
    }
  
}