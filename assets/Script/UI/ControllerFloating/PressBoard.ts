const {ccclass, property} = cc._decorator;

@ccclass
export default class PressBoard extends cc.Component 
{
    @property(cc.Component.EventHandler)
    event: cc.Component.EventHandler

    start () 
    {
        this.node.on("touchstart", this.onPress, this)
    }

    onPress(data)
    {
        this.event.emit([data, this.event.customEventData])
    }


}
