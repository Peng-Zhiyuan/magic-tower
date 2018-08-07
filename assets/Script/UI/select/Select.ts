import Npc from "../../Core/Npc";
import Page from "../../../Subsystems/-UIEngine/Page";
import UIEngine from "../../../Subsystems/-UIEngine/UIEngine";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Select extends Page
{
    @property(cc.Node)
    selection_sample: cc.Node
    @property(cc.Node)
    selectionList: cc.Node
    @property(cc.Node)
    content: cc.Node

    onSelection(event: any, customData: string): void
    {
        let top = UIEngine.top
        if(top == this)
        {
            this.resolve(customData)
            UIEngine.back()
        }
    }

    resolve: any
    reject: any
    async showAsync(selectionText: string[], text: string): Promise<string>
    {
        // clear all selection
        let clone = this.selectionList.children.slice(0)
        for(let node of clone)
        {
            if(node != this.selection_sample)
            {
                node.destroy()
            }
        }

        // hide sample
        this.selection_sample.active = false

        // create selection
        for(let item of selectionText)
        {
            let instance = cc.instantiate(this.selection_sample)
            let label = instance.getComponent(cc.Label)
            label.string = item
            let button = instance.getComponentInChildren(cc.Button)
            button.clickEvents[0].customEventData = item
            instance.parent = this.selectionList
            instance.active = true
        }

        // resize content
        let h = this.selection_sample.height * selectionText.length + 55
        if(h < 147)
        {
            h = 147
        }
        this.content.height = h
        
        return new Promise<string>((resolve, reject) =>{
            this.resolve = resolve
            this.reject = reject
        })
    }

}
