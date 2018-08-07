import MapEvent, { EventOwner } from "./MapEvent";
import InlineScriptExecutor from "../Scripting/InlineScpriteExecutor";
import ScriptManager from "../Scripting/ScriptManager";

export default class MapEventManager
{
    static idDic: {[id: string]: MapEvent}
    static nameDic: {[name: string]: MapEvent}
    static boardIndexDic: MapEvent[][] = []
    static list: MapEvent[] = []

    static reset()
    {
        this.idDic = {}
        this.nameDic = {}
        this.boardIndexDic = []
        this.list = []
    }

    static Add(event: MapEvent)
    {
        this.list.push(event)
        this.nameDic[event.name] = event
        this.idDic[event.id] = event
        if(event.owner == EventOwner.Board)
        {
            this.setToIndexDic(event.indexX, event.indexY, event)
        }
    }

    private static setToIndexDic(indexX: number, indexY: number, event: MapEvent)
    {
        let a = this.boardIndexDic[indexX]
        if(a == null)
        {
            a = []
            this.boardIndexDic[indexX] = a
        }
        a[indexY] = event
    }

    public static getFromIndexDic(indexX: number, indexY: number)
    {
        let a = this.boardIndexDic[indexX]
        if(a == null)
        {
            return null
        }
        return a[indexY]
    }

    public static getByName(name: string)
    {
        return this.nameDic[name]
    }

    public static trigger(event: MapEvent, force: boolean = false)
    {
        if(!force && event.forbid)
        {
            return
        }
        if(!event.repeat)
        {
            event.forbid = true
        }
        let script = event.script
        ScriptManager.runEventScript(event, script)
    }

    public static triggerByName(name: string, force: boolean = false)
    {
        let event = this.nameDic[name]
        if(event == null)
        {
            console.warn("[EventManager]", "event: " + name + " not found.")
        }
        else
        {
            this.trigger(event, force)
        }
    }

    public static triggerByIndex(indexX: number, indexY: number, force: boolean = false)
    {
        let event = this.getFromIndexDic(indexX, indexY)
        if(event == null)
        {
            console.warn("[EventManager]", "event not found of " + indexX + ", " + indexY + ".")
        }
        else
        {
            this.trigger(event, force)
        }
    }
}