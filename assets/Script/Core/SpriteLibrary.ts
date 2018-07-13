export default class SpriteLibrary
{
    static mapping:{[name: string]: cc.SpriteFrame} = {}

    static initAsync(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>{
            cc.loader.loadResDir("sprite-library", (error, resList, pathList)=>{
                if(error == null)
                {
                    for(let i = 0; i < resList.length; i++)
                    {
                        let res = resList[i]
                        this.mapping[res.name] = res
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

    static get(name: string): cc.SpriteFrame
    {
        return this.mapping[name]
    }
}