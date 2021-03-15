namespace A {
    export interface A {
        a: any;
    }
}
namespace B {
    export interface B {
        b: any;
    }
}
namespace C {
    import A = B.B;
    export interface CC {
        c: A;
    }
    export type C = CC;
}
namespace D {
    import A = C.C;
    export interface D {
        d: A;
    }
}

export type MyObject = D.D;
