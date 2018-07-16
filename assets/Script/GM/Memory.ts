import GameMaster from "./GameMaster";

export default class Memory
{
    static mapping: {[mapIndex: number]: {}} = {}

    static getMapMemmory(mapIndex: number)
    {
        let memory = this.mapping[name]
        if(memory == null)
        {
            memory = {}
            this.mapping[name] = memory
        }
        return memory
    }

    static getCurrentMapMemory(): {}
    {
        let mapIndex = GameMaster.currentMap
        return this.getMapMemmory(mapIndex)
    }
}