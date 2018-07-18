import Player from "../../Core/Player";
import Monster from "../../Core/Monster";
import Page from "../../../Subsystems/-UIEngine/Page";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BattelPage extends Page
{
    @property(Monster)
    monster: Monster = null
    @property(cc.Label)
    label_enemy_atk: cc.Label = null
    @property(cc.Label)
    label_enemy_def: cc.Label = null
    @property(cc.Label)
    label_enemy_hp: cc.Label = null
    @property(cc.Label)
    label_player_atk: cc.Label = null
    @property(cc.Label)
    label_player_def: cc.Label = null
    @property(cc.Label)
    label_player_hp: cc.Label = null

    set enemyAtk(value: string)
    {
        this.label_enemy_atk.string = value
    }

    set enemyDef(value: string)
    {
        this.label_enemy_def.string = value
    }

    set enemyHp(value: string)
    {
        this.label_enemy_hp.string = value
    }
    
    set playerAtk(value: string)
    {
        this.label_player_atk.string = value
    }

    set playerDef(value: string)
    {
        this.label_player_def.string = value
    }

    set playerHp(value: string)
    {
        this.label_player_hp.string = value
    }

    set enemySpriteFrameList(spriteFrameList: cc.SpriteFrame[])
    {
        this.monster.sprtieFrameList = spriteFrameList
    }
}
