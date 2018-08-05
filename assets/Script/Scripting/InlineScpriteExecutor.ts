import SL from "../GM/SL";
import ScriptManager from "./ScriptManager";
import PlayerStatus from "../GM/PlayerStatus";
import { Occupation } from "../GM/Occupation";
import MapManager from "../Core/MapManager";

export default class InlineScriptExecutor
{
    static result: string
    static async executeAsync(is: string)
    {
        let list = is.split("\\n")
        for (var i = 0; i < list.length; i++)
        {
            let line = list[i]
            console.log("[IS] " + line)
            line = line.trim()
            let parts = line.split(" ")
            let cmd = parts[0]
            let arg = parts[1]
            if(cmd == "dialog")
            {
                let allarg = arg
                for(let j = 2; j <= parts.length; j++)
                {
                    let a = parts[i]
                    allarg = allarg + " " + a
                }
                await SL.dialogAsync(ScriptManager.npc.sprtieFrameList, allarg)
            }
            else if(cmd == "select")
            {
                let argParts = arg.split(",")
                this.result = await SL.selectAsync(argParts)
            }
            else if(cmd == "add_exp")
            {
                let value = Number(arg)
                SL.addExp(value)
            }
            else if(cmd == "add_gold")
            {
                let value = Number(arg)
                SL.addGold(value)
            }
            else if(cmd == "destory")
            {
                let argParts = arg.split(",")
                let indexX = Number(argParts[0])
                let indexY = Number(argParts[1])
                SL.destory(indexX, indexY)
            }
            else if(cmd == "create")
            {
                let argParts = arg.split(",")
                let objName = argParts[0]
                let indexX = Number(argParts[1])
                let indexY = Number(argParts[2])
                SL.create(objName, indexX, indexY)
            }
            else if(cmd == "move")
            {
                let argParts = arg.split(",")
                let indexX = Number(argParts[0])
                let indexY = Number(argParts[1])
                let targetIndexX = Number(argParts[2])
                let targetIndexY = Number(argParts[3])
                SL.move(indexX, indexY, targetIndexX, targetIndexY)
            }
            else if(cmd == "if" || cmd == "elseif")
            {
                if(arg == this.result)
                {
                    // 执行 if 块，删除 else 块
                    let depth = 0
                    let del = false
                    for(var j = i + 1; j < list.length; j++)
                    {
                        let peekLine = list[j]
                        peekLine = peekLine.trim()
                        let parts = peekLine.split(" ")
                        let cmd = parts[0]
                        let arg = parts[1]
                        if(!del)
                        {
                            if(cmd == "if")
                            {
                                depth ++
                            }
                            else if(cmd == "end")
                            {
                                depth --
                            }
                            if(depth == 0)
                            {
                                if(cmd == "else" || cmd == "elseif")
                                {
                                    del = true
                                    list.splice(j, 1)
                                    j--;
                                }
                            }
                        }
                        else
                        {
                            if(cmd != "end")
                            {
                                list.splice(j, 1)
                                j--;
                            }
                        }
                        if(depth == 0)
                        {
                            if(cmd == "end")
                            {
                                break
                            }
                        }
                       

                    }
                }
                else
                {
                    // 跳过
                    for(var j = i + 1; j < list.length; j++)
                    {
                        let peekLine = list[j]
                        let parts = peekLine.split(" ")
                        let cmd = parts[0]
                        let arg = parts[1]
                        if(cmd == "else" || cmd == "elseif" || cmd == "end")
                        {
                            i = j - 1
                            break;
                        }
                    }
                }
            }
        }
    }
}