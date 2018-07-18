import Floating from "../../../Subsystems/-UIEngine/Floating";
import MapManager from "../../Core/MapManager";
import { Arrow } from "../../Core/Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ControllerFloating extends Floating
{
    onKeyButton(event: any, customData: string)
    {
       if(customData == "left")
       {
           MapManager.player.move(Arrow.Left)
       }
       else if(customData == "right")
       {
            MapManager.player.move(Arrow.Right)
       }
       else if(customData == "up")
       {
            MapManager.player.move(Arrow.Up)
       }
       else if(customData == "down")
       {
            MapManager.player.move(Arrow.Down)
       }
    }
}
