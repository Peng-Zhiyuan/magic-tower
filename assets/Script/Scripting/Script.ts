import SL from "../GM/SL";
import ScriptManager from "./ScriptManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Script
{
    static async hello(): Promise<void>
    {
        console.log("hello script!")
        SL.dialog(ScriptManager.npc.sprtieFrameList, "hello script!")
    }
}
