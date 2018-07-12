export default class ObjectCreator
{
    static create(name: string)
    {
        let prefab = await ResUtil.loadRes<cc.Node>("player")
        let instance = cc.instantiate(prefab)
        this.addObj(instance, indexX, indexY)
    }
}