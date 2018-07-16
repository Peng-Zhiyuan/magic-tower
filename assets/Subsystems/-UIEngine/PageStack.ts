const {ccclass, property} = cc._decorator;
import PagePool from "./PagePool"
import Page from "./Page"
import UIStack from "./UIStack"

@ccclass
export default class PageStack
{
    static stack: UIStack<Page> = new UIStack<Page>()

    static push(page: Page)
    {
        if (this.stack.count > 0)
        {
            let top = this.stack.peek()
            top.onNavigatedFrom();
        }
        page.depth = this.stack.count * 10
        let node = page.node
        node.position = cc.Vec2.ZERO
        this.stack.push(page)
        page.active = true
        PageStack.recaculateActive()
        page.onPush()
        page.onNavigatedTo()
    }

    static pop(): Page
    {
        if (this.stack.count == 0) return null
        let page = this.stack.pop()
        page.active = false
        page.onNavigatedFrom()
        page.onPop()
        PageStack.recaculateActive()
        if (this.stack.count > 0)
        {
            let top = this.stack.peek()
            top.onNavigatedTo()
        }
        return page
    }

    static peek(): Page
    {
        return this.stack.peek()
    }

    static find(name: string): Page
    {
        let result = null;
        this.stack._store.forEach(page => {
            if (page.node.name == name)
            {
                result = page;
            }
        });
        return result
    }

    static get count(): number
    {
        return this.stack.count
    }

    private static tempStack: UIStack<Page> = new UIStack<Page>();
    static remove(name: string): Page
    {
        let ret: Page = null
        while (this.stack.count > 0)
        {
            let page = this.stack.pop()
            if (page.name != name)
            {
                this.tempStack.push(page)
            }
            else
            {
                ret = page
                page.active = false
                page.onPop()
                break;
            }
        }
        while (this.tempStack.count > 0)
        {
            let page = this.tempStack.pop()
            this.stack.push(page)
        }
        if (ret != null)
        {
            PageStack.recaculateActive()
        }
        return ret
    }

    static replaceTop(page: Page)
    {
        let old = this.stack.pop()
        old.active = false
        old.onNavigatedFrom()
        old.onPop()

        this.stack.push(page)
        page.active = true
      
        page.onPush()
        page.onNavigatedTo()
        PageStack.recaculateActive()
    }

    private static recaculateActive()
    {
        let pageStackArray = this.stack._store
        let visible = true
        for(let i = pageStackArray.length - 1; i >= 0 ; i--)
        {
            let page = pageStackArray[i]
            if (visible)
            {
                if(!page.active) page.active = visible;
                visible = false;
            }
            else
            {
                page.active = visible;
            }
        }
    }

    static PopUtil(name: string): Page[]
    {
        let ret: Page[] = []
        while (this.stack.count > 0)
        {
            if (this.stack.peek().name != name)
            {
                let page = this.stack.pop()
                page.active = false
                page.onNavigatedFrom()
                page.onPop()
                ret.push(page)
            }
            else break;
        }
        if (this.stack.count > 0)
        {
            PageStack.recaculateActive()
            let top = this.stack.peek()
            top.onNavigatedTo()
        }
        return ret
    }
}

