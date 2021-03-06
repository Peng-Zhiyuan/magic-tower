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
import Board from "../Core/Board";
import Token from "../Core/Token";
import { ObjType } from "../Core/ObjType";
import ScriptManager from "../Scripting/ScriptManager";
import Npc from "../Core/Npc";
import InlineScriptExecutor from "../Scripting/InlineScpriteExecutor";
import GameManifest from "../../Subsystems/-GameManifest/GameManifest";
import MapEventManager from "../Core/MapEventManager";
import MapEvent from "../Core/MapEvent";
import GameMasterPatch from "./GameMasterPatch";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMaster 
{
    static inBattle: boolean
    static currentMap: string

    static createPatch()
    {
        let data = new GameMasterPatch()
        data.inBattle = this.inBattle
        data.currentMap = this.currentMap
        var memoryPatch = Memory.createPatch()
        data.memoryPatch = memoryPatch
        var playerStatusPatch = PlayerStatus.createPatch()
        data.playerStatusPatch = playerStatusPatch
        var mapPatch = MapManager.createPatch()
        data.mapManagerPatch = mapPatch
        return data
    }

    static applyPatch(p: GameMasterPatch)
    {
        // patch memory
        Memory.applyPatch(p.memoryPatch)

        // patch player satus
        PlayerStatus.applayPatch(p.playerStatusPatch)

        // patch map manager
        let map = p.currentMap
        let playerX = p.mapManagerPatch.playerLocation.indexX
        let plaeyrY = p.mapManagerPatch.playerLocation.indexY
        this.loadMap(map, playerX, plaeyrY)

        // patch game master
        this.inBattle = p.inBattle
        this.currentMap = p.currentMap
    }

    static OnBattle(player: Player, monster: Monster)
    {
        let loss = this.calcuBattleLoss(monster)
        if(loss >= PlayerStatus.hp)
        {
            console.log("need hp: " + loss)
            return;
        }
        this.doBattleAsync(player, monster)
    }

    static async doBattleAsync(player: Player, monster: Monster): Promise<void>
    {
        // set battle state
        this.inBattle = true

        let waiteTime = 0.1
        let page = await UIEngine.forwardAsync("BattlePage") as any as BattelPage
        let name = monster.objName
        let row = StaticData.getRow(Sheet.Monster, name)
        let hp = row["hp"]
        let atk = row["atk"]
        let def = row["def"]
        let exp = row["exp"]
        let gold = row["gold"]

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
                if(dmg < 0)
                {
                    dmg = 0
                }
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
                if(dmg < 0)
                {
                    dmg = 0
                }
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

            // move plaer
            // MapManager.moveObject(player, monsterX, monsterY)

            // add exp
            this.addExp(exp)

            // add gold
            this.addGold(gold)
        }
        else
        {
            UIEngine.forwardAsync("GGPage")
        }

        // set battle end
        this.inBattle = false

        // update monster state
        this.refreshMonsterState()
    }



    static loadMap(map: string, x: number, y: number)
    {
        console.log("[GameMaster] load map " + map)
        this.currentMap = map
        MapManager.load(map, x, y)
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

        // update monster stat
        this.refreshMonsterState()

    }

    static CalcuBuff(value: number)
    {
        if(PlayerStatus.occupation == Occupation.Warrior)
        {
            let benifet = Number(StaticData.getCell("base", "warrior_benifet", "value"))
            let extra = Math.ceil(value * benifet)
            return value + extra
        }
        return value
    }

    static restart()
    {
        this.inBattle = false
        Memory.reset()
        PlayerStatus.reset()
        let mainMap = GameManifest.get("main-map")
        let x = Number(GameManifest.get("main-x"))
        let y = Number(GameManifest.get("main-y"))
        this.loadMap(mainMap, x, y)
    }
    
    static refreshMonsterState()
    {
        if(this.showingMonsterState)
        {
            this.showMonsterState(true)
        }
    }

    static calcuBattleLoss(monster: Monster)
    {
        let row = StaticData.getRow(Sheet.Monster, monster.objName)
        let hp = row["hp"]
        let atk = row["atk"]
        let def = row["def"]
        let playerDmg = PlayerStatus.atk - def
        if(playerDmg < 0)
        {
            playerDmg = 0
        }
        let playerNeedAttackTimes = Math.ceil(hp / playerDmg)
        let monsterAttackTimes = playerNeedAttackTimes - 1
        if(monsterAttackTimes < 0)
        {
            monsterAttackTimes = 0
        }
        let monsterDmg = atk - PlayerStatus.def
        if(monsterDmg < 0)
        {
            monsterDmg = 0
        }
        let loss = monsterAttackTimes * monsterDmg
        return loss
    }

    static showingMonsterState: boolean
    static showMonsterState(b: boolean)
    {
        this.showingMonsterState = b
        Board.eachToken( (token:Token) =>{
            if(token.obj.type == ObjType.Monster)
            {
                let monster = token.obj as Monster
                if(b)
                {
                    let state = monster.state
                    let row = StaticData.getRow(Sheet.Monster, monster.objName)
                    let hp = row["hp"]
                    let atk = row["atk"]
                    let def = row["def"]
                    // let playerDmg = PlayerStatus.atk - def
                    // if(playerDmg < 0)
                    // {
                    //     playerDmg = 0
                    // }
                    // let playerNeedAttackTimes = Math.ceil(hp / playerDmg)
                    // let monsterAttackTimes = playerNeedAttackTimes - 1
                    // if(monsterAttackTimes < 0)
                    // {
                    //     monsterAttackTimes = 0
                    // }
                    // let monsterDmg = atk - PlayerStatus.def
                    // if(monsterDmg < 0)
                    // {
                    //     monsterDmg = 0
                    // }
                    // let loss = monsterAttackTimes * monsterDmg
                    let loss = this.calcuBattleLoss(monster)

                    state.hp = hp
                    state.atk = atk
                    state.def = def
                    state.loss = loss == Infinity ? "9999" : loss.toString()
                    if(loss >= PlayerStatus.hp || loss == Infinity)
                    {
                        state.lossColor = cc.Color.RED
                    }
                    else if(loss >= Math.floor(PlayerStatus.hp * 0.4))
                    {
                        state.lossColor = cc.Color.YELLOW
                    }
                    else if(loss == 0)
                    {
                        state.lossColor = cc.Color.GREEN
                    }
                    else
                    {
                        state.lossColor = cc.Color.WHITE
                    }
                    
                    monster.showStat(true)
                }
                else
                {
                    monster.showStat(false)
                }
            }
        })
    }

    static addExp(value: number)
    {
        PlayerStatus.exp += value
        while(PlayerStatus.exp >= 100)
        {
            PlayerStatus.level++
            PlayerStatus.exp -= 100
            let hp_grouth = Number(StaticData.getCell("base", "hp_grouth", "value"))
            let atk_grouth = Number(StaticData.getCell("base", "atk_grouth", "value"))
            let def_grouth = Number(StaticData.getCell("base", "def_grouth", "value"))
            PlayerStatus.hp += this.CalcuBuff(hp_grouth)
            PlayerStatus.atk += this.CalcuBuff(atk_grouth)
            PlayerStatus.def += this.CalcuBuff(def_grouth)
        }
    }

    static addGold(value: number)
    {
        PlayerStatus.gold += value;
    }

    static movePlayer(arrow: Arrow)
    {
        if(this.inBattle)
        {
            return
        }
        let boardX = MapManager.player.token.cell.indexX
        let boardY = MapManager.player.token.cell.indexY
        let targetX = boardX
        let targetY = boardY
        switch(arrow)
        {
            case Arrow.Up:
                targetY -= 1
                break
            case Arrow.Down:
                targetY += 1
                break
            case Arrow.Left:
                targetX -= 1
                break
            case Arrow.Right:
                targetX += 1
                break
        }
        let valid = MapManager.player.token.cell.layer.isValid(targetX, targetY)
        if(!valid)
        {
            return
        }
        let targetToken = MapManager.player.token.cell.layer.getToken(targetX, targetY)
        if(targetToken != null)
        {
            // 当移动的目标有对象存在时
            let obj = targetToken.obj

            // 检查对象是否存在可用事件
            if(obj.event != null && !obj.event.forbid)
            {
                // 如果有则总是触发事件
                MapEventManager.trigger(obj.event)
            }
            else
            {
                // 如果没有

                // 如果是怪兽则战斗
                if(obj.type == ObjType.Monster)
                {
                    // battle
                    console.log("BATTLE!")
                    GameMaster.OnBattle(MapManager.player, obj as Monster)
                }
                else if(obj.type == ObjType.Specail)
                {
                    // TODO: ...
                    let row = StaticData.getRow(Sheet.Specail, obj.objName)
                    //let change_map = row["change_map"] as string
                    let dec_item_to_destroy = row["dec_item_to_destroy"] as string
    
                    if(dec_item_to_destroy != "")
                    {
                        let list = dec_item_to_destroy.split(",")
                        let enouph = PlayerStatus.isKeyEnouph(list)
                        let occu = PlayerStatus.occupation
                        if(enouph || occu == Occupation.Thief)
                        {
                            // dec keys
                            if(occu != Occupation.Thief)
                            {
                                PlayerStatus.decKey(list)
                            }
    
                            // remove door
                            obj.memoryDestory()
                            obj.token.pick()
                            obj.node.destroy()
    
                            // node player
                            MapManager.player.token.cell.layer.pickAndSet(targetX, targetY, MapManager.player.token)
                            let pos = MapManager.player.layer.getPositionAt(targetX, targetY)
                            MapManager.player.node.setPosition(pos)
                        }
                        else
                        {
                            // do nothing
                        }
                    }
    
                }
                else if(obj.type == ObjType.Npc)
                {
                    console.warn("no non-forbiden event attached!")
                }
                else if(obj.type == ObjType.Item)
                {
                    GameMaster.OnPickItem(MapManager.player, obj as Item)
                }
            }

        }
        else
        {
            MapManager.moveObject(MapManager.player, targetX, targetY)

            // check event
            let event = MapEventManager.getFromIndexDic(targetX, targetY)
            if(event != null)
            {
                MapEventManager.triggerByIndex(targetX, targetY)
            }
        }
    }  

}

export enum Arrow
{
    Up,
    Down,
    Left,
    Right,
}