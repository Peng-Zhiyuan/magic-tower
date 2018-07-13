import ResUtil from "./ResUtil";
import GIDManager from "./GIDManager";
import MapStatus from "./Board";
import GIDParseInfo from "./GIDParseInfo";
import { ObjType } from "./ObjType";
import MonsterCreator from "./MonsterCreator";
import StaticData from "../StaticData/StaticData";
import SpriteLibrary from "./SpriteLibrary";

export default class MapManager
{
    static map: cc.TiledMap
    static layerToObjectRoot: {[name: string]: cc.Node}

    static init()
    {
        this.map = cc.find("map").getComponent(cc.TiledMap)
    }

    static async load(mapPath: string)
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
        let count = this.map.getMapSize()
        let mapCountX = count.width
        let mapCountY = count.height
        MapStatus.newData(mapCountX, mapCountY)

        // parse object of each layer
        this.parseObject()
    }

    private static addObj(layer: cc.TiledLayer, indexX: number, indexY: number, obj: cc.Node)
    {
        let objRoot = this.layerToObjectRoot[layer.name]
        // 从地图左下角开始计算的本地坐标，无关map对象的anchor
        let pos = layer.getPositionAt(indexX, indexY)
        obj.parent = objRoot
        obj.position = pos
    }

    private static async parseObject()
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
                    let parseInfo = GIDManager.GIDToParseInfo(gid)
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

    private static async createObjByParseInfo(layer: cc.TiledLayer, indexX: number, indexY: number, parseInfo: GIDParseInfo)
    {
        if(parseInfo.objType == ObjType.Player)
        {
            let prefab = await ResUtil.loadRes<cc.Node>("player")
            let instance = cc.instantiate(prefab)
            this.addObj(layer, indexX, indexY, instance)
        }
        else if(parseInfo.objType == ObjType.Monster)
        {
            let name = parseInfo.objName
            let monster = MonsterCreator.create(name)
            let spriteListDefine = StaticData.getCell("monster", name, "sprites") as string
            let parts = spriteListDefine.split(",")
            let spriteList: cc.SpriteFrame[] = []
            for(let p of parts)
            {
                let sprite = SpriteLibrary.get(p)
                spriteList.push(sprite)
            }
            monster.init(spriteList)
            this.addObj(layer, indexX, indexY, monster.node)
        }
    }
}