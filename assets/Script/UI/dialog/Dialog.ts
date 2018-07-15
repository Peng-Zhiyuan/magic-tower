import Npc from "../../Core/Npc";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dialog extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property(Npc)
    npc: Npc = null

    set npcSpriteFrame(spriteFrameList: cc.SpriteFrame[])
    {
        this.npc.sprtieFrameList = spriteFrameList
    }

    set text(text: string)
    {
        this.label.string = text
    }
}
