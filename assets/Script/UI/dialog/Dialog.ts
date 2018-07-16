import Npc from "../../Core/Npc";
import Page from "../../../Subsystems/-UIEngine/Page";
import UIEngine from "../../../Subsystems/-UIEngine/UIEngine";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Dialog extends Page
{
    @property(cc.Label)
    label: cc.Label = null;

    @property(Npc)
    npc: Npc = null

    set npcSpriteFrame(spriteFrameList: cc.SpriteFrame[])
    {
        this.npc.init(spriteFrameList)
    }

    set text(text: string)
    {
        this.label.string = text
    }

    onCloseButton(): void
    {
        let top = UIEngine.top
        if(top == this)
        {
            this.resolve()
            UIEngine.back()
        }
    }

    resolve: any
    reject: any
    async showAsync(spriteFrameList: cc.SpriteFrame[], text: string): Promise<void>
    {
        this.npcSpriteFrame = spriteFrameList
        this.text = text
        this.node.active = true
        return new Promise<void>((resolve, reject) =>{
            this.resolve = resolve
            this.reject = reject
        })
    }

}
