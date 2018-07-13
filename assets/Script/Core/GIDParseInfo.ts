import { ObjType } from "./ObjType";

export default class GIDParseInfo
{
    gid: number
    objType: ObjType
    objName: string

    constructor(gid: number, objType: ObjType, objName: string)
    {
        this.gid = gid
        this.objType = objType
        this.objName = objName
    }
}

