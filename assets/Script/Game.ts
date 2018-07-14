import Charactor from "./Charactor/Charactor";
import MonsterCreator from "./Core/MonsterCreator";
import ObjectCreator from "./Core/ObjectCreator";
import ResUtil from "./Core/ResUtil";
import MapManager from "./Core/MapManager";
import StaticData from "./StaticData/StaticData";
import SpriteLibrary from "./Core/SpriteLibrary";
import Board from "./Core/Board";

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
        await StaticData.initAsync()
        await SpriteLibrary.initAsync()
        //await MonsterCreator.initAsync()
        await ObjectCreator.initAsync()
        //CharactorManager.create("kulou")
        MapManager.init()
        await MapManager.loadAsync("map/map1")

        Board.print()
    }

   


}
