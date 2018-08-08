import MapMemory from "./MapMemory";

export default class MemoryPatch
{
    mapMemoryDic: {[mapName: string]: MapMemory} = {}
    globleMemory = {}
}