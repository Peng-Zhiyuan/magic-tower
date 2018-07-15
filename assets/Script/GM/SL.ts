import Dialog from "../UI/dialog/Dialog";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SL 
{
    static assetsMapping: {[path: string]: cc.Asset} = {}

    static initAsync(): Promise<void>
    {
        return new Promise((resolve, reject) =>{
            cc.loader.loadRes("ui/dialog", (error, res) =>{
                if(error == null)
                {
                    this.assetsMapping["ui/dialog"] = res
                    resolve()
                }
                else
                {
                    console.error(error)
                    reject()
                }
            })
        })
    }

    static _dialog: Dialog 
    static dialog(spriteFrameList: cc.SpriteFrame[], text: string)
    {
        if(this._dialog == null)
        {
            let prefab = this.assetsMapping["ui/dialog"] as any as cc.Node
            let node = cc.instantiate(prefab)
            let dialog = node.getComponent(Dialog)
            var scene = cc.director.getScene()
            node.parent = scene
            node.position = new cc.Vec2(320, 700)
            this._dialog = dialog
        }
        this._dialog.npcSpriteFrame = spriteFrameList
        this._dialog.text = text
        this._dialog.node.active = true
    }
}
