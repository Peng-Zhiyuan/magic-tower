import GameMaster from "./GameMaster";

export default class Memory
{
    static mapMemoryDic: {[mapName: string]: {}} = {}
    static globleMemory = {}

    static getMapMemmory(mapName: string)
    {
        let memory = this.mapMemoryDic[mapName]
        if(memory == null)
        {
            memory = {}
            memory["map"] = mapName
            this.mapMemoryDic[mapName] = memory
        }
        return memory
    }

    static getCurrentMapMemory(): Object
    {
        let mapIndex = GameMaster.currentMap
        //let mapIndex = 0
        return this.getMapMemmory(mapIndex)
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