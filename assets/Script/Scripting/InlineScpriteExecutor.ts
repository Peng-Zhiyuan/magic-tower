import SL from "../GM/SL";
import ScriptManager from "./ScriptManager";
import PlayerStatus from "../GM/PlayerStatus";
import { Occupation } from "../GM/Occupation";
import MapManager from "../Core/MapManager";
import AsyncUtil from "../../Subsystems/-BaseKit/AsyncUtil";

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
            else if(cmd == "add-exp")
            {
                let value = Number(arg)
                SL.addExp(value)
            }
            else if(cmd == "add-gold")
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
            else if(cmd == "sleep")
            {
                let seconds = Number(arg)
                await AsyncUtil.waiteAsync(seconds)
            }
            else if(cmd == "change-map")
            {
                let argParts = arg.split(",")
                let name = argParts[0]
                let borinPoint = argParts[1]
                await SL.changeMapAsync(name, borinPoint)
            }
            else if(cmd == "get")
            {
                let argParts = arg.split(",")
                let name = argParts[0]
                let _default = argParts[1]
                return SL.get(name, _default)
            }
            else if(cmd == "set")
            {
                let argParts = arg.split(",")
                let name = argParts[0]
                let value = argParts[1]
                SL.set(name, value)
            }
            else if(cmd == "add")
            {
                let argParts = arg.split(",")
                let name = argParts[0]
                let value = Number(argParts[1])
                SL.add(name, value)
            }
            else if(cmd == "sub")
            {
                let argParts = arg.split(",")
                let name = argParts[0]
                let value = Number(argParts[1])
                SL.sub(name, value)
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