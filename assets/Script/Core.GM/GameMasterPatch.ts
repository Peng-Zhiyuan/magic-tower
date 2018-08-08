import MapManagerPatch from "../Core/MapManagerPatch";
import MemoryPatch from "./MemoryPatch";
import PlayerStatusPatch from "./PlayerStatusPatch";

export default class GameMasterPatch
{
    inBattle: boolean
    currentMap: string

    playerStatusPatch: PlayerStatusPatch
    memoryPatch: MemoryPatch
    mapManagerPatch: MapManagerPatch
}