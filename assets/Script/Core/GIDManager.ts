import StaticData from "../StaticData/StaticData";
import GIDParseInfo from "./GIDParseInfo";
import { ObjType } from "./ObjType";

export default class GIDManager
{
    static gidToObjectName: {[gid: string]: GIDParseInfo} = {}

    static init()
    {
        // read player gid
        let player_gid = StaticData.getCell("base", "player_gid", "value")
        this.gidToObjectName[player_gid] = new GIDParseInfo(player_gid, ObjType.Player, "player")

        // read monster gid
        let sheet = StaticData.getSheet("monster")
        for(let id in sheet)
        {
            let row = sheet[id]
            let gid = row["gid"]
            this.gidToObjectName[gid] = new GIDParseInfo(gid, ObjType.Monster, id)
        }
    }

    static GIDToParseInfo(gid: number): GIDParseInfo
    {
        return this.gidToObjectName[gid]
    }

    static print()
    {
        console.log(this.gidToObjectName)
    }
}