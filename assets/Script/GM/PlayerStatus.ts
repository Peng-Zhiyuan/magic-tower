import { Occupation } from "./Occupation";
import { KeyType } from "./KeyType";

export default class PlayerStatus
{
    static occupation: Occupation = Occupation.None
    static hp: number = 200
    static atk: number = 10
    static def: number = 10
    static cert: number = 0
    static key_yellow: number = 0
    static key_blue: number = 0
    static key_red: number = 0

    static reset()
    {
        this.occupation = Occupation.None
        this.hp = 200
        this.atk = 10
        this.def = 10
        this.cert = 0
        this.key_yellow = 0
        this.key_blue = 0
        this.key_red = 0
    }

    static isKeyEnouph(keyList: string[])
    {
        let enouph = true
        for(let key of keyList)
        {
            if(key == KeyType.Yellow)
            {
                if(this.key_yellow > 0)
                {
                    continue
                }
                else
                {
                    enouph = false
                    break
                }
            }
            if(key == KeyType.Blue)
            {
                if(this.key_blue > 0)
                {
                    continue
                }
                else
                {
                    enouph = false
                    break
                }
            }
            if(key == KeyType.Red)
            {
                if(this.key_red > 0)
                {
                    continue
                }
                else
                {
                    enouph = false
                    break
                }
            }
        }
        return enouph
    }

    static decKey(keyList: string[])
    {
        for(let key of keyList)
        {
            if(key == KeyType.Yellow)
            {
                this.key_yellow --
            }
            else if(key == KeyType.Blue)
            {
                this.key_blue --
            }
            else if(key == KeyType.Red)
            {
                this.key_red --
            }
        }
    }
}