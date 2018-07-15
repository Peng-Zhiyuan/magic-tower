import Script from "./Script";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScriptManager 
{
    static async run(name: string): Promise<void>
    {
        let fun = Script[name]
        if(fun == null)
        {
            //throw "script '" + name + "' not found"
            console.warn("script '" + name + "' not found")
        }
        else
        {
            await fun()
        }
    }
}
