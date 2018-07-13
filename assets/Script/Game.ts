import Charactor from "./Charactor/Charactor";
import MonsterCreator from "./Core/MonsterCreator";
import GIDManager from "./Core/GIDManager";
import ResUtil from "./Core/ResUtil";
import MapManager from "./Core/MapManager";
import StaticData from "./StaticData/StaticData";
import SpriteLibrary from "./Core/SpriteLibrary";

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
        cc.view.enableAntiAlias(false);
        await StaticData.init()
        await SpriteLibrary.init()
        await MonsterCreator.init()
        GIDManager.init()
        //CharactorManager.create("kulou")
        MapManager.init()
        MapManager.load("map/map1")
        GIDManager.print()
    }

   


}
