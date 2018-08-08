import GameMaster from "../Core.GM/GameMaster";

export default class CoreLuncher
{
    static launch()
    {
        GameMaster.restart()
    }

    static save()
    {
        var p = GameMaster.createPatch()
        var json = JSON.stringify(p)
        console.log(json)
        cc.sys.localStorage["save"] = json
    }

    static laod()
    {
        var json = cc.sys.localStorage["save"]
        console.log(json)
        var p = JSON.parse(json)
        GameMaster.applyPatch(p)
    }
}