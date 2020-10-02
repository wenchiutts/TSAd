// @format@format
import { compose, apply, map, unapply, ifElse, always, F } from 'ramda';
import prettyFormat from 'pretty-format';

const prettyConsole = method =>
  unapply(compose(ifElse(always(__DEV__), compose(apply(console[method]), map(prettyFormat)), F)));

/*
 * usage: prettiery the consoloe log and won't only in DEV env
 * import DEBUG from 'utils/logUtils';
 * ...
 * switch console.log to DEBUG.log
 * that's it
 */
export default {
  log: prettyConsole('log'),
  warn: prettyConsole('warn'),
  error: prettyConsole('error'),
};
