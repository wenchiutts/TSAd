// @format
/* eslint-disable react-hooks/rules-of-hooks */
import {
  path,
  compose,
  filter,
  not,
  defaultTo,
  length,
  useWith,
  omit,
  pick,
  keys,
  gt,
  values,
  into,
  map,
  __,
} from 'ramda';
import { createSelector } from 'reselect';

const instagramSelector = path(['instagram']);

export const isFetchingInstagramSelector = createSelector(instagramSelector, path(['isFetching']));

export const insCookieSelector = createSelector(instagramSelector, path(['cookies']));

export const insProfileSelector = createSelector(instagramSelector, path(['profile']));

// export const insFollowingCountSelector = createSelector(
//   insProfileSelector,
//   path(['followingCount']),
// );

// export const insFollowerCountSelector = createSelector(insProfileSelector, path(['followerCount']));

export const insPostCountSelector = createSelector(insProfileSelector, path(['postCount']));

export const insProfilePictureSelector = createSelector(insProfileSelector, path(['profilePicHd']));

export const insProfileIdSelector = createSelector(insProfileSelector, path(['id']));

export const insFollowingsSelector = createSelector(instagramSelector, path(['followings']));

export const insFollowersSelector = createSelector(instagramSelector, path(['followers']));

const dataSelector = path(['data']);

const followersDataSelector = createSelector(insFollowersSelector, dataSelector);

export const imNotFollowingBackSelector = createSelector(
  followersDataSelector,
  compose(
    into([], compose(map(path(['profile'])), filter(compose(not, path(['followed_by_viewer']))))),
    values,
  ),
);

export const imNotFollowingBackCountSelector = createSelector(
  imNotFollowingBackSelector,
  compose(length, defaultTo([])),
);

export const notFollowingMeBackSelector = createSelector(
  followersDataSelector,
  insFollowingsSelector,
  compose(
    values,
    useWith((ids, list) => omit(ids, list), [keys, dataSelector]),
  ),
);

export const insFollowingsCountSelector = createSelector(
  insFollowingsSelector,
  compose(length, keys, dataSelector),
);

export const insFollowersCountSelector = createSelector(
  followersDataSelector,
  compose(length, keys),
);

export const notFollowingMeBackCountSelector = createSelector(
  notFollowingMeBackSelector,
  compose(length, keys),
);

export const mutualFollowingSelector = createSelector(
  followersDataSelector,
  insFollowingsSelector,
  compose(
    values,
    useWith((ids, list) => pick(ids, list), [keys, dataSelector]),
  ),
);

export const mutualFollowingCountSelector = createSelector(
  mutualFollowingSelector,
  compose(length, keys),
);

export const unFollowersSelector = createSelector(instagramSelector, path(['unFollowers']));

const unFollowersDataSelector = createSelector(unFollowersSelector, dataSelector);

export const newFollowersSelector = createSelector(
  followersDataSelector,
  filter(compose(gt(__, new Date().setHours(0, 0, 0, 0)), path(['createTimeStamp']))),
);

export const newFollowersCountSelector = createSelector(
  newFollowersSelector,
  compose(length, keys),
);

export const newFollowersWithProfileSelector = createSelector(newFollowersSelector, values);

export const newUnFollowersSelector = createSelector(
  unFollowersDataSelector,
  filter(compose(gt(__, new Date().setHours(0, 0, 0, 0)), path(['updateTimeStamp']))),
);

export const unFollowersCountSelector = createSelector(
  newUnFollowersSelector,
  compose(length, keys),
);

export const unFollowersWithProfileSelector = createSelector(newUnFollowersSelector, values);
