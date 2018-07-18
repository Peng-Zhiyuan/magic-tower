import MapObject from "../Core/MapObject"
import Player from "../Core/Player";
import Monster from "../Core/Monster";
import StaticData from "../StaticData/StaticData";
import { Sheet } from "../Core/Sheet";
import PlayerStatus from "./PlayerStatus";
import MapManager from "../Core/MapManager";
import Item from "../Core/Item";
import { Occupation } from "./Occupation";
import UIEngine from "../../Subsystems/-UIEngine/UIEngine";
import BattelPage from "../UI/BattlePage/BattlePage";
import AsyncUtil from "../../Subsystems/-BaseKit/AsyncUtil";
import Memory from "./Memory";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMaster 
{
    static OnBattle(player: Player, monster: Monster)
    {
        this.doBattleAsync(player, monster)
    }

    static async doBattleAsync(player: Player, monster: Monster): Promise<void>
    {
        let waiteTime = 0.1
        let page = await UIEngine.forwardAsync("BattlePage") as any as BattelPage
        let name = monster.objName
        let row = StaticData.getRow(Sheet.Monster, name)
        let hp = row["hp"]
        let atk = row["atk"]
        let def = row["def"]

        // set monster sprite
        page.enemySpriteFrameList = monster.sprtieFrameList

        // push to page
        page.playerHp = PlayerStatus.hp.toString()
        page.playerAtk = PlayerStatus.atk.toString()
        page.playerDef = PlayerStatus.def.toString()
        page.enemyHp = hp.toString()
        page.enemyAtk = atk.toString()
        page.enemyDef = def.toString()

        await AsyncUtil.waiteAsync(waiteTime)

        while(true)
        {
            // player's turn
            {
                let dmg = PlayerStatus.atk - def
                // take cert
                if(Math.random() * 100 < PlayerStatus.cert)
                {
                    dmg *= 2
                }
                hp -= dmg
                if(hp <= 0)
                {
                    hp = 0
                }
            }

            // push to page
            page.playerHp = PlayerStatus.hp.toString()
            page.playerAtk = PlayerStatus.atk.toString()
            page.playerDef = PlayerStatus.def.toString()
            page.enemyHp = hp.toString()
            page.enemyAtk = atk.toString()
            page.enemyDef = def.toString()

            if(hp <= 0)
            {
                break
            }

            await AsyncUtil.waiteAsync(waiteTime)



            // monster's turn
            {
                let dmg = atk - PlayerStatus.def
                PlayerStatus.hp -= dmg
                if(PlayerStatus.hp <= 0)
                {
                    PlayerStatus.hp = 0
                }
            }

            // push to page
            page.playerHp = PlayerStatus.hp.toString()
            page.playerAtk = PlayerStatus.atk.toString()
            page.playerDef = PlayerStatus.def.toString()
            page.enemyHp = hp.toString()
            page.enemyAtk = atk.toString()
            page.enemyDef = def.toString()

            if(PlayerStatus.hp <= 0)
            {
                break
            }

            await AsyncUtil.waiteAsync(waiteTime)
        }

        UIEngine.back()

        if(PlayerStatus.hp > 0)
        {
            // get info
            let monsterX = monster.token.cell.indexX
            let monsterY = monster.token.cell.indexY

            // kill monster
            monster.memoryDestory()
            MapManager.removeObject(monster)

            // move data
            MapManager.moveObject(player, monsterX, monsterY)
        }
        else
        {
            UIEngine.forwardAsync("GGPage")
        }
    }

    static currentMap: number = 0

    static async loadMap(map: number, isDown: boolean)
    {
        let path = "map/map" + map
        await MapManager.loadAsync(path, isDown)
    }
    
    static async nextMapAsync()
    {
        this.currentMap += 1
        await this.loadMap(this.currentMap, false)
    }

    static async previousMapAsync()
    {
        this.currentMap -= 1
        await this.loadMap(this.currentMap, true)
    }

    static OnPickItem(player: Player, item: Item)
    {
        let row = StaticData.getRow(Sheet.Item, item.objName)
        PlayerStatus.hp += this.CalcuBuff(row["add_hp"])
        PlayerStatus.atk += this.CalcuBuff(row["add_atk"])
        PlayerStatus.def += this.CalcuBuff(row["add_def"])
        PlayerStatus.key_yellow += row["add_yellow_key"]
        PlayerStatus.key_blue += row["add_blue_key"]
        PlayerStatus.key_red += row["add_red_key"]

        // destroy item
        let targetX = item.token.cell.indexX
        let targetY = item.token.cell.indexY
        item.memoryDestory()
        MapManager.removeObject(item)
        // move player
        MapManager.moveObject(player, targetX, targetY)

    }

    static CalcuBuff(value: number)
    {
        if(PlayerStatus.occupation == Occupation.Warrior)
        {
            let extra = Math.ceil(value * 0.25)
            return value + extra
        }
        return value
    }

    static restart()
    {
        Memory.reset()
        PlayerStatus.reset()
        this.currentMap = 0
        this.nextMapAsync()
    }
}
