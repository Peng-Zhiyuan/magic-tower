import SL from "../GM/SL";
import ScriptManager from "./ScriptManager";
import PlayerStatus from "../GM/PlayerStatus";
import { Occupation } from "../GM/Occupation";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Script
{
    static async outside_thief(): Promise<void>
    {
        await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, "Thief dose not cost keys when open door.")
        if(PlayerStatus.occupation == Occupation.None)
        {
            await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, "Take occupation as thief?")
            let result = await SL.selectAsync(["Yes", "No"])
            if(result == "Yes")
            {
                PlayerStatus.occupation = Occupation.Thief
                this.destroyAllFence()
            }
        }
    }

    static async outside_warrior(): Promise<void>
    {
        await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, "Warrior gains an additional 10% ability increase.")
        if(PlayerStatus.occupation == Occupation.None)
        {
            await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, "Take occupation as warrier?")
            let result = await SL.selectAsync(["Yes", "No"])
            if(result == "Yes")
            {
                PlayerStatus.occupation = Occupation.Warrior
                this.destroyAllFence()
            }
        }
    }

    static destroyAllFence()
    {
        let list = SL.findObject("fence")
        for(let fence of list)
        {
            fence.token.pick()
            fence.node.destroy()
        }
    }

    static async outside_3(): Promise<void>
    {
        await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, "I am just a passerby.")
    }

    static async outside_4(): Promise<void>
    {
        await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, "Remilia prpr.")
    }
}
