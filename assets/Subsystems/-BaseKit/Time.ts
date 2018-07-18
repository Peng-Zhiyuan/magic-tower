export default class Time {
    static deltaTime: number = 0
    static time: number = 0

    static onUpdate(deltaTime: number) {
        this.deltaTime = deltaTime
        this.time += deltaTime
    }
}