import MapObject from "./MapObject";
import Memory from "../GM/Memory";
import MapManager from "./MapManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Monster extends MapObject
{
    @property(cc.Sprite)
    sprite: cc.Sprite = null

    

    sprtieFrameList: cc.SpriteFrame[]
    frameInterval: number = 0.25

    init(spriteFrameList: cc.SpriteFrame[])
    {
        this.sprtieFrameList = spriteFrameList;
        this.setSpriteToNext()
    }

    lostTime: number = 0
    update(deltaTime: number)
    {
        this.lostTime += deltaTime
        if(this.lostTime >= this.frameInterval)
        {
            this.lostTime = 0
            this.setSpriteToNext()
        }
    }

    setSpriteByIndex(index: number)
    {
        let sf = this.sprtieFrameList[index]
        this.sprite.spriteFrame = sf
    }

    currentIndex: number = -1
    setSpriteToNext()
    {
        this.currentIndex++
        if(this.currentIndex >= this.sprtieFrameList.length)
        {
            this.currentIndex = 0
        }    
        this.setSpriteByIndex(this.currentIndex)
    }
    
    onEnterMap()
    {
        let a = Memory.getCurrentMapMemory()
        let objMemo = a[this.idInMap]
        if(objMemo != null)
        {
            if(objMemo["destory"])
            {
                MapManager.removeObject(this)
            }
        }
    }

    memoryDestory()
    {
        let memory = Memory.getCurrentMapMemory()
        let objMemo = memory[this.idInMap]
        if(objMemo == null)
        {
            objMemo = {}
            memory[this.idInMap] = objMemo
        }
        objMemo["destory"] = true
    }
}
