// @format
import createReducers from 'reducers/createReducers';
import {
  evolve,
  path,
  over,
  lensPath,
  compose,
  always,
  add,
  subtract,
  reduce,
  applySpec,
  converge,
  omit,
  keys,
  map,
  mergeLeft,
  has,
  mergeDeepLeft,
  assoc,
  ifElse,
  length,
  or,
  objOf,
  __,
} from 'ramda';

import {
  RECEIVE_INS_COOKIES,
  REQUEST_INS_COOKIES,
  REQUEST_INS_USER_PROFILE,
  RECEIVE_INS_USER_PROFILE,
  REQUEST_INS_USER_FOLLOWER,
  RECEIVE_INS_USER_FOLLOWER,
  REQUEST_INS_USER_FOLLOWING,
  RECEIVE_INS_USER_FOLLOWING,
  REQUEST_FOLLOW_USER,
  END_FOLLOW_USER,
  REQUEST_UNFOLLOW_USER,
  END_UNFOLLOW_USER,
} from 'modules/instagram/insAuthActions';
import { objFromListWith } from 'utils/ramdaUtils';

const initialState = {
  cookies: undefined,
  profile: undefined,
  followings: undefined,
  followers: undefined,
  unFollowers: undefined,
  isFetching: false,
  isFetchingFollowers: false,
  isFetchingFollowings: false,
  isPostingFollowUser: false,
  isPostingUnFollowUser: false,
  followersTimeStamp: {},
  unFollowersTimeStamp: {},
};

// const dataSelector = path(['data']);
// const followingsSelector = path(['followings']);
// const followersSelector = path(['followers']);
const updateFollowedByUser = (userId, tof) =>
  evolve({ [userId]: { profile: { followed_by_viewer: always(tof) } } });

const getUpdateuserObject = userId =>
  compose(
    objOf(userId),
    converge(or, [
      path(['followers', 'data', userId, 'profile']),
      path(['unFollowers', 'data', userId, 'profile']),
    ]),
  );

export default createReducers(initialState, {
  [RECEIVE_INS_COOKIES]: (state, actions) => ({
    ...state,
    cookies: actions.cookies,
    isFetching: false,
  }),
  [REQUEST_INS_COOKIES]: (state, actions) => ({
    ...state,
    cookies: undefined,
    isFetching: true,
  }),
  [REQUEST_INS_USER_PROFILE]: (state, actions) => ({
    ...state,
    isFetching: true,
  }),
  [RECEIVE_INS_USER_PROFILE]: (state, actions) => ({
    ...state,
    isFetching: false,
    profile: actions.profile,
  }),
  [REQUEST_INS_USER_FOLLOWER]: (state, actions) => ({
    ...state,
    isFetchingFollowers: true,
  }),
  [RECEIVE_INS_USER_FOLLOWER]: (state, actions) => {
    const currentTime = Date.now();
    const analyze = compose(
      applySpec({
        followersTimeStamp: converge(omit, [
          compose(keys, path(['unFollowersTimeStamp'])),
          path(['followersTimeStamp']),
        ]),
        unFollowersTimeStamp: converge(mergeLeft, [
          compose(map(mergeLeft({ updatedAt: currentTime })), path(['unFollowersTimeStamp'])),
          path(['ogUnFollowersTimeStamp']),
        ]),
      }),
      reduce(
        (a, c) =>
          evolve({
            followersTimeStamp: ifElse(
              has(c.id),
              mergeDeepLeft({
                [c.id]: { updatedAt: currentTime, profile: c },
              }),
              assoc(c.id, {
                createdAt: currentTime,
                updatedAt: currentTime,
                profile: c,
              }),
            ),
            unFollowersTimeStamp: omit([c.id]),
            ogUnFollowersTimeStamp: omit([c.id]),
          })(a),
        {
          followersTimeStamp: state?.followers?.data || {},
          unFollowersTimeStamp: state?.followers?.data || {},
          ogUnFollowersTimeStamp: state?.unFollowers?.data || {},
        },
      ),
    )(actions.followers.data);
    return {
      ...state,
      isFetchingFollowings: false,
      followers: {
        count: actions.followers.count,
        page_info: actions.followers.page_info,
        data: analyze.followersTimeStamp,
      },
      unFollowers: {
        count: compose(length, keys)(analyze.unFollowersTimeStamp),
        data: analyze.unFollowersTimeStamp,
      },
      ...analyze,
    };
  },
  [REQUEST_INS_USER_FOLLOWING]: (state, actions) => ({
    ...state,
    isFetchingFollowings: true,
  }),
  [RECEIVE_INS_USER_FOLLOWING]: (state, actions) => ({
    ...state,
    isFetchingFollowings: false,
    followings: evolve({
      data: objFromListWith(path(['id'])),
    })(actions.followings),
  }),
  [REQUEST_FOLLOW_USER]: (state, actions) => ({
    ...state,
    isPostingFollowUser: true,
  }),
  [END_FOLLOW_USER]: (state, actions) => {
    const userId = path(['userId'], actions);
    // update target user's followed_by_viewer in followers/unFollowers
    // and add this user to following list
    const lensFollowers = lensPath(['followers', 'data']);
    const lensUnFollowers = lensPath(['unFollowers'], 'data');
    const lensFollowing = lensPath(['followings']);
    const result = compose(
      data =>
        over(
          lensFollowing,
          evolve({
            count: add(1),
            data: mergeLeft(getUpdateuserObject(userId)(data)),
          }),
          data,
        ),
      over(lensFollowers, updateFollowedByUser(userId, true)),
      over(lensUnFollowers, updateFollowedByUser(userId, true)),
    )(state);

    return {
      ...state,
      ...result,
      isPostingFollowUser: false,
    };
  },
  [REQUEST_UNFOLLOW_USER]: (state, actions) => ({
    ...state,
    isPostingUnFollowUser: true,
  }),
  [END_UNFOLLOW_USER]: (state, actions) => {
    const userId = path(['userId'], actions);
    const lensFollowers = lensPath(['followers', 'data']);
    const lensUnFollowers = lensPath(['unFollowers'], 'data');
    const lensFollowing = lensPath(['followings']);
    const result = compose(
      over(
        lensFollowing,
        evolve({
          count: subtract(__, 1),
          data: omit([userId]),
        }),
      ),
      over(lensFollowers, updateFollowedByUser(userId, false)),
      over(lensUnFollowers, updateFollowedByUser(userId, false)),
    )(state);

    return {
      ...state,
      ...result,
      isPostingUnFollowUser: false,
    };
  },
});
