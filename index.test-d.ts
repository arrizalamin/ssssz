import { add, div, greaterThan, lessThan, multiply, Range, subtract } from ".";

const expectType = <T>(t: T): void => {};

expectType<7>(add(3, 4));
// @ts-expect-error
expectType<10>(add(3, 4));
expectType<1>(add(-3, 4));
expectType<["Neg", 1]>(add(3, -4));
expectType<["Neg", 7]>(add(-3, -4));

expectType<["Neg", 1]>(subtract(3, 4));
expectType<["Neg", 7]>(subtract(-3, 4));
expectType<7>(subtract(3, -4));
expectType<1>(subtract(-3, -4));

expectType<12>(multiply(3, 4));
expectType<["Neg", 12]>(multiply(3, -4));
expectType<["Neg", 12]>(multiply(-3, 4));
expectType<12>(multiply(-3, -4));

expectType<2>(div(12, 5));
expectType<["Neg", 2]>(div(12, -5));
expectType<["Neg", 3]>(div(-12, 4));
expectType<3>(div(12, 4));

expectType<true>(lessThan(3, 4));
expectType<false>(lessThan(7, 4));

expectType<false>(greaterThan(3, 4));
expectType<true>(greaterThan(7, 4));

const isNumberInRange = <N extends Range<3, 7>[number]>(n: N): boolean =>
  n >= 3 && n < 7;
isNumberInRange(5);
// @ts-expect-error
isNumberInRange(9);
