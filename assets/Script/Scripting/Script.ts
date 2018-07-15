const {ccclass, property} = cc._decorator;

@ccclass
export default class Script
{
    static async hello(): Promise<void>
    {
        console.log("hello script!")
    }
}
