import ResUtil from "./ResUtil";
import ObjectCreator from "./ObjectCreator";
import Board from "./Board";
import GIDParseInfo from "./GIDParseInfo";
import MapObject from "./MapObject";
import BoardIndex from "./BoardLocation";
import BoardLocation from "./BoardLocation";
import Player from "./Player";
import MapEvent from "./MapEvent";
import EventManager from "./MapEventManager";
import MapEventManager from "./MapEventManager";


export default class MapManager
{
    static map: cc.TiledMap
    static layerToObjectRoot: {[name: string]: cc.Node}
    static upBorn: BoardIndex = new BoardLocation()
    static downBorn: BoardIndex = new BoardLocation()
    static bornPoint: {[name: string]: BoardLocation}
    static player: Player

    static init()
    {
        this.map = cc.find("Canvas/map").getComponent(cc.TiledMap)
    }

    static async loadAsync(mapPath: string, bornPointName: string)
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

        // reset map event
        MapEventManager.reset()

        // reset born-point info
        this.bornPoint = {}

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

        // parse info
        this.parseInfo()

        // notify obj
        Board.eachToken(token => {
            let obj = token.obj
            if(obj != null)
            {
                obj.onEnterMap()
            }
        })

        // notify event
        for (let event of EventManager.list) 
        {
            event.onEnter()
        }

        Board.print()

        // create player
        let bornPoint = this.bornPoint[bornPointName]
        if(bornPoint == null)
        {
            console.warn("born-point " + bornPointName + " not found in map " + mapPath + ", not create player.")
        }
        else
        {
            let layer = this.map.getLayer("cha")
            this.player = this.createPlayer(layer, bornPoint.indexX, bornPoint.indexY)
        }
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
                        this.createObjByParseInfo(layer, i, j, parseInfo)
                    }
                }
            }
        } 
    }

    private static parseInfo()
    {
        let objectGroup = this.map.getObjectGroup("info")
        if(objectGroup != null)
        {
            let objList = objectGroup.getObjects()
            let cellWidth = this.map.getTileSize().width
            let cellHeight = this.map.getTileSize().height
            for(let infoObj of objList)
            {
                infoObj.objectVisible = false
                let x = infoObj.offset["x"]
                let y = infoObj.offset["y"]
                let indexX = Math.floor(x / cellWidth)
                let indexY = Math.floor(y / cellHeight)
                let property = infoObj["_properties"]
                let type = property["t"]
                if(type == null)
                {
                    type = property["type"]
                }
                if(type == "obj")
                {
                    // 这个信息是需要附加到一个对象上的
                    let token = Board.get("cha", indexX, indexY)
                    if(token != null)
                    {
                        let property = infoObj["_properties"]
                        token.obj.property = property
                        console.log("attach " + JSON.stringify(property) + " to " + token.obj.objName)
                    }
                    else
                    {
                        console.warn("tile object info not font a map object to attach: (" + indexX + ", " + indexY + ")")
                    }
                }
                else if(type == "born-point")
                {
                    let name = property["name"]
                    let location = new BoardLocation()
                    location.indexX = indexX
                    location.indexY = indexY
                    this.bornPoint[name] = location
                }
                else if(type == "event")
                {
                    let name = property["name"]
                    let script = property["_script"]
                    let event = new MapEvent()
                    event.id = name
                    event.name = name
                    event.script = script
                    event.indexX = indexX
                    event.indexY = indexY
                    event.rawProperty = property
                    EventManager.Add(event)
                }

            }
            objectGroup.node.active = true
            objectGroup.node.active = false
        }
    }

    public static createByName(indexX: number, indexY: number, objName: string)
    {
        let layer = this.map.getLayer("cha")

        let obj = ObjectCreator.createByName(objName)
        this.addObj(layer, indexX, indexY, obj.node)
        obj.layer = layer

        obj.generateToken(objName)
        let layerName = layer.getLayerName()
        Board.set(layerName, indexX, indexY, obj.token)
    }

    private static createObjByParseInfo(layer: cc.TiledLayer, indexX: number, indexY: number, parseInfo: GIDParseInfo): MapObject
    {
        let obj = ObjectCreator.createByParseInfo(parseInfo)
        this.addObj(layer, indexX, indexY, obj.node)
        obj.layer = layer

        let id = indexX + "-" + indexY
        obj.id = id

        obj.generateToken(parseInfo.objName)
        let layerName = layer.getLayerName()
        Board.set(layerName, indexX, indexY, obj.token)

        return obj
    }

    private static createPlayer(layer: cc.TiledLayer, indexX: number, indexY: number): Player
    {
        let obj = ObjectCreator.createPlayer()
        this.addObj(layer, indexX, indexY, obj.node)
        obj.layer = layer

        obj.generateToken("player")
        let layerName = layer.getLayerName()
        Board.set(layerName, indexX, indexY, obj.token)

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