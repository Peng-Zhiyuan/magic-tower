import Token from "./Token";
import BoardLayer from "./BoardLayer";
import { Action } from "../../Subsystems/-TaskExecutor/Action";

export default class Board
{
    static layerMapping: {[name: string]: BoardLayer} = {}

    static clean()
    {
        this.layerMapping = {}
    }

    static newLayer(name: string, width: number, height: number)
    {
        let layer = new BoardLayer(name, width, height)
        this.layerMapping[name] = layer
    }

    static set(layerName: string, indexX: number, indexY: number, token: Token)
    {
        let layer = this.layerMapping[layerName]
        layer.pickAndSet(indexX, indexY, token)
    }

    static get(layerName: string, indexX: number, indexY: number): Token
    {
        let layer = this.layerMapping[layerName]
        return layer.getToken(indexX, indexY)
    }

    static print()
    {
        for(let name in this.layerMapping)
        {
            let layer = this.layerMapping[name]
            layer.print()
        }
    }

    static eachToken(callback: Action<Token>)
    {
        for(let name in this.layerMapping)
        {
            let layer = this.layerMapping[name]
            let w = layer.width
            let h = layer.height
            for(let i = 0; i < w; i++)
            {
                for(let j = 0; j < h; j++)
                {
                    let token = layer.getToken(i, j)
                    if(token != null)
                    {
                        callback(token)
                    }
                }
            }
        }
    }
}