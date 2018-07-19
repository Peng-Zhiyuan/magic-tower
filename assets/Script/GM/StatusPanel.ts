import PlayerStatus from "./PlayerStatus";
import { Occupation } from "./Occupation";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StatusPanel extends cc.Component {

    @property(cc.Label)
    label_hp: cc.Label = null;
    @property(cc.Label)
    label_atk: cc.Label = null;
    @property(cc.Label)
    label_def: cc.Label = null;
    @property(cc.Label)
    label_cert: cc.Label = null;
    @property(cc.Label)
    label_occu: cc.Label = null;
    @property(cc.Label)
    key_yellow: cc.Label = null;
    @property(cc.Label)
    key_blue: cc.Label = null;
    @property(cc.Label)
    key_red: cc.Label = null;
    @property(cc.Label)
    lable_exp: cc.Label = null;

    _hp: number
    set hp(value: number)
    {
        if(value == this._hp)
        {
            return
        }
        this._hp = value
        this.label_hp.string = value.toString()
    }

    _atk: number
    set atk(value: number)
    {
        if(value == this._atk)
        {
            return
        }
        this._atk = value
        this.label_atk.string = value.toString()
    }

    _def: number
    set def(value: number)
    {
        if(value == this.def)
        {
            return
        }
        this._def = value
        this.label_def.string = value.toString()
    }

    _cert: number
    set cert(value: number)
    {
        if(value == this._cert)
        {
            return
        }
        this._cert = value
        this.label_cert.string = value.toString() + "%"
    }

    _occu: Occupation
    set occu(value: Occupation)
    {
        if(value == this._occu)
        {
            return
        }
        this._occu = value
        switch(this._occu)
        {
            case Occupation.None:
                this.label_occu.string = ""
                break;
            case Occupation.Thief:
                this.label_occu.string = "Thief"
                break;
            case Occupation.Warrior:
                this.label_occu.string = "Warrior"
                break;
        }
        this.refreshOccuLabel()
    }

    _level: number
    set level(value: Occupation)
    {
        if(value == this._level)
        {
            return
        }
        this._level = value
        this.refreshOccuLabel()
    }

    refreshOccuLabel()
    {
        switch(this._occu)
        {
            case Occupation.None:
                this.label_occu.string = ""
                break;
            case Occupation.Thief:
                this.label_occu.string = "Thief" + " Lv." + this._level
                break;
            case Occupation.Warrior:
                this.label_occu.string = "Warrior" + " Lv." + this._level
                break;
        }
    }

    _yellowKey: number
    set yellowKey(value: number)
    {
        if(value == this._yellowKey)
        {
            return
        }
        this._yellowKey = value
        this.key_yellow.string = "x " + value.toString()
    }

    _blueKey: number
    set blueKey(value: number)
    {
        if(value == this._blueKey)
        {
            return
        }
        this._blueKey = value
        this.key_blue.string = "x " + value.toString()
    }

    _redKey: number
    set redKey(value: number)
    {
        if(value == this._redKey)
        {
            return
        }
        this._redKey = value
        this.key_red.string = "x " + value.toString()
    }

    _exp: number
    set exp(value: number)
    {
        if(value == this._exp)
        {
            return
        }
        this._exp = value
        this.lable_exp.string = value + "/100"
    }

    update()
    {
        this.hp = PlayerStatus.hp
        this.atk = PlayerStatus.atk
        this.def = PlayerStatus.def
        this.occu = PlayerStatus.occupation
        this.yellowKey = PlayerStatus.key_yellow
        this.blueKey = PlayerStatus.key_blue
        this.redKey = PlayerStatus.key_red
        this.exp = PlayerStatus.exp
        this.level = PlayerStatus.level
        if(this.occu == Occupation.None)
        {
            this.lable_exp.node.active = false
        }
        else
        {
            this.lable_exp.node.active = true
        }
    }
}
