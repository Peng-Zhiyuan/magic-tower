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
        this.map = cc.find("Canvas/map").getComponent(cc.TiledMap)
    }

    static async loadAsync(mapPath: string)
    {
        // log
        console.log("[MapManager] load " + mapPath)

        // clean
        Board.eachToken(token => {
            token.obj.node.destroy()
            token.pick()
        })
        for(let name in this.layerToObjectRoot)
        {
            let root = this.layerToObjectRoot[name]
            root.destroy()
        }
        this.layerToObjectRoot = {}

        // set map component
        let mapAsset = await ResUtil.loadRes<cc.TiledMapAsset>(mapPath)
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
            let name = layer.getLayerName()
            let size = layer.getLayerSize()
            Board.newLayer(name, size.width, size.height)
        }

        // parse object of each layer
        this.parseObject()

        // notify obj
        Board.eachToken(token => {
            let obj = token.obj
            if(obj != null)
            {
                obj.onEnterMap()
            }
        })

        Board.print()
    }

    private static addObj(layer: cc.TiledLayer, indexX: number, indexY: number, obj: cc.Node)
    {
        let objRoot = this.layerToObjectRoot[layer.name]
        // 从地图左下角开始计算的本地坐标，无关map对象的anchor
        let pos = layer.getPositionAt(indexX, indexY)
        obj.parent = objRoot
        obj.position = pos
    }

    private static parseObject()
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
                        let layerName = layer.getLayerName()
                        Board.set(layerName, i, j, obj.token)
                    }
                }
            }
        }
        let objectGroup = this.map.getObjectGroup("info")
        if(objectGroup != null)
        {
            let objList = objectGroup.getObjects()
            let cellWidth = this.map.getTileSize().width
            let cellHeight = this.map.getTileSize().height
            for(let obj of objList)
            {
                let x = obj.offset["x"]
                let y = obj.offset["y"]
                let indexX = Math.floor(x / cellWidth)
                let indexY = Math.floor(y / cellHeight)
                let token = Board.get("cha", indexX, indexY)
                if(token != null)
                {
                    let property = obj["_properties"]
                    token.obj.property = property
                    console.log("attach " + JSON.stringify(property) + " to " + token.obj.objName)
                }
                else
                {
                    console.warn("tile object info not font a map object to attach: (" + indexX + ", " + indexY + ")")
                }
            }
            objectGroup.node.active = false
        }
        
    }

    private static createObjByParseInfo(layer: cc.TiledLayer, indexX: number, indexY: number, parseInfo: GIDParseInfo): MapObject
    {
        let obj = ObjectCreator.createByParseInfo(parseInfo)
        this.addObj(layer, indexX, indexY, obj.node)
        obj.layer = layer
        return obj
    }

    static removeObject(obj: MapObject)
    {
        // clean data from board
        obj.token.pick()

        // destroy node
        obj.node.destroy()
    }

    static moveObject(obj: MapObject, indexX: number, indexY: number)
    {
        obj.token.cell.layer.pickAndSet(indexX, indexY, obj.token)
        let pos = obj.layer.getPositionAt(indexX, indexY)
        obj.node.position = pos
    }
}