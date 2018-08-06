import MapEvent from "./MapEvent";

export default class MapEventManager
{
    static idDic: {[id: string]: MapEvent}
    static nameDic: {[name: string]: MapEvent}
    static indexDic: MapEvent[][] = []
    static list: MapEvent[] = []

    static reset()
    {
        this.idDic = {}
        this.nameDic = {}
        this.indexDic = []
        this.list = []
    }

    static Add(event: MapEvent)
    {
        this.list.push(event)
        this.nameDic[event.name] = event
        this.idDic[event.id] = event
        this.setToIndexDic(event.indexX, event.indexY, event)
    }

    private static setToIndexDic(indexX: number, indexY: number, event: MapEvent)
    {
        let a = this.indexDic[indexX]
        if(a == null)
        {
            a = []
            this.indexDic[indexX] = a
        }
        a[indexY] = event
    }

    public static getFromIndexDic(indexX: number, indexY: number)
    {
        let a = this.indexDic[indexX]
        if(a == null)
        {
            return null
        }
        return a[indexY]
    }

}