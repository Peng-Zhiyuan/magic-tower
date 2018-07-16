import Player from "../Core/Player";
import Monster from "../Core/Monster";
import StaticData from "../StaticData/StaticData";
import { Sheet } from "../Core/Sheet";
import PlayerStatus from "./PlayerStatus";
import MapManager from "../Core/MapManager";
import Item from "../Core/Item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameMaster 
{
    static OnBattle(player: Player, monster: Monster)
    {
        let name = monster.objName
        let row = StaticData.getRow(Sheet.Monster, name)
        let hp = row["hp"]
        let atk = row["atk"]
        let def = row["def"]
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
                    break
                }
            }

            // monster's turn
            {
                let dmg = atk - PlayerStatus.def
                PlayerStatus.hp -= dmg
                if(PlayerStatus.hp <= 0)
                {
                    break
                }
            }
        }

        if(PlayerStatus.hp >= 0)
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
    }

    static currentMap: number = 0

    static async loadMap(map: number)
    {
        let path = "map/map" + map
        await MapManager.loadAsync(path)
    }
    
    static async nextMapAsync()
    {
        this.currentMap += 1
        await this.loadMap(this.currentMap)
    }

    static async previousMapAsync()
    {
        this.currentMap -= 1
        await this.loadMap(this.currentMap)
    }

    static OnPickItem(player: Player, item: Item)
    {
        let row = StaticData.getRow(Sheet.Item, item.objName)
        PlayerStatus.hp += row["add_hp"]
        PlayerStatus.atk += row["add_atk"]
        PlayerStatus.def += row["add_def"]
        PlayerStatus.key_yellow += row["add_yellow_key"]
        PlayerStatus.key_blue += row["add_blue_key"]
        PlayerStatus.key_red += row["add_key_red"]

        // destroy item
        let targetX = item.token.cell.indexX
        let targetY = item.token.cell.indexY
        item.memoryDestory()
        MapManager.removeObject(item)
        // move player
        MapManager.moveObject(player, targetX, targetY)

    }
}
