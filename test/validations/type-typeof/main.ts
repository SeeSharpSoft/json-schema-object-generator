export namespace Types {
    export const STRING = "s";
    export const NUMBER = 1;
}

export type MyType = typeof Types.STRING | typeof Types.NUMBER;
