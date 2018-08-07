import Dialog from "../UI/dialog/Dialog";
import UIEngine from "../../Subsystems/-UIEngine/UIEngine";
import Select from "../UI/select/Select";
import MapManager from "../Core/MapManager";
import Board from "../Core/Board";
import MapObject from "../Core/MapObject";
import PlayerStatus from "./PlayerStatus";
import StaticData from "../StaticData/StaticData";
import ObjectCreator from "../Core/ObjectCreator";
import GameMaster from "./GameMaster";
import Memory from "./Memory";
import MapHelper from "../Core/MapHelper";

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

    static async changeMapAsync(name: string, bornPointName: string)
    {
        await GameMaster.loadMap(name, bornPointName)
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

    static move(indexX: number, indexY: number, targetIndexX: number, targetIndexY: number)
    {
        let token = Board.get("cha", indexX, indexY);
        if(token != null)
        {
            MapManager.moveObject(token.obj, targetIndexX, targetIndexY)
        }
        else
        {
            console.log("[SL] move: nothing found in: " + indexX + ", " + indexY )
        }
    }

    static get(name: string, _default: any)
    {
        Memory.getGloble(name, _default)
    }

    static set(name: string, value: any)
    {
        Memory.setGloble(name, value)
    }

    static add(name: string, value: number)
    {
        let v = Number(Memory.getGloble(name, 0))
        v += value
        Memory.setGloble(name, v)
    }

    static sub(name: string, value: number)
    {
        let v = Number(Memory.getGloble(name, 0))
        v -= value
        Memory.setGloble(name, v)
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

    static movePlayer(indexX: number, indexY: number)
    {
        // 如果目标位置有对象，则永久摧毁这个对象
        let token = Board.get("cha", indexX, indexY)
        if(token != null)
        {
            let obj = token.obj
            MapHelper.destoryObj(obj)
        }
        // 把玩家移动到这个位置
        MapManager.moveObject(MapManager.player, indexX, indexY)
    }
  
}
