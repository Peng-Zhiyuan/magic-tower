export default class StaticData
{
    private static data

    static init(): Promise<void>
    {
        return new Promise<void>((resolve, reject)=>{
            cc.loader.loadRes("static-data/StaticData", (error, res)=>{
                if(error == null)
                {
                    this.data = res
                    resolve()
                }
                else
                {
                    reject()
                }
            })
        })
    }

    static getRow(sheetName: string, id: string)
    {
        return this.data[sheetName][id]
    }

    static getCell(sheetName: string, id: string, field: string)
    {
        let row = this.getRow(sheetName, id)
        return row[field]
    }

    static getSheet(sheetName: string)
    {
        return this.data[sheetName]
    }
}