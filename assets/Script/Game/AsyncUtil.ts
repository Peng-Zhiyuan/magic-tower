import UpdateManager, {IUpdatable} from "../../Subsystems/-BaseKit/UpdateManager";
import Time from "../../Subsystems/-BaseKit/Time";
import { Action0, Action } from "../../Subsystems/-BaseKit/Action";

export default class AsyncUtil
{
    public static waitAsync(seconds: number): Promise<void>
    {
        return new Promise<void>((resolve, reject)=>{
            let obj = new WaitObj()
            obj.init(seconds, ()=>{
                resolve()
            })
            UpdateManager.add(obj)
        })

    }
}

class WaitObj implements IUpdatable
{
    start: number
    waitSeconds: number
    callback: Action0
    init(waitSeconds: number, callback: Action0)
    {
        this.start = Time.time
        this.waitSeconds = waitSeconds
    }

    update(): void
    {
        let now = Time.time
        if(now - this.start >= this.waitSeconds)
        {
            UpdateManager.remove(this)
            this.callback()
            return
        }
    }
}