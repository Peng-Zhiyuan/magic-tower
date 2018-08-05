import Script from "./Script";
import Npc from "../Core/Npc";
import InlineScriptExecutor from "./InlineScpriteExecutor";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScriptManager 
{
    static npc: Npc

    static run(npc: Npc, name: string)
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

    static runInlineScript(npc: Npc, is: string)
    {
        this.npc = npc
        InlineScriptExecutor.executeAsync(is)
    }
}
