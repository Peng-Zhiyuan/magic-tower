import Monster from "./Core/Monster";
import MonsterCreator from "./Core/MonsterCreator";
import ObjectCreator from "./Core/ObjectCreator";
import ResUtil from "./Core/ResUtil";
import MapManager from "./Core/MapManager";
import StaticData from "./StaticData/StaticData";
import SpriteLibrary from "./Core/SpriteLibrary";
import Board from "./Core/Board";
import SL from "./GM/SL";
import UIEngine from "../Subsystems/-UIEngine/UIEngine";
import TaskExecutor, { Task } from "../Subsystems/-TaskExecutor/TaskExecutor";
import Time from "../Subsystems/-TaskExecutor/Time";
import GameMaster from "./GM/GameMaster";

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
        UIEngine.init()
        MapManager.init()
        
        // task list
        let taskList: Task[] =
        [
            { name: "ui-engine", func: () => UIEngine.preloadResAsync()},
            { name: "static-data", func: () => StaticData.initAsync()},
            { name: "sprite-library", func: () => SpriteLibrary.initAsync()},
            { name: "object-creator", func: () => ObjectCreator.initResAsync()},
        ]
        await TaskExecutor.all(taskList)

        ObjectCreator.init()
        //await MapManager.loadAsync("map/map1")
        await GameMaster.nextMapAsync()
        
    }

    update(delta: number)
    {
        Time.onUpdate(delta)
    }


}
