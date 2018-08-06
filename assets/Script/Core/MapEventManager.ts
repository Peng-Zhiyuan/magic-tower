import MapEvent from "./MapEvent";

export default class MapEventManager
{
    static nameDic: {[name: string]: MapEvent}
    static indexDic: MapEvent[][] = []

    static reset()
    {
        this.nameDic = {}
        this.indexDic = []
    }

    static Add(event: MapEvent)
    {
        this.nameDic[event.name] = event
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