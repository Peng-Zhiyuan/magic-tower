import { Occupation } from "./Occupation";
import { KeyType } from "./KeyType";
import StaticData from "../StaticData/StaticData";

export default class PlayerStatusPatch
{
    occupation: Occupation = Occupation.None
    hp: number = 200
    atk: number = 10
    def: number = 10
    cert: number = 0
    key_yellow: number = 0
    key_blue: number = 0
    key_red: number = 0
    exp: number = 0
    level: number = 0
    gold: number = 0

}