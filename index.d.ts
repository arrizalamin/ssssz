// Natural
export type Peano = "S"[];
export type Succ<T extends "S"[]> = [...T, "S"];
export type Pred<T extends "S"[]> = T extends Z
  ? Z
  : T extends [infer _, ...infer Tail]
  ? Tail
  : never;
type Z = [];
type One = Succ<Z>;

export type ToPeano<
  N extends number,
  Result extends Peano = Z
> = Result["length"] extends N ? Result : ToPeano<N, Succ<Result>>;

export type FromPeano<N extends Peano> = N["length"];

export type AddPeano<A extends Peano, B extends Peano> = [...A, ...B];

export type SubtractPeano<A extends Peano, B extends Peano> = B extends Z
  ? A extends Z
    ? Z
    : A
  : SubtractPeano<Pred<A>, Pred<B>>;

export type MultiplyPeano<
  A extends Peano,
  B extends Peano,
  Result extends Peano = A
> = A extends Z
  ? Z
  : B extends Z
  ? Z
  : B extends One
  ? Result
  : MultiplyPeano<A, Pred<B>, AddPeano<A, Result>>;

export type LessThanPeano<A extends Peano, B extends Peano> = A extends B
  ? false
  : SubtractPeano<A, B> extends Z
  ? true
  : false;

export type DivPeano<
  A extends Peano,
  B extends Peano,
  Result extends Peano = Z
> = A extends Z
  ? Result
  : B extends Z
  ? never
  : LessThanPeano<A, B> extends true
  ? Result
  : DivPeano<SubtractPeano<A, B>, B, Succ<Result>>;

// Integer
export type Pos<N extends Peano> = ["Pos", N];
export type Neg<N extends Peano> = ["Neg", N];
export type Int = Pos<Peano> | Neg<Peano>;

type ToNumber<
  T extends string,
  R extends true[] = []
> = T extends `${R["length"]}` ? R["length"] : ToNumber<T, [true, ...R]>;

export type ToInt<N extends number> = `${N}` extends `-${infer N_}`
  ? Neg<ToPeano<ToNumber<N_>>>
  : Pos<ToPeano<N>>;

// Limitation: Can not convert negative integer
export type FromInt<N extends Int> = N extends ["Pos", infer N_]
  ? FromPeano<N_>
  : N extends ["Neg", infer N_]
  ? ["Neg", FromPeano<N_>]
  : never;

type AddPosNeg<P extends Peano, N extends Peano> = LessThanPeano<
  N,
  P
> extends true
  ? Pos<SubtractPeano<P, N>>
  : Neg<SubtractPeano<N, P>>;

export type AddInt<A extends Int, B extends Int> = A extends ["Pos", infer A_]
  ? B extends ["Pos", infer B_]
    ? Pos<AddPeano<A_, B_>>
    : B extends ["Neg", infer B_]
    ? AddPosNeg<A_, B_>
    : never
  : A extends ["Neg", infer A_]
  ? B extends ["Pos", infer B_]
    ? AddPosNeg<B_, A_>
    : B extends ["Neg", infer B_]
    ? Neg<AddPeano<A_, B_>>
    : never
  : never;

export type SubtractInt<A extends Int, B extends Int> = B extends [
  "Pos",
  infer B_
]
  ? AddInt<A, Neg<B_>>
  : B extends ["Neg", infer B_]
  ? AddInt<A, Pos<B_>>
  : never;

export type MultiplyInt<A extends Int, B extends Int> = A extends [
  "Pos",
  infer A_
]
  ? B extends ["Pos", infer B_]
    ? Pos<MultiplyPeano<A_, B_>>
    : B extends ["Neg", infer B_]
    ? Neg<MultiplyPeano<A_, B_>>
    : never
  : A extends ["Neg", infer A_]
  ? B extends ["Pos", infer B_]
    ? Neg<MultiplyPeano<A_, B_>>
    : B extends ["Neg", infer B_]
    ? Pos<MultiplyPeano<A_, B_>>
    : never
  : never;

export type DivInt<A extends Int, B extends Int> = A extends ["Pos", infer A_]
  ? B extends ["Pos", infer B_]
    ? Pos<DivPeano<A_, B_>>
    : B extends ["Neg", infer B_]
    ? Neg<DivPeano<A_, B_>>
    : never
  : A extends ["Neg", infer A_]
  ? B extends ["Pos", infer B_]
    ? Neg<DivPeano<A_, B_>>
    : B extends ["Neg", infer B_]
    ? Pos<DivPeano<A_, B_>>
    : never
  : never;

export type LessThanInt<A extends Int, B extends Int> = A extends [
  "Pos",
  infer A_
]
  ? B extends ["Pos", infer B_]
    ? LessThanPeano<A_, B_>
    : B extends ["Neg", infer B_]
    ? false
    : never
  : A extends ["Neg", infer A_]
  ? B extends ["Pos", infer B_]
    ? true
    : B extends ["Neg", infer B_]
    ? LessThanPeano<B_, A_>
    : never
  : never;

export type Add<A extends number, B extends number> = FromInt<
  AddInt<ToInt<A>, ToInt<B>>
>;
export function add<A extends number, B extends number>(a: A, b: B): Add<A, B>;

export type Subtract<A extends number, B extends number> = FromInt<
  SubtractInt<ToInt<A>, ToInt<B>>
>;
export function subtract<A extends number, B extends number>(
  a: A,
  b: B
): Subtract<A, B>;

export type Multiply<A extends number, B extends number> = FromInt<
  MultiplyInt<ToInt<A>, ToInt<B>>
>;
export function multiply<A extends number, B extends number>(
  a: A,
  b: B
): Multiply<A, B>;

export type Div<A extends number, B extends number> = FromInt<
  DivInt<ToInt<A>, ToInt<B>>
>;
export function div<A extends number, B extends number>(a: A, b: B): Div<A, B>;

export type Equal<A, B> = A extends B ? true : false;
export function equal<A extends number, B extends number>(
  a: A,
  b: B
): Equal<A, B>;

export type LessThan<A extends number, B extends number> = A extends B
  ? false
  : LessThanInt<ToInt<A>, ToInt<B>>;
export function lessThan<A extends number, B extends number>(
  a: A,
  b: B
): LessThan<A, B>;

export type GreaterThan<A extends number, B extends number> = A extends B
  ? false
  : LessThanInt<ToInt<B>, ToInt<A>>;
export function greaterThan<A extends number, B extends number>(
  a: A,
  b: B
): GreaterThan<A, B>;

export type PeanoRange<
  Result extends Peano[],
  Length extends number
> = Result["length"] extends Length
  ? Result
  : Result extends [...infer _, infer L]
  ? PeanoRange<[...Result, Succ<L>], Length>
  : never;

export type FromPeanoRange<R extends Peano[]> = {
  [I in keyof R]: FromPeano<R[I]>;
};

export type Range<Bottom extends number, Top extends number> = FromPeanoRange<
  PeanoRange<[ToPeano<Bottom>], Subtract<Top, Bottom>>
>;
