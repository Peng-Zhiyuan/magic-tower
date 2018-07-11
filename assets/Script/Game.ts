import Charactor from "./Charactor/Charactor";
import CharactorManager from "./Core/CharactorManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.SpriteFrame)
    label1: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    label2: cc.SpriteFrame = null;
    @property(cc.TiledMap)
    map: cc.TiledMap = null;

    @property
    text: string = 'hello';

    static instance: Game

    start () 
    {
        Game.instance = this
        this.init()
        // let prefab_cha = cc.loader.loadRes("charector", (error, prefab_cha: cc.Node)=>{
        //     if(error == null)
        //     {
        //         let cha_node = cc.instantiate(prefab_cha)
        //         let cha = cha_node.getComponent(Charactor);
        //         cha.init([this.label1, this.label2])
        //         cha.node.position = new cc.Vec2(300, 400);
        //         cha.node.active = true;
        //         cha.node.parent = this.node.parent;
        //     }
        //     else
        //     {
        //         console.log(error)
        //     }
        // })
    }

    async init()
    {
        await CharactorManager.init()
        CharactorManager.create("kulou")

        let layer = this.map.getLayer("块层 2")
        let size = layer.getLayerSize()
        for(let i = 0; i < size.width; i++)
        {
            for(let j = 0; j < size.height; j++)
            {
                let gid = layer.getTileGIDAt(i, j)
                if(gid == 139)
                {
                    layer.setTileGID(0, i, j, 1)
                }
            }
        }
    }


}
