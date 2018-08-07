import SL from "../GM/SL";
import ScriptManager from "./ScriptManager";
import PlayerStatus from "../GM/PlayerStatus";
import { Occupation } from "../GM/Occupation";
import MapManager from "../Core/MapManager";
import AsyncUtil from "../../Subsystems/-BaseKit/AsyncUtil";
import Script from "./Script";
import Memory from "../GM/Memory";

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

            // 预处理
            line = line.trim()
            let start = line.indexOf("${")
            while(start != null && start != -1)
            {
                let end = line.indexOf("}", start)
                if(end == null || end == -1)
                {
                    throw "script error"
                }
                var left = line.substr(0, start)
                var variable = line.substr(start + 2, end - start - 2)
                var value = Memory.getGloble(variable, "")
                var right = line.substr(end + 1, line.length - end - 2)
                line = left + value + right
                console.log("[IS] > " + line)
                start = line.indexOf("${")
            }

            let parts = line.split(" ")
            let cmd = parts[0]
            let arg = parts[1]
            if(cmd == "dialog")
            {
                let allarg = arg
                for(let j = 2; j < parts.length; j++)
                {
                    let a = parts[j]
                    allarg = allarg + " " + a
                }
                let spriteFrameList = []
                let currentNpc = ScriptManager.npc
                if(currentNpc != null)
                {
                    spriteFrameList = currentNpc.sprtieFrameList
                }
                await SL.dialogAsync(spriteFrameList, allarg)
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
            else if(cmd == "call")
            {
                let funName = arg
                let fun = Script[name]
                if(fun == null)
                {
                    console.warn("script '" + name + "' not found")
                }
                else
                {
                    //await fun()
                    await Script[funName]()
                }
            }
            else if(cmd == "juge")
            {
                let left = Number(parts[1])
                let op = parts[2]
                let right = Number(parts[3])
                if(op == "<")
                {
                    if(left < right)
                    {
                        this.result = "yes"
                    }
                    else
                    {
                        this.result = "no"
                    }
                }
                else if(op == "==")
                {
                    if(left == right)
                    {
                        this.result = "yes"
                    }
                    else
                    {
                        this.result = "no"
                    }
                }
                else if(op == ">")
                {
                    if(left > right)
                    {
                        this.result = "yes"
                    }
                    else
                    {
                        this.result = "no"
                    }
                }
                else if(op == "!=")
                {
                    if(left != right)
                    {
                        this.result = "yes"
                    }
                    else
                    {
                        this.result = "no"
                    }
                }
                else if(op == ">=")
                {
                    if(left >= right)
                    {
                        this.result = "yes"
                    }
                    else
                    {
                        this.result = "no"
                    }
                }
                else if(op == "<=")
                {
                    if(left <= right)
                    {
                        this.result = "yes"
                    }
                    else
                    {
                        this.result = "no"
                    }
                }
            }
            else if(cmd == "echo")
            {
                this.result = arg
            }
            else if(cmd == "move-player")
            {
                let argParts = arg.split(",")
                let x = Number(argParts[0])
                let y = Number(argParts[1])
                SL.movePlayer(x, y)
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