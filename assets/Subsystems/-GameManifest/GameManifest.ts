export default class GameManifest
{
    static default = {}
    static local = {}

    static async loadAsync()
    {
        let base_gamemanifest = window["gamemanifest"]
        if (base_gamemanifest != null)
        {
            this.local = base_gamemanifest
            if(base_gamemanifest["inlined-game-manifest"] == "true")
            {
                return
            }
        }

        let obj: cc.TextAsset = await this.loadResAsync<cc.TextAsset>("game-manifest/game-manifest")
        this.default = obj


        console.log("GameManifest", this.default)
        console.log("GameManifest", this.local)
    }

    static get(key: string)
    {
        let value = this.local[key]
        if (value == null)
        {
            value = this.default[key]
        }
        return value
    }

    private static async loadResAsync<T>(path: string): Promise<T>
    {
        return new Promise<T>((resolve, reject) =>
        {
            cc.loader.loadRes(path, (error, res) =>
            {
                if(error == null)
                {
                    resolve(res)
                }
                else
                {
                    resolve(null)
                }
            })
        })

    }
}