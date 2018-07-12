import ResUtil from "./ResUtil";
import GIDManager from "./GIDManager";
import MapStatus from "./MapStatus";

export default class MapManager
{
    static map: cc.TiledMap
    static objRoot: cc.Node

    static init()
    {
        this.map = cc.find("map").getComponent(cc.TiledMap)
        this.objRoot = new cc.Node()
        this.objRoot.parent = this.map.node.parent
        this.objRoot.scale = this.map.node.scale
        this.objRoot.position = this.map.node.position
        this.objRoot.rotation = this.map.node.rotation
    }

    static async load(mapPath: string)
    {
        let mapAsset = await ResUtil.loadRes<cc.TiledMapAsset>("map/map1")
        this.map.tmxAsset = mapAsset
        this.objRoot.removeAllChildren(true)
        let count = this.map.getMapSize()
        let mapCountX = count.width
        let mapCountY = count.height
        MapStatus.newData(mapCountX, mapCountY)
    }

    private static addObj(obj: cc.Node, indexX: number, indexY: number)
    {
        let layer = this.map.allLayers()[0]
        // 从地图左下角开始计算的本地坐标，无关map对象的anchor
        let pos = layer.getPositionAt(indexX, indexY)
        obj.parent = this.objRoot
        obj.position = pos
    }

    private static async parseObject()
    {
        let layer = this.map.getLayer("块层 2")
        let size = layer.getLayerSize()
        for(let i = 0; i < size.width; i++)
        {
            for(let j = 0; j < size.height; j++)
            {
                let gid = layer.getTileGIDAt(i, j)
                let objName = GIDManager.GIDToObjectName(gid)
                if(objName != null)
                {
                    layer.setTileGID(0, i, j)
                    this.createObjByName(objName, i, j)
                }
            }
        }
    }

    private static async createObjByName(name: string, indexX: number, indexY: number)
    {
        if(name == "player")
        {
            let prefab = await ResUtil.loadRes<cc.Node>("player")
            let instance = cc.instantiate(prefab)
            this.addObj(instance, indexX, indexY)
        }
    }
}