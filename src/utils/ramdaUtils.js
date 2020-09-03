// @format
import {
  complement,
  anyPass,
  isNil,
  isEmpty,
  equals,
  addIndex,
  map,
  divide,
  __,
  useWith,
  unapply,
  identity,
  always,
  compose,
  cond,
  juxt,
  flip,
  T,
  ifElse,
  is,
  nth,
  apply,
} from 'ramda';

export const isExist = complement(anyPass([isNil, isEmpty]));
export const notEq = complement(equals);
export const mapIndexed = addIndex(map);
export const half = divide(__, 2);

const equalsAndAlways = useWith(unapply(identity), [equals, always]);

// toggle :: a -> b -> (* -> *)
export const toggle = compose(
  cond,
  juxt([equalsAndAlways, flip(equalsAndAlways), always([T, identity])]),
);

const _mayInvoke = ifElse(
  compose(
    is(Function),
    nth(0),
  ),
  compose(
    apply(__, undefined),
    nth(0),
  ),
  compose(
    apply(__, undefined),
    nth(1),
  ),
);

// mayInvoke :: (fn, defaultFn) -> fn() || defaultFn()
export const mayInvoke = unapply(_mayInvoke);
