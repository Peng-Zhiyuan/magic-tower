import GameMaster from "./GameMaster";
import MapMemory from "./MapMemory";
import MemoryPatch from "./MemoryPatch";

export default class Memory
{
    static mapMemoryDic: {[mapName: string]: MapMemory} = {}
    static globleMemory = {}

    static createPatch()
    {
        let patch = new MemoryPatch()
        patch.mapMemoryDic = this.mapMemoryDic
        patch.globleMemory = this.globleMemory
        return patch
    }

    static applyPatch(p: MemoryPatch)
    {
        this.mapMemoryDic = p.mapMemoryDic
        this.globleMemory = p.globleMemory
    }

    static getObj(mapName: string, objId: string, key: string, _default: any)
    {
        if(mapName == null)
        {
            mapName = GameMaster.currentMap
        }
        let map = this.mapMemoryDic[mapName]
        if(map == null)
        {
            return _default
        }
        let obj = map.objectDic[objId]
        if(obj == null)
        {
            return _default
        }
        let value = obj[key]
        if(value == null)
        {
            return _default
        }
        return value
    }

    static setObj(mapName: string, objId: string, key: string, value: any)
    {
        if(mapName == null)
        {
            mapName = GameMaster.currentMap
        }
        let map = this.mapMemoryDic[mapName]
        if(map == null)
        {
            map = new MapMemory()
            this.mapMemoryDic[mapName] = map
        }
        let obj = map.objectDic[objId]
        if(obj == null)
        {
            obj = {}
            map[objId] = obj
        }
        obj[key] = value
    }

    static deleteObj(mapName: string, objId: string, key: string)
    {
        if(mapName == null)
        {
            mapName = GameMaster.currentMap
        }
        let map = this.mapMemoryDic[mapName]
        if(map == null)
        {
            return
        }
        let obj = map.objectDic[objId]
        if(obj == null)
        {
            return
        }
        delete obj[key]
    }

    static getEvent(mapName: string, eventId: string, key: string, _default: any)
    {
        if(mapName == null)
        {
            mapName = GameMaster.currentMap
        }
        let map = this.mapMemoryDic[mapName]
        if(map == null)
        {
            return _default
        }
        let event = map.eventDic[eventId]
        if(event == null)
        {
            return _default
        }
        let value = event[key]
        if(value == null)
        {
            return _default
        }
        return value
    }

    static setEvent(mapName: string, eventId: string, key: string, value: any)
    {
        if(mapName == null)
        {
            mapName = GameMaster.currentMap
        }
        let map = this.mapMemoryDic[mapName]
        if(map == null)
        {
            map = new MapMemory()
            this.mapMemoryDic[mapName] = map
        }
        let event = map.eventDic[eventId]
        if(event == null)
        {
            event = {}
            map[eventId] = event
        }
        event[key] = value
    }

    static deleteEvent(mapName: string, eventId: string, key: string)
    {
        if(mapName == null)
        {
            mapName = GameMaster.currentMap
        }
        let map = this.mapMemoryDic[mapName]
        if(map == null)
        {
            return
        }
        let event = map.eventDic[eventId]
        if(event == null)
        {
            return
        }
        delete event[key]
    }

    static setGloble(name: string, value: any)
    {
        this.globleMemory[name] = value
    }

    static getGloble(name: string, _default: any)
    {
        let value = this.globleMemory[name]
        if(value == null)
        {
            return _default
        }
        return value
    }

    static reset()
    {
        this.mapMemoryDic = {}
        this.globleMemory = {}
    }
}

