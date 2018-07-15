import Player from "../Core/Player";
import Monster from "../Core/Monster";
import StaticData from "../StaticData/StaticData";
import { Sheet } from "../Core/Sheet";
import PlayerStatus from "./PlayerStatus";

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
            monster.token.pick()
            monster.node.destroy()

            // move data
            player.token.cell.layer.pickAndSet(monsterX, monsterY, player.token)
            // move node
            let pos = player.layer.getPositionAt(monsterX, monsterY)
            player.node.setPosition(pos)
        }
    }

}
