const {ccclass, property} = cc._decorator;

@ccclass
export default class MonsterStat extends cc.Component
{

    @property(cc.Label)
    label_hp: cc.Label = null;
    @property(cc.Label)
    label_atk: cc.Label = null;
    @property(cc.Label)
    label_def: cc.Label = null;
    @property(cc.Label)
    label_loss: cc.Label = null;

    set hp(value: string)
    {
        this.label_hp.string = value
    }

    set atk(value: string)
    {
        this.label_atk.string = value
    }

    set def(value: string)
    {
        this.label_def.string = value
    }

    set loss(value: string)
    {
        this.label_loss.string = value
    }

    set lossColor(color: cc.Color)
    {
        this.label_loss.node.color = color
    }
}
