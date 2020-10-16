// @format
/* eslint-disable react-hooks/rules-of-hooks */
import dayjs from 'dayjs';
import {
  objOf,
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
  descend,
  prop,
  sort,
  ascend,
  converge,
  applySpec,
  identity,
  always,
  mergeDeepWithKey,
  concat,
  add,
  flatten,
  partition,
  head,
  last,
} from 'ramda';
// import DEBUG from 'utils/logUtils';
import { createSelector } from 'reselect';
import { isExist, lookup } from 'utils/ramdaUtils';
import { isExistUnSeenStory } from 'utils/instagram';

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

export const insUsernameSelector = createSelector(insProfileSelector, path(['username']));

export const insFollowingsSelector = createSelector(instagramSelector, path(['followings']));

export const insFollowersSelector = createSelector(instagramSelector, path(['followers']));

export const blockersSelector = createSelector(instagramSelector, path(['blockers']));

const byRankedPosition = ascend(path(['ranked_position']));
const bySeenRandedPosition = ascend(path(['seen_ranked_position']));
const splitStoryToSeenUnSeenPair = partition(
  isExistUnSeenStory(path(['seen']), path(['latest_reel_media'])),
);
const concatSeenUnSeenListAndSortByPosition = converge(concat, [
  compose(sort(byRankedPosition), head),
  compose(sort(bySeenRandedPosition), last),
]);

export const storyFeedSelector = createSelector(
  instagramSelector,
  compose(
    concatSeenUnSeenListAndSortByPosition,
    splitStoryToSeenUnSeenPair,
    values,
    pathOr({}, ['storyFeedObj']),
  ),
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

export const followersDataSelector = createSelector(
  insFollowersSelector,
  dataWithDefaultEmptyObjectSelector,
);

export const followingsDataSelector = createSelector(
  insFollowingsSelector,
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

export const archivesSelector = createSelector(instagramSelector, pathOr({}, ['archives']));

const byTakenAt = descend(prop('taken_at'));

export const archivesListSelector = createSelector(
  archivesSelector,
  compose(sort(byTakenAt), flatten, values, pluck('items')),
);

const byTotalViewCountDesc = descend(path(['total_viewer_count']));
const byTotalViewCountAsc = ascend(path(['total_viewer_count']));

export const mostViewedArchivesListSelector = createSelector(
  archivesListSelector,
  sort(byTotalViewCountDesc),
);

export const leastViewedArchivesListSelector = createSelector(
  archivesListSelector,
  sort(byTotalViewCountAsc),
);

export const archivesUserViewSelector = createSelector(
  archivesListSelector,
  followersDataSelector,
  followingsDataSelector,
  (list, followers, followings) => {
    const lookupFollowers = lookup(followers);
    const lookupFollowings = lookup(followings);
    const result = reduce((acc, c) => {
      const user = compose(
        reduce(
          (userAcc, userC) =>
            compose(
              mergeDeepWithKey(
                (k, l, r) => {
                  if (k === 'viewedStory') {
                    return concat(l, r);
                  } else if (k === 'count') {
                    return add(l, r);
                  }
                  return r;
                },
                __,
                userAcc,
              ),
              converge(objOf, [
                path(['pk']),
                applySpec({
                  user: identity,
                  viewedStory: always([c.id]),
                  count: always(1),
                  isFollowing: compose(isExist, lookupFollowings, String, path(['pk'])),
                  isFollower: compose(isExist, lookupFollowers, String, path(['pk'])),
                }),
              ]),
            )(userC),
          {},
        ),
        path(['viewers']),
      )(c);
      return mergeDeepWithKey(
        (k, l, r) => {
          if (k === 'viewedStory') {
            return concat(l, r);
          } else if (k === 'count') {
            return add(l, r);
          }
          return r;
        },
        user,
        acc,
      );
    }, {})(list);
    return result;
  },
);

export const archivesUserViewListSelector = createSelector(archivesUserViewSelector, values);

const byViewedCountDesc = descend(path(['count']));
const byViewedCountAsc = ascend(path(['count']));

export const archivesTopViewerListSelector = createSelector(
  archivesUserViewListSelector,
  sort(byViewedCountDesc),
);

export const archivesLeastViewerListSelector = createSelector(
  archivesUserViewListSelector,
  sort(byViewedCountAsc),
);

export const recentStoriesListSelector = createSelector(
  archivesListSelector,
  filter(compose(gt(__, dayjs().subtract(2, 'd').unix()), path(['taken_at']))),
);

export const recentStoriesListCountSelector = createSelector(recentStoriesListSelector, length);

export const storyViewersSelector = createSelector(instagramSelector, path(['viewers']));

export const storyViewersByStoryIdSelector = createSelector(
  storyViewersSelector,
  (__, storyId) => storyId,
  (stories, storyId) => path([storyId], stories),
);

export const storyViewersListByStoryIdSelector = createSelector(
  storyViewersByStoryIdSelector,
  compose(values, path(['users'])),
);

export const postsSelector = createSelector(instagramSelector, path(['posts']));
export const postsPageInfoSelector = createSelector(postsSelector, path(['page_info']));

export const postsListSelector = createSelector(postsSelector, compose(values, path(['edges'])));
export const postsDataLengthSelector = createSelector(postsListSelector, length);

const byPopularityDesc = descend(path(['popularity']));
const byLikedCount = descend(path(['edge_media_preview_like', 'count']));
const byCommentCount = descend(path(['edge_media_to_comment', 'count']));

export const postsByPopularitySelector = createSelector(postsListSelector, sort(byPopularityDesc));

export const postByLikedCountSelector = createSelector(postsListSelector, sort(byLikedCount));

export const postByCommentCountSelector = createSelector(postsListSelector, sort(byCommentCount));

export const recentPostDetailSelector = createSelector(
  instagramSelector,
  path(['recentPostDetail']),
);

export const recentPostKeysSelector = createSelector(recentPostDetailSelector, keys);

const reduceToUserObj = (
  postKey,
  ownerIdSelector,
  userListSelector,
  userObjSelector,
  postIdSelector,
  followers,
) =>
  reduce((acc, c) => {
    const user = compose(
      reduce(
        (userAcc, userC) =>
          compose(
            mergeDeepWithKey(
              (k, l, r) => {
                if (k === postKey) {
                  return concat(l, r);
                } else if (k === 'count' || k === `${postKey}Count`) {
                  return add(l, r);
                }
                return r;
              },
              __,
              userAcc,
            ),
            converge(objOf, [
              ownerIdSelector,
              applySpec({
                owner: userObjSelector,
                [postKey]: always([postIdSelector(c)]),
                count: always(1),
                [`${postKey}Count`]: always(1),
                isFollower: compose(isExist, lookup(followers), String, ownerIdSelector),
                isFollowing: compose(path(['followed_by_viewer']), userObjSelector),
              }),
            ]),
          )(userC),
        {},
      ),
      userListSelector,
    )(c);

    return mergeDeepWithKey(
      (k, l, r) => {
        if (k === postKey) {
          return concat(l, r);
        } else if (k === 'count' || k === `${postKey}Count`) {
          return add(l, r);
        }
        return r;
      },
      user,
      acc,
    );
  }, {});

export const recentPostCommenterSelector = createSelector(
  recentPostDetailSelector,
  followersDataSelector,
  (data, followers) =>
    compose(
      reduceToUserObj(
        'commentOn',
        path(['owner', 'id']),
        path(['edges']),
        path(['owner']),
        path(['id']),
        followers,
      ),
      values,
    )(data),
);

export const recentPostLikersSelector = createSelector(
  instagramSelector,
  followersDataSelector,
  (data, followers) =>
    compose(
      reduceToUserObj(
        'likeOn',
        path(['id']),
        path(['edge_liked_by', 'edges']),
        identity,
        path(['shortcode']),
        followers,
      ),
      values,
      path(['recentPostLikers']),
    )(data),
);

const byCount = descend(prop('count'));

export const bestFollowerSelector = createSelector(
  recentPostCommenterSelector,
  recentPostLikersSelector,
  (commenters, likers) =>
    compose(
      mergeDeepWithKey((k, l, r) => {
        if (k === 'count') {
          return add(l, r);
        }
        return r;
      }),
    )(commenters, likers),
);

export const recentPostCommenterDataSelector = createSelector(
  recentPostCommenterSelector,
  compose(sort(byCount), values),
);

export const recentPostLikersDataSelector = createSelector(
  recentPostLikersSelector,
  compose(sort(byCount), values),
);

export const bestFollowerListSelector = createSelector(
  bestFollowerSelector,
  compose(sort(byCount), values),
);

export const bestFollowerListCountSelector = createSelector(bestFollowerListSelector, length);

export const ghostFollowerSelector = createSelector(
  bestFollowerSelector,
  followersDataSelector,
  (best, followers) =>
    compose(
      values,
      converge(omit, [compose(keys, path(['best'])), path(['followers'])]),
    )({ best, followers }),
);

export const ghostFollowerCountSelector = createSelector(ghostFollowerSelector, length);
