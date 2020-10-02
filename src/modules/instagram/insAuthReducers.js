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
  mergeRight,
  pick,
  mergeDeepWithKey,
  identity,
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
  REQUEST_CHECK_BLOCKER,
  RECEIVE_CHECK_BLOCKER,
  REQUEST_STORY_FEED,
  RECEIVE_STORY_FEED,
  REQUEST_USER_ARCHIVE_STORY,
  RECEIVE_USER_ARCHIVE_STORY,
  REQUEST_USER_POSTS,
  RECEIVE_USER_POSTS,
} from 'modules/instagram/insAuthActions';
import { objFromListWith, dissocPathIfNilOrEmpty } from 'utils/ramdaUtils';
import {} from './insAuthActions';

const initialState = {
  cookies: undefined,
  profile: undefined,
  followings: undefined,
  followers: undefined,
  unFollowers: undefined,
  blockers: undefined,
  isFetching: false,
  isFetchingFollowers: false,
  isFetchingFollowings: false,
  isFetchingUserPosts: false,
  isPostingFollowUser: false,
  isPostingUnFollowUser: false,
  isCheckingBlocker: false,
  isFetchingStoryReels: false,
  isFetchingArchives: false,
  followersTimeStamp: {},
  unFollowersTimeStamp: {},
  storyFeed: undefined,
  storyArchvies: {},
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
      data: compose(mergeRight(state?.followings?.data || {}), objFromListWith(path(['id']))),
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
  [REQUEST_CHECK_BLOCKER]: (state, actions) => ({
    ...state,
    isCheckingBlocker: true,
  }),
  [RECEIVE_CHECK_BLOCKER]: (state, actions) => {
    const current = Date.now();
    const lensBlocker = lensPath(['blockers']);
    const user = {
      ...actions.user,
      id: actions.user.pk,
    };
    const result = over(
      lensBlocker,
      ifElse(
        always(actions.isBlocker),
        ifElse(
          has(user.id),
          mergeDeepLeft({
            [user.id]: { updatedAt: current, profile: user },
          }),
          assoc(user.id, {
            createdAt: current,
            updatedAt: current,
            profile: user,
          }),
        ),
        omit([user.id]),
      ),
      state,
    );

    return {
      ...result,
      isCheckingBlocker: false,
    };
  },
  [REQUEST_STORY_FEED]: (state, actions) => ({
    ...state,
    isFetchingStoryReels: true,
  }),
  [RECEIVE_STORY_FEED]: (state, actions) => ({
    ...state,
    isFetchingStoryReels: false,
    storyFeed: actions.storyFeed,
  }),
  [REQUEST_USER_ARCHIVE_STORY]: (state, actions) => ({
    ...state,
    isFetchingArchives: true,
  }),
  [RECEIVE_USER_ARCHIVE_STORY]: (state, actions) => ({
    ...state,
    archives: compose(
      mergeDeepWithKey((k, l, r) => {
        if (k === 'items') {
          const newRight = compose(
            dissocPathIfNilOrEmpty([0, 'viewer_count']),
            dissocPathIfNilOrEmpty([0, 'viewers']),
            dissocPathIfNilOrEmpty([0, 'total_viewer_count']),
          )(r);
          return [mergeRight(l[0], newRight[0])];
        }
        return r;
      })(state.archives),
      map(pick(['id', 'user', 'items', 'created_at'])),
      path(['reels']),
    )(actions.archives),
  }),
  [REQUEST_USER_POSTS]: (state, actions) => ({
    ...state,
    isFetchingUserPosts: true,
  }),
  [RECEIVE_USER_POSTS]: (state, actions) => ({
    ...state,
    isFetchingUserPosts: false,
    posts: evolve({
      edges: compose(
        mergeRight(state?.posts?.edges || {}),
        map(
          converge(mergeRight, [
            identity,
            applySpec({
              popularity: converge(add, [
                path(['edge_media_to_comment', 'count']),
                path(['edge_media_preview_like', 'count']),
              ]),
            }),
          ]),
        ),
        objFromListWith(path(['id'])),
      ),
    })(actions.posts),
  }),
});
