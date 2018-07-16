const {ccclass, property} = cc._decorator;
import Page from "./Page"

@ccclass
export default class PagePool
{
    dic = {}

    put(name: string, page: Page)
    {
        let queue: Array<Page> = this.dic[name]
        if (queue == null || queue == undefined)
        {
            queue = new Array<Page>()
            this.dic[name] = queue
        }
        queue.push(page)
    }
    remove(name:string){
        let queue: Array<Page> = this.dic[name]
        if (queue != null && queue != undefined){
            this.dic[name] = undefined;
        }
    }


    take(name: string)
    {
        let queue: Array<Page> = this.dic[name]
        if (queue)
        {
            return queue.shift()
        }
        return null
    }
   
}
