const { ccclass, property } = cc._decorator;

@ccclass
export default class View extends cc.Component 
{
    param: string

    private _active: boolean
    get active(): boolean {
        return this._active
    }
    set active(value: boolean) {
        if (this._active == value) return
        this._active = value
        this.node.active = value
        if (value) {
            this.onActive()
        }
        else {
            this.onInactive()
        }
    }

    private _depth: number
    get depth(): number {
        return this._depth
    }
    set depth(value: number) {
        this._depth = value
        this.node.setLocalZOrder(value)
    }

    // 当被(UIEngine)创建时调用
    onCreate(): void { }
    onParamChanged(): void {}
    onFrameUpdate(): void { }
    protected onActive(): void { }
    protected onInactive(): void { }
}
