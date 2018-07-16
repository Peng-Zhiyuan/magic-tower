import TimeStop from "./TimeStop";
import { Action0, Func0 } from "./Action";

export default class TaskExecutor
{
    static async all(list: Task[]): Promise<void>
    {
        let instance = new TaskExecutor()
        await instance.all(list)
    }

    afterDic: {[name: string]: Task[]} = {}
    resolvedName: {[name: string]: boolean} = {}
    checkedList: Task[] = []
    executingDic: {[name: string]: Task} = {}
    resolve: Action0
    timeStop: TimeStop

    all(list: Task[]): Promise<void>
    {
        list.forEach(task =>{
            if(task.after == null || task.after == "" || ((typeof task.after != "string") && (task.after as string[]).length == 0))
            {
                this.checkedList.push(task)
            }
            else
            {
                if(typeof task.after == "string")
                {
                    this.addToAfterDic(task.after, task)
                }
                else
                {
                    task.after.forEach(oneAfter => {
                        this.addToAfterDic(oneAfter, task)
                    });
                }
            }
        })

        this.timeStop = new TimeStop()
        this.timeStop.start()

        this.executeList(this.checkedList)

        return new Promise<void>((resolve, reject) =>{
            this.resolve = resolve
            if(list.length == 0)
            {
                this.Resolved()
            }
        })
    }

    private Resolved()
    {
        //Log.screen("TaskExecutor", "Total: " + this.timeStop.tick)
        console.log("[TaskExecutor] Total: " + this.timeStop.tick)
        this.resolve()
    }

    private executeList(list: Task[])
    {
        list.forEach(task => {
            this.executingDic[task.name] = task
            let timeStop = new TimeStop()
            timeStop.start()
            let p = task.func().then(()=>{
                //Log.screen("TaskExecutor", task.name + ": " + timeStop.tick )
                console.log("[TaskExecutor] " + task.name + ": " + timeStop.tick )
                this.executingDic[task.name] = null
                this.resolvedName[task.name] = true
                this.onSomeoneResolved(task.name)
            })
        });
    }

    private onSomeoneResolved(name: string)
    {
        let oneAfterList = this.afterDic[name]
        if(oneAfterList == null || oneAfterList.length == 0)
        {
            if(this.isExcutingDicEmpty() && this.isAfterDicEmpty())
            {
                this.Resolved()
            }
            return
        }
        
        let newCheckedList = []
        for(let i = oneAfterList.length - 1; i >= 0; i--)
        {
            let task = oneAfterList[i]
            if(this.isAllAfterOfOneTaskResolved(task))
            {
                oneAfterList.splice(i, 1)
                newCheckedList.push(task)
            }
        }

        newCheckedList.forEach(task => {
            this.removeTaskFromAllAfterList(task)
        });
        
        this.executeList(newCheckedList)
    }

    private removeTaskFromAllAfterList(task: Task)
    {
        if(task.after == null)
        {
            return
        }
        if(task.after == "")
        {
            return
        }
        if(typeof task.after == "string")
        {
            this.removeTaskFromAfetList(task, task.after)
        }
        else
        {
            task.after.forEach(afterName =>{
                this.removeTaskFromAfetList(task, afterName)
            })
        }
    }

    private removeTaskFromAfetList(task: Task, afterName: string)
    {
        let list = this.afterDic[afterName]
        let index = list.indexOf(task)
        if(index != -1)
        {
            list.splice(index, 1)
        }
    }

    private isAllAfterOfOneTaskResolved(task: Task)
    {
        if(task.after == "")
        {
            return true
        }
        if(task.after == null)
        {
            return true
        }
        if(typeof task.after == "string")
        {
            return this.isTaskResolved(task.after)
        }
        else
        {
            for(let i = 0; i < task.after.length; i++)
            {
                let name = task.after[i]
                if(!this.isTaskResolved(name))
                {
                    return false
                }
            }
            return true
        }
    }

    private isTaskResolved(name: string)
    {
        if(this.resolvedName[name])
        {
            return true
        }
        else
        {
            return false
        }
    }

    private isExcutingDicEmpty()
    {
        for(let key in this.executingDic)
        {
            if(this.executingDic[key] != null)
            {
                return false
            }
        }
        return true
    }

    private isAfterDicEmpty()
    {
        for(let key in this.afterDic)
        {
            let list = this.afterDic[key]
            if(list != null && list.length != 0)
            {
                return false
            }
        }
        return true
    }
    

    private addToAfterDic(name: string, task: Task)
    {
        let list = this.afterDic[name]
        if(list == null)
        {
            list = []
            this.afterDic[name] = list
        }
        list.push(task)
    }

}

export class Task
{
    name: string
    func: Func0<Promise<any>>
    after?: string | string[]
}

