// @format
/* eslint-disable react-hooks/rules-of-hooks */
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
  curry,
  chain,
  zipObj,
  when,
  path,
  dissocPath,
} from 'ramda';

export const isNilOrEmpty = anyPass([isNil, isEmpty]);
export const isExist = complement(isNilOrEmpty);
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
  compose(is(Function), nth(0)),
  compose(apply(__, undefined), nth(0)),
  compose(apply(__, undefined), nth(1)),
);

// mayInvoke :: (fn, defaultFn) -> fn() || defaultFn()
export const mayInvoke = unapply(_mayInvoke);

export const objFromListWith = curry((fn, list) => chain(zipObj, map(fn))(list));

export const dissocPathIfNilOrEmpty = curry((array, data) =>
  when(compose(isNilOrEmpty, path(array)), dissocPath(array))(data),
);
