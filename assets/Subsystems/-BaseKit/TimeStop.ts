import Time from "./Time";


export default class TimeStop
{
    startTime: number

    public start()
    {
        this.startTime = Time.time
    }

    public get tick()
    {
        let now = Time.time
        return now - this.startTime
    }
}