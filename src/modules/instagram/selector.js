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
  pathOr,
  reduce,
  pluck,
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

export const blockersSelector = createSelector(instagramSelector, path(['blockers']));

export const storyFeedSelector = createSelector(
  instagramSelector,
  compose(pathOr([], ['storyFeed'])),
);

export const storyFeedListSelector = createSelector(
  storyFeedSelector,
  reduce(
    (acc, c) => ({
      ...acc,
      [c.id]: {
        idx: 0,
        id: c.id,
        items: [],
      },
    }),
    {},
  ),
);

export const storyFeedPositionSelector = createSelector(storyFeedSelector, pluck('id'));

const dataSelector = path(['data']);
const dataWithDefaultEmptyObjectSelector = compose(defaultTo({}), dataSelector);

const followersDataSelector = createSelector(
  insFollowersSelector,
  dataWithDefaultEmptyObjectSelector,
);

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
  compose(values, useWith(omit, [keys, dataWithDefaultEmptyObjectSelector])),
);

export const insFollowingsCountSelector = createSelector(
  insFollowingsSelector,
  compose(length, keys, dataWithDefaultEmptyObjectSelector),
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
  compose(values, useWith(pick, [keys, dataWithDefaultEmptyObjectSelector])),
);

export const mutualFollowingCountSelector = createSelector(
  mutualFollowingSelector,
  compose(length, keys),
);

export const unFollowersSelector = createSelector(instagramSelector, path(['unFollowers']));

const unFollowersDataSelector = createSelector(
  unFollowersSelector,
  dataWithDefaultEmptyObjectSelector,
);

export const newFollowersSelector = createSelector(
  followersDataSelector,
  filter(compose(gt(__, new Date().setHours(0, 0, 0, 0)), path(['createdAt']))),
);

export const newFollowersCountSelector = createSelector(
  newFollowersSelector,
  compose(length, keys),
);

export const newFollowersWithProfileSelector = createSelector(newFollowersSelector, values);

export const newUnFollowersSelector = createSelector(
  unFollowersDataSelector,
  filter(compose(gt(__, new Date().setHours(0, 0, 0, 0)), path(['updatedAt']))),
);

export const unFollowersCountSelector = createSelector(
  newUnFollowersSelector,
  compose(length, keys),
);

export const unFollowersWithProfileSelector = createSelector(newUnFollowersSelector, values);

export const blockerDataSelector = createSelector(blockersSelector, values);

export const blockerCountSelector = createSelector(blockerDataSelector, length);
