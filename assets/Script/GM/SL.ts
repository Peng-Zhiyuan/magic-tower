import Dialog from "../UI/dialog/Dialog";
import UIEngine from "../../Subsystems/-UIEngine/UIEngine";
import Select from "../UI/select/Select";
import MapManager from "../Core/MapManager";
import Board from "../Core/Board";
import MapObject from "../Core/MapObject";
import PlayerStatus from "./PlayerStatus";
import StaticData from "../StaticData/StaticData";
import ObjectCreator from "../Core/ObjectCreator";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SL 
{
    static async dialogAsync(spriteFrameList: cc.SpriteFrame[], text: string)
    {
        let dialog = await UIEngine.forwardAsync("dialog") as Dialog
        await dialog.showAsync(spriteFrameList, text)
    }

    static addGold(value: number)
    {
        PlayerStatus.gold += value
    }

    static addExp(value: number)
    {
        PlayerStatus.exp += value
    }

    // 摧毁指定坐标的对象
    // 对象必须处于 cha 层
    // 对象的会被永久摧毁, 即使切换地图也不会复原
    static async destory(indexX: number, indexY: number)
    {
        let token = Board.get("cha", indexX, indexY)
        if(token != null)
        {
            let name = token.obj.objName
            token.obj.memoryDestory()
            MapManager.removeObject(token.obj)
            console.log("[SL] destry: " + name + " in: " + indexX + ", " + indexY )
        }
        else
        {
            console.log("[SL] destry: nothing found in: " + indexX + ", " + indexY )
        }
    }

    static create(ObjName: string, indexX: number, indexY: number)
    {
        MapManager.createByName(indexX, indexY, ObjName)
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
