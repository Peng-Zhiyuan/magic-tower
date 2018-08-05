import SL from "../GM/SL";
import ScriptManager from "./ScriptManager";
import PlayerStatus from "../GM/PlayerStatus";
import { Occupation } from "../GM/Occupation";
import MapManager from "../Core/MapManager";

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
        // 显示对话框
        await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, "Warrior gains an additional 10% ability increase.")
        // 如果玩家没有职业
        if(PlayerStatus.occupation == Occupation.None)
        {
            // 宣誓另一个对话框
            await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, "Take occupation as warrier?")
            // 显示选择框
            let result = await SL.selectAsync(["Yes", "No"])
            // 如果新选择 YES
            if(result == "Yes")
            {
                // 设置职业是战士
                PlayerStatus.occupation = Occupation.Warrior
                // 摧毁所有围栏
                this.destroyAllFence()
            }
        }
    }

    static destroyAllFence()
    {
        let list = SL.findObject("fence")
        for(let fence of list)
        {
            fence.memoryDestory()
            MapManager.removeObject(fence)
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

    static async f1_s(): Promise<void>
    {
        await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, "Press buton 's' to check monster stat.")
        await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, "Four numbers represent HP, ATK, DEF, and damage prediction (DP).")
    }
}
