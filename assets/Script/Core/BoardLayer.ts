import Token from "./Token";
import BoardCell from "./BoardCell";

export default class BoardLayer
{
    layerName: string
    data: BoardCell[][]
    width: number
    height: number

    constructor(name: string, width: number, height: number)
    {
        // set meta info
        this.layerName = name
        this.width = width
        this.height = height

        // create board cell
        this.data = []
        for(let i = 0; i < width; i++)
        {
            this.data[i] = []
            for(let j = 0; j < height; j++)
            {
                let cell = new BoardCell(this, i, j)
                this.data[i][j] = cell
            }
        }
    }

    pickAndSet(indexX: number, indexY: number, token: Token)
    {
        token.pick()
        this.set(indexX, indexY, token)
    }

    private set(indexX: number, indexY: number, token: Token)
    {
        let cell = this.data[indexX][indexY]
        if(cell.token != null)
        {
            throw "cell: " + cell + " already has a token"
        }
        if(token.cell != null)
        {
            throw "token: " + token + " already has set to a board cell"
        }
        cell.token = token
        token.cell = cell
    }

    isValid(indexX: number, indexY: number): boolean
    {
        if(indexX >= 0 && indexX < this.width)
        {
            if(indexY >= 0 && indexY < this.height)
            {
                return true
            }
        }
        return false
    }

    getToken(indexX: number, indexY: number): Token
    {
        if(!this.isValid(indexX, indexY))
        {
            return null
        }
        let cell = this.data[indexX][indexY]
        return cell.token
    }

    print()
    {
        let msg = ""
        for(let j = 0; j < this.height; j++)
        {
            for(let i = 0; i < this.width; i++)
            {
                let token = this.getToken(i, j)
                if(token != null)
                {
                    msg += token.tag + ", "
                }
                else
                {
                    msg += "null, "
                }
            }
            msg += "\n"
        }
        console.log(msg)
    }
}