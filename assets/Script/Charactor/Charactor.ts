const {ccclass, property} = cc._decorator;

@ccclass
export default class Charactor extends cc.Component 
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
    
}
