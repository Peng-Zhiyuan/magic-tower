const {ccclass, property} = cc._decorator;

import View from "./View"
import UIEngine from "./UIEngine";

@ccclass
export default class Page extends View
{
    @property
    overlay: boolean = false

    onNavigatedTo():void {}
	onNavigatedFrom():void {}
    onResult(result:any):void {}
    onPush():void {}
    onPop(): void{}
}

