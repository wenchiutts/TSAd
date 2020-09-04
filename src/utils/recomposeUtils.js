import { omit, compose, pick } from 'ramda';
import { mapProps } from 'recompose';

export const omitProps = compose(
  mapProps,
  omit,
);

export const pickProps = compose(
  mapProps,
  pick,
);
