export default class GIDManager
{
    static gidToObjectName = {}

    static init(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>{
            cc.loader.loadRes("map/meta", (error, meta) => {
                for(let key in meta)
                {
                    let value = meta[key]
                    this.gidToObjectName[value] = key
                }
                console.log(this.gidToObjectName)
                resolve()
            })
            
        })
    }

    static GIDToObjectName(gid: number)
    {
        return this.gidToObjectName[gid]
    }
}