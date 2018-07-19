const {ccclass, property} = cc._decorator;

@ccclass
export default class PressBoard extends cc.Component 
{
    @property(cc.Component.EventHandler)
    event: cc.Component.EventHandler

    start () 
    {
        this.node.on("touchstart", this.onPress, this)
        this.node.on("touchend", this.onPressEnd, this)
        this.node.on("touchcancel", this.onPressEnd, this)
    }

    onPress(data)
    {
        this.event.emit(["touchstart", this.event.customEventData])
    }

    onPressEnd(data)
    {
        this.event.emit(["touchend", this.event.customEventData])
    }


}
