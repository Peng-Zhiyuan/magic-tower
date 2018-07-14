import StaticData from "../StaticData/StaticData";
import GIDParseInfo from "./GIDParseInfo";
import { ObjType } from "./ObjType";
import Charactor from "../Charactor/Charactor";
import Item from "./Item";
import Player from "./Player";
import SpriteLibrary from "./SpriteLibrary";
import MapObject from "./MapObject";
import Specail from "./Specail";

export default class ObjectCreator
{
    static gidToParseInfo: {[gid: string]: GIDParseInfo} = {}
    static prefabMapping: {[name: string]: cc.Node} = {}


    static initAsync(): Promise<void>
    {
        // read player gid
        {
            let player_gid = StaticData.getCell("base", "player_gid", "value")
            this.gidToParseInfo[player_gid] = new GIDParseInfo(player_gid, ObjType.Player, "player")
        }


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

        return new Promise<void>((resolve, reject)=>{
            cc.loader.loadResDir("gid-parser", (error, resList, pathList)=>{
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
        }
    }

    private static createMonster(name: string): Charactor
    {
        // create node
        let prefab = this.prefabMapping["monster"]
        let node = cc.instantiate(prefab)
        let monster = node.getComponent(Charactor);

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

    private static createItem(name: string): Item
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

    private static createPlayer(): Player
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

    private static createSpecail(name: string): Specail
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
}