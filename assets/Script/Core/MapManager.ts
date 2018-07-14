import ResUtil from "./ResUtil";
import ObjectCreator from "./ObjectCreator";
import Board from "./Board";
import GIDParseInfo from "./GIDParseInfo";
import { ObjType } from "./ObjType";
import MonsterCreator from "./MonsterCreator";
import StaticData from "../StaticData/StaticData";
import SpriteLibrary from "./SpriteLibrary";
import MapObject from "./MapObject";
import Token from "./Token";

export default class MapManager
{
    static map: cc.TiledMap
    static layerToObjectRoot: {[name: string]: cc.Node}

    static init()
    {
        this.map = cc.find("map").getComponent(cc.TiledMap)
    }

    static async loadAsync(mapPath: string)
    {
        // set map component
        let mapAsset = await ResUtil.loadRes<cc.TiledMapAsset>("map/map1")
        this.map.tmxAsset = mapAsset

        // create objRoot of each layers
        let layerList = this.map.allLayers()
        this.layerToObjectRoot = {}
        for(let index in layerList)
        {
            let layer = layerList[index]
            let name = layer.name
            let objRoot = new cc.Node()
            objRoot.parent = layer.node
            objRoot.position = cc.Vec2.ZERO
            //objRoot.scale = 1
            //objRoot.rotation = 0
            this.layerToObjectRoot[name] = objRoot
        }

        // set board data

        Board.clean()
        for(let index in layerList)
        {
            let layer = layerList[index]
            let name = layer.name
            let size = layer.getLayerSize()
            Board.newLayer(name, size.width, size.height)
        }

        // parse object of each layer
        await this.parseObjectAsync()
    }

    private static addObj(layer: cc.TiledLayer, indexX: number, indexY: number, obj: cc.Node)
    {
        let objRoot = this.layerToObjectRoot[layer.name]
        // 从地图左下角开始计算的本地坐标，无关map对象的anchor
        let pos = layer.getPositionAt(indexX, indexY)
        obj.parent = objRoot
        obj.position = pos
    }

    private static async parseObjectAsync()
    {
        let layerList = this.map.allLayers()
        for(let layer of layerList)
        {
            let size = layer.getLayerSize()
            for(let i = 0; i < size.width; i++)
            {
                for(let j = 0; j < size.height; j++)
                {
                    let gid = layer.getTileGIDAt(i, j)
                    let parseInfo = ObjectCreator.GIDToParseInfo(gid)
                    if(parseInfo != null)
                    {
                        console.log("(" + i + ", " + j + ") parse to " + parseInfo.objType + ": " + parseInfo.objName)
                        layer.setTileGID(0, i, j)
                        let obj = this.createObjByParseInfo(layer, i, j, parseInfo)
                        obj.generateToken(parseInfo.objName)
                        Board.set(layer.name, i, j, obj.token)
                    }
                }
            }
        }
    }

    private static createObjByParseInfo(layer: cc.TiledLayer, indexX: number, indexY: number, parseInfo: GIDParseInfo): MapObject
    {
        let obj = ObjectCreator.createByParseInfo(parseInfo)
        this.addObj(layer, indexX, indexY, obj.node)
        obj.layer = layer
        return obj
    }
}