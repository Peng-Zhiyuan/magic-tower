export default class UIStack<T> 
{
    _store: T[] = [];

    push(val: T) {
      this._store.push(val);
    }
    pop(): T | null {
      return this._store.pop();
    }

    peek(): T
    {
      return this._store[this._store.length - 1]
    }

    get count(): number
    {
      return this._store.length
    }
}