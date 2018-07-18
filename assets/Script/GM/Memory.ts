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

    static getCurrentMapMemory(): Object
    {
        //let mapIndex = GameMaster.currentMap
        let mapIndex = 0
        return this.getMapMemmory(mapIndex)
    }

    static reset()
    {
        this.mapping = {}
    }
}