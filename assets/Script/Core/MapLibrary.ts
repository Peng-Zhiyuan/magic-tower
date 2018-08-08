export default class MpaLibrary
{
    static mapping:{[name: string]: cc.TiledMapAsset} = {}

    static initAsync(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>{
            cc.loader.loadResDir("map", (error, resList: cc.Asset[], pathList)=>{
                if(error == null)
                {
                    for(let i = 0; i < resList.length; i++)
                    {
                        let res = resList[i]
                        if(res instanceof cc.TiledMapAsset)
                        {
                            this.mapping[res.name] = res
                        }
                        
                    }
                    resolve()
                }
                else
                {
                    reject()
                }
            })
        })

    }

    static get(name: string): cc.TiledMapAsset
    {
        return this.mapping[name]
    }

}