import Monster from "../Core/Monster";
import Game from "../Game";

export default class MonsterCreator 
{
    static prefab_monster: cc.Node

    // 加载必要预设
    static initAsync(): Promise<void>
    {
        return new Promise<void>((resolve, reject)=>{
            let prefab_cha = cc.loader.loadRes("monster", (error, prefab_cha: cc.Node)=>{
                if(error == null)
                {
                    this.prefab_monster = prefab_cha
                    resolve()
                }
                else
                {
                    console.log(error)
                    reject(0)
                }
            })
        })
    }


    static create(name: string): Monster
    {
        let monster_node = cc.instantiate(this.prefab_monster)
        let monster = monster_node.getComponent(Monster);
        return monster
    }


}