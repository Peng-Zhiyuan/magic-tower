const { ccclass, property } = cc._decorator;
import PagePool from "./PagePool"
import Page from "./Page"
import PageStack from "./PageStack";
import Floating from "./Floating"

@ccclass
export default class UIEngine {
    static pagePool: PagePool = new PagePool()
    static root: cc.Node
    static designRoot: cc.Node
    static externalLoader: AsyncFunc<UIResourceType, string, cc.Prefab>

    static createdFloating = {}

    static init() {
        this.root = cc.find("Canvas/ui-engine")
        this.designRoot = cc.find("Canvas/Design")
        this.designRoot.active = false
    }

    static preloadResAsync(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>{
            cc.loader.loadResDir("ui-engine", (error, resList, pathList) =>{
                if(error == null)
                {
                    resolve()
                }
                else
                {
                    console.error(error)
                    reject()
                }
            })
        })

    }

    static async forwardAsync(pageName: string, param: string = null, replaceTop: boolean = false): Promise<Page> {
        cc.log("[UIEngine] Navigate to: " + pageName)

        let oldPage = PageStack.find(pageName)
        if(oldPage != null)
        {
            throw "page '" + pageName + "' already in stack, can't forward"
        }
        let page = this.pagePool.take(pageName)
        if (page == null)
        {
            let prefab = await UIEngine.loadPagePrefabAsync(pageName)

            if (prefab == null) {
                throw "[UIEngine] page: " + pageName + " not found"
                return null
            }
            let node = cc.instantiate(prefab)
            page = node.getComponent(Page)
            page.name = prefab.name
            page.node.parent = this.root
            cc.log("[UIEngine] (new Instance " + prefab.name + ")")
            page.onCreate()
        }
        let top = PageStack.peek()
        page.param = param
        page.onParamChanged()
        if (replaceTop) {
            PageStack.replaceTop(page)
        }
        else {
            PageStack.push(page)
        }
        UIEngine.repositionMask()
        return page
    }

    static remove(name: string) {
        let oldPage = PageStack.find(name);
        if (oldPage != null)
        {
            PageStack.remove(name)
            oldPage.node.active = false;
            UIEngine.pagePool.put(name, oldPage)
        }
    }

    static back(result: any = null) {
        let page = PageStack.pop()

        if (page != null) {
            UIEngine.pagePool.put(page.name, page)
        }
        if (PageStack.count > 0) {
            let top = PageStack.peek()
            cc.log("[UIEngine] Back to: " + top.name)
            top.onResult(result)
        }
        else {
            cc.log("[UIEngine] All pages poped!")
        }
        UIEngine.repositionMask()
    }

    static get top(): Page {
        return PageStack.peek()
    }

    static get pageCount(): number {
        return PageStack.count
    }

    static async showFloatingAsync(name: string, param: string = null, depth: number = null) {
        cc.log("[UIEngine] Show Floating: " + name)
        let floating: Floating = this.createdFloating[name]
        if (floating == null || floating == undefined) {

            let prefab = await this.loadFloatingPrefabAsync(name)
            if (prefab == null) {
                throw "[UIEngine] Floating prefab: " + name + "not found"
            }
            let node = UIEngine.createChildKeepLocalProperties(this.root, prefab)
            floating = node.getComponent(Floating)
            floating.name = prefab.name
            floating.onCreate()
            this.createdFloating[name] = floating
            cc.log("[UIEngine] Add Floating: " + name);
        }
        floating.param = param
        floating.onParamChanged()
        floating.active = true
        floating.depth = depth
        return floating
    }

    static getFloatingByName(name: string): Floating {
        let floating: Floating = UIEngine.createdFloating[name]
        return floating
    }

    static getFloating<T extends Floating>(type: { prototype: T }): T {
        let name = type.prototype.name
        return this.getFloatingByName(name) as T
    }

    static hideFloating(name: string) {
        cc.log("[UIEngine] Hide Floating: " + name)
        let floating: Floating = this.createdFloating[name]
        if (floating) {
            floating.active = false
        }
        else {
            cc.log("[UIEngine] Hide Floating Fail: " + name)
        }
    }

    static async repositionMask() 
    {
        let firstPage = PageStack.peek()
        if(firstPage == null)
        {
            return
        }
        if (firstPage.overlay) 
        {
            let mask = await this.showFloatingAsync("MaskFloating", null, firstPage.depth - 1)
        }
        else 
        {
            this.hideFloating("MaskFloating")
        }
    }

    static registerExternalResourcesLoader(loader: AsyncFunc<UIResourceType, string, cc.Prefab>) {
        UIEngine.externalLoader = loader
    }

    private static createChildKeepLocalProperties(parent: cc.Node, prefab: cc.Prefab) {
        let node = cc.instantiate(prefab)
        node.parent = parent
        return node
    }

    public static async loadFloatingPrefabAsync(name: string): Promise<cc.Prefab> {
        let prefab = await this.loadAsync<cc.Prefab>("ui-engine/floatings/" + name)
        if (prefab == null && UIEngine.externalLoader != null) {
            prefab = await UIEngine.externalLoader(UIResourceType.Floating, name)
        }
        return prefab
    }

    public static async loadPagePrefabAsync(name: string): Promise<cc.Prefab> {
        var prefab = await UIEngine.loadAsync<cc.Prefab>("ui-engine/pages/" + name)
        if (prefab == null && UIEngine.externalLoader != null) {
            prefab = await UIEngine.externalLoader(UIResourceType.Page, name) as cc.Prefab
        }
        return prefab;
    }

    private static async loadAsync<T>(path: string): Promise<T> 
    {
        return new Promise<T>((resolve, reject) => 
        {
            cc.loader.loadRes(path, (error, prefab) => 
            {
                if (error == null) {
                    resolve(prefab)
                }
                else {
                    reject()
                }
            })
        })
    }
}

export interface AsyncFunc<T1, T2, TResult> {
    (arg1: T1, arg2: T2): Promise<TResult>
}

export enum UIResourceType {
    Page,
    Floating,
}

export enum UIDepth {
    High = 2000,
    Middle = 1000,
}
