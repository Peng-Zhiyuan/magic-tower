import CellInfo from "./CellInfo";

export default class MapStatus
{
    static data: CellInfo[][];

    static newData(width: number, height: number)
    {
        this.data = new CellInfo[width][height]
        for(let i = 0; i < width; i++)
        {
            for(let j = 0; j < height; j++)
            {
                this.data[i][j] = new CellInfo()
            }
        }
    }

    static set(indexX: number, indexY: number, objName: string)
    {
        this[indexX][indexY].obj = objName
    }

    static get(indexX: number, indexY: number): CellInfo
    {
        return this.data[indexX][indexY]
    }
}