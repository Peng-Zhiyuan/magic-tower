import Charactor from "../Charactor/Charactor";
import Game from "../Game";

export default class CharactorManager 
{
    static prefab_cha: cc.Node

    // 加载必要预设
    static init(): Promise<void>
    {
        return new Promise<void>((resolve, reject)=>{
            let prefab_cha = cc.loader.loadRes("charector", (error, prefab_cha: cc.Node)=>{
                if(error == null)
                {
                    this.prefab_cha = prefab_cha
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


    static create(name: string)
    {
        cc.loader.loadResDir(name, cc.SpriteFrame, (error, resList, pathList)=>{
            let cha_node = cc.instantiate(this.prefab_cha)
            let cha = cha_node.getComponent(Charactor);
            cha.init(resList)
            cha.node.position = new cc.Vec2(300, 400);
            cha.node.active = true;
            cha.node.parent = Game.instance.node.parent
        })
    }


}