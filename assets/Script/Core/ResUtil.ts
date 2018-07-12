
export default class ResUtil
{
    // 即时立即返回，也会等待一帧才返回资源
    static loadRes<T>(path: string): Promise<T>
    {
        return new Promise<T>((resolve, reject)=>{
            cc.loader.loadRes(path, (error, res) => {
                if(res != null)
                {
                    resolve(res)
                }
                else
                {
                    reject(0)
                }
            })
        })

    }
}
