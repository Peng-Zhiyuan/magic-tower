import Page from "../../../Subsystems/-UIEngine/Page";
import GameMaster from "../../GM/GameMaster";
import UIEngine from "../../../Subsystems/-UIEngine/UIEngine";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GGPage extends Page
{
    @property(cc.Button)
    button_restart: cc.Button = null

    @property(cc.Node)
    content: cc.Node = null

    onPush()
    {
        
    }

    onRestartButton()
    {
        UIEngine.remove("GGPage")
        GameMaster.restart()
    }

}
