export default class UpdateManager
{
    private static readonly list: IUpdatable[] = []
    private static readonly newAdd: IUpdatable[] = []
    private static readonly newRemove: IUpdatable[] = []

    static add(updatable: IUpdatable)
    {
        this.newAdd.push(updatable)
    }

    static remove(updatable: IUpdatable)
    {
        this.newRemove.push(updatable)
    }

    static update()
    {
        this.list.forEach(u => {
            u.update()
        });

        if (this.newRemove.length > 0)
        {
            this.newRemove.forEach(r => {
                
                let index = this.list.indexOf(r)
                if (index != -1)
                {
                    this.list.splice(index, 1)
                }
            });
            this.newRemove.splice(0, this.newRemove.length)
        }

        if (this.newAdd.length > 0)
        {
            this.newAdd.forEach(r => {

                if (this.list.indexOf(r) == -1)
                {
                    this.list.push(r)
                }
               
            })
            this.newAdd.splice(0, this.newAdd.length)
        }



    }
}

export interface IUpdatable
{
    update(): void
}