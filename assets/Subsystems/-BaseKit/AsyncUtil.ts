import UpdateManager, {IUpdatable} from "./UpdateManager";
import Time from "./Time";
import { Action, Action0 } from "./Action";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AsyncUtil
{
    static waiteAsync(seconds: number): Promise<void>
    {
        return new Promise<void>((resolve, reject)=>{
            let waiter = WaiterPool.take()
            waiter.init(seconds, resolve)
            UpdateManager.add(waiter)
        })
    }
}

class Waiter implements IUpdatable
{
    startTime: number
    seconds: number
    resolve: Action0
    init(seconds: number, resolve: Action0)
    {
        this.seconds = seconds
        this.resolve = resolve
        this.startTime = Time.time
    }

    update()
    {
        let now = Time.time
        let delta = now - this.startTime
        if(delta > this.seconds)
        {
            UpdateManager.remove(this)
            WaiterPool.put(this)
            this.resolve()
        }
    }
}

class WaiterPool 
{
    static list = []

    static put(obj)
    {
        this.list.push(obj)
    }

    static take()
    {
        if(this.list.length > 0)
        {
            return this.list.shift()
        }
        {
            return new Waiter()
        }
    }
}
