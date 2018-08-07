import Memory from "../GM/Memory";
import MapObject from "./MapObject";

export default class MapEvent
{
    id: string
    name: string
    script: string
    indexX: number
    indexY: number
    forbid: boolean
    repeat: boolean
    obj: MapObject
    owner: EventOwner
    rawProperty: object

    onEnter()
    {
        this.forbid = Memory.getEvent(null, this.id, "forbid", false)
    }

    setAndMemoryForbid(b: boolean)
    {
        this.forbid = b
        if(b)
        {
            Memory.deleteEvent(null, this.id, "forbid")
        }
        else
        {
            Memory.setEvent(null, this.id, "forbid", b)
        }
    }
}

export enum EventOwner
{
    Board,
    Obj,
}