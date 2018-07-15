import PlayerStatus from "./PlayerStatus";

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

    update()
    {
        this.label_atk.string = PlayerStatus.atk.toString()
        this.label_hp.string = PlayerStatus.hp.toString()
        this.label_def.string = PlayerStatus.def.toString()
        this.label_cert.string = PlayerStatus.cert.toString() + "%"
    }
}
