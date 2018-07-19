import Floating from "../../../Subsystems/-UIEngine/Floating";
import MapManager from "../../Core/MapManager";
import GameMaster, { Arrow } from "../../GM/GameMaster";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ControllerFloating extends Floating
{
    onCreate()
    {
        
    }

    

    onKeyButton(event: any, customData: string)
    {
        if(event == "touchstart")
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
            else if(customData == "s")
            {
                GameMaster.showMonsterState(true)
            }
        }
        else if(event == "touchend")
        {
            GameMaster.showMonsterState(false)
        }

    }
}
