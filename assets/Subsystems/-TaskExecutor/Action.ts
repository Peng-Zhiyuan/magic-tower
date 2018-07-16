export interface Action0
{
    (): void
}

export interface Action<T>
{
    (arg: T): void
}

export interface Action2<T1, T2>
{
    (arg1: T1, arg2: T2): void
}

export interface Action3<T1, T2, T3>
{
    (arg1: T1, arg2: T2, arg3: T3): void
}

export interface Func0<TResult>
{
    (): TResult
}

export interface Func<TArg, TResult>
{
    (arg: TArg): TResult
}

export interface Func2<TArg1, TArg2, TResult>
{
    (arg1: TArg1, arg2: TArg2): TResult
}

export interface Func3<TArg1, TArg2, TArg3, TResult>
{
    (arg1: TArg1, arg2: TArg2, arg3: TArg3): TResult
}