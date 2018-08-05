import StaticData from "../StaticData/StaticData";
import GIDParseInfo from "./GIDParseInfo";
import { ObjType } from "./ObjType";
import Monster from "./Monster";
import Item from "./Item";
import Player from "./Player";
import SpriteLibrary from "./SpriteLibrary";
import MapObject from "./MapObject";
import Specail from "./Specail";
import Npc from "./Npc";
import { Sheet } from "./Sheet";
import MapManager from "./MapManager";


export default class ObjectCreator
{
    static gidToParseInfo: {[gid: string]: GIDParseInfo} = {}
    static prefabMapping: {[name: string]: cc.Node} = {}

    
    static init()
    {
        // // read player gid
        // {
        //     let player_gid = StaticData.getCell("base", "player_gid", "value")
        //     this.gidToParseInfo[player_gid] = new GIDParseInfo(player_gid, ObjType.Player, "player")
        // }


        // read monster gid
        {
            let sheet = StaticData.getSheet("monster")
            for(let id in sheet)
            {
                let row = sheet[id]
                let gid = row["gid"]
                this.gidToParseInfo[gid] = new GIDParseInfo(gid, ObjType.Monster, id)
            }
        }

        // read item gid
        {
            let sheet = StaticData.getSheet("item")
            for(let id in sheet)
            {
                let row = sheet[id]
                let gid = row["gid"]
                this.gidToParseInfo[gid] = new GIDParseInfo(gid, ObjType.Item, id)
            }
        }

        // read specail gid
        {
            let sheet = StaticData.getSheet("specail")
            for(let id in sheet)
            {
                let row = sheet[id]
                let gid = row["gid"]
                this.gidToParseInfo[gid] = new GIDParseInfo(gid, ObjType.Specail, id)
            }
        }

        // read npc gid
        {
            let sheet = StaticData.getSheet("npc")
            for(let id in sheet)
            {
                let row = sheet[id]
                let gid = row["gid"]
                this.gidToParseInfo[gid] = new GIDParseInfo(gid, ObjType.Npc, id)
            }
        }
    }

    static initResAsync(): Promise<void>
    {
        return new Promise<void>((resolve, reject)=>{
            cc.loader.loadResDir("object-creator", (error, resList, pathList)=>{
                if(error == null)
                {
                    for(let res of resList)
                    {
                        let prefab = res as cc.Node
                        this.prefabMapping[prefab.name] = prefab
                    }
                    resolve()
                }
                else
                {
                    console.log(error)
                    reject()
                }
            })
        })
    }

    static GIDToParseInfo(gid: number): GIDParseInfo
    {
        return this.gidToParseInfo[gid]
    }

    static print()
    {
        console.log(this.gidToParseInfo)
    }

    static createByParseInfo(info: GIDParseInfo): MapObject
    {
        switch(info.objType)
        {
            case ObjType.Monster:
                return this.createMonster(info.objName)
            case ObjType.Item:
                return this.createItem(info.objName)
            case ObjType.Player:
                return this.createPlayer()
            case ObjType.Specail:
                return this.createSpecail(info.objName)
            case ObjType.Npc:
                return this.createNpc(info.objName)
            default:
                throw "Can't create obj type of: " + info.objType
        }
    }

    static createByName(objName: string): MapObject
    {
        {
            let sheet = StaticData.getSheet(Sheet.Monster)
            if(sheet[objName] != null)
            {   
                return ObjectCreator.createMonster(objName);
            }
        }
        {
            let sheet = StaticData.getSheet(Sheet.Item)
            if(sheet[objName] != null)
            {   
                return ObjectCreator.createItem(objName);
            }
        }
        {
            let sheet = StaticData.getSheet(Sheet.Specail)
            if(sheet[objName] != null)
            {   
                return ObjectCreator.createSpecail(objName);
            }
        }
        {
            let sheet = StaticData.getSheet(Sheet.Npc)
            if(sheet[objName] != null)
            {   
                return ObjectCreator.createNpc(objName);
            }
        }
        return null
    }

    public static createMonster(name: string): Monster
    {
        // create node
        let prefab = this.prefabMapping["monster"]
        let node = cc.instantiate(prefab)
        let monster = node.getComponent(Monster);

        // init monster
        let spriteListDefine = StaticData.getCell("monster", name, "sprites") as string
        let parts = spriteListDefine.split(",")
        let spriteList: cc.SpriteFrame[] = []
        for(let p of parts)
        {
            let sprite = SpriteLibrary.get(p)
            spriteList.push(sprite)
        }
        monster.init(spriteList)
        monster.objName = name
        monster.type = ObjType.Monster

        return monster
    }

    public static createItem(name: string): Item
    {
        // create node
        let prefab = this.prefabMapping["item"]
        let node = cc.instantiate(prefab)
        let item = node.getComponent(Item);

        // init item
        let spriteString = StaticData.getCell("item", name, "sprite")
        let spriteFrame = SpriteLibrary.get(spriteString)
        item.spriteFrame = spriteFrame
        item.objName = name
        item.type = ObjType.Item

        return item
    }

    public static createPlayer(): Player
    {
        // create node
        let prefab = this.prefabMapping["player"]
        let node = cc.instantiate(prefab)
        let player = node.getComponent(Player);

        // init player
        player.objName = "player"
        player.type = ObjType.Player

        return player
    }

    public static createSpecail(name: string): Specail
    {
        // create node
        let prefab = this.prefabMapping["specail"]
        let node = cc.instantiate(prefab)
        let specail = node.getComponent(Specail);

        // init specail
        let spriteString = StaticData.getCell("specail", name, "sprite")
        let spriteFrame = SpriteLibrary.get(spriteString)
        specail.spriteFrame = spriteFrame
        specail.objName = name
        specail.type = ObjType.Specail

        return specail
    }

    public static createNpc(name: string): Npc
    {
        // create node
        let prefab = this.prefabMapping["npc"]
        let node = cc.instantiate(prefab)
        let npc = node.getComponent(Npc);

        // init monster
        let spriteListDefine = StaticData.getCell(Sheet.Npc, name, "sprites") as string
        let parts = spriteListDefine.split(",")
        let spriteList: cc.SpriteFrame[] = []
        for(let p of parts)
        {
            let sprite = SpriteLibrary.get(p)
            spriteList.push(sprite)
        }
        npc.init(spriteList)
        npc.objName = name
        npc.type = ObjType.Npc

        return npc
    }
}