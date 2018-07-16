import Script from "./Script";
import Npc from "../Core/Npc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScriptManager 
{
    static npc: Npc

    static async run(npc: Npc, name: string): Promise<void>
    {
        this.npc = npc
        let fun = Script[name]
        if(fun == null)
        {
            //throw "script '" + name + "' not found"
            console.warn("script '" + name + "' not found")
        }
        else
        {
            //await fun()
            Script[name]()
        }
    }
}
