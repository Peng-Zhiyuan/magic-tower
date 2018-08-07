import Script from "./Script";
import Npc from "../Core/Npc";
import InlineScriptExecutor from "./InlineScpriteExecutor";
import MapEvent from "../Core/MapEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScriptManager 
{
    static npc: Npc
    static event: MapEvent

    static runNpcScript(npc: Npc, script: string)
    {
        this.npc = npc
        this.event = null
        InlineScriptExecutor.executeAsync(script)
    }

    static runEventScript(event: MapEvent, script: string)
    {
        this.npc = null
        this.event = event
        InlineScriptExecutor.executeAsync(script)
    }
}
