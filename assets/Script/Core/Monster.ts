import MapObject from "./MapObject";
import Memory from "../GM/Memory";
import MapManager from "./MapManager";
import MonsterStat from "./MonsterStat";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Monster extends MapObject
{
    @property(cc.Sprite)
    sprite: cc.Sprite = null
    @property(MonsterStat)
    state: MonsterStat


    sprtieFrameList: cc.SpriteFrame[]
    frameInterval: number = 0.25

    init(spriteFrameList: cc.SpriteFrame[])
    {
        this.sprtieFrameList = spriteFrameList;
        this.setSpriteToNext()
        this.showStat(false)
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
        var destroy = Memory.getObj(null, this.id, "destory", false)
        if(destroy)
        {
            MapManager.removeObject(this)
        }
    }

    memoryDestory()
    {
        Memory.setObj(null, this.id, "destroy", true)
    }

    showStat(b: boolean)
    {
        this.state.node.active = b
    }


    
}
