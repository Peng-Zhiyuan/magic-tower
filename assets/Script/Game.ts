import Charactor from "./Charactor/Charactor";
import CharactorManager from "./Core/CharactorManager";
import GIDManager from "./Core/GIDManager";
import ResUtil from "./Core/ResUtil";
import MapManager from "./Core/MapManager";

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
    }


    async init()
    {
        await CharactorManager.init()
        await GIDManager.init()
        //CharactorManager.create("kulou")
        MapManager.init()
        MapManager.load("map/map1")
    }

   


}
