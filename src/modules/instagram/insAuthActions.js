// @format

import { compose, when, path, concat, pluck } from 'ramda';

import makeActionCreator from 'actions/makeActionCreator';
import { insProfileIdSelector } from 'modules/instagram//selector';

export const RECEIVE_INS_COOKIES = 'RECEIVE_INS_COOKIES';
export const REQUEST_INS_COOKIES = 'REQUEST_INS_COOKIES';
export const REQUEST_INS_USER_PROFILE = 'REQUEST_INS_USER_PROFILE';
export const RECEIVE_INS_USER_PROFILE = 'RECEIVE_INS_USER_PROFILE';
export const REQUEST_INS_USER_FOLLOWER = 'REQUEST_INS_USER_FOLLOWER';
export const RECEIVE_INS_USER_FOLLOWER = 'RECEIVE_INS_USER_FOLLOWER';
export const REQUEST_INS_USER_FOLLOWING = 'REQUEST_INS_USER_FOLLOWING';
export const RECEIVE_INS_USER_FOLLOWING = 'RECEIVE_INS_USER_FOLLOWING';
export const REQUEST_FOLLOW_USER = 'REQUEST_FOLLOW_USER';
export const END_FOLLOW_USER = 'END_FOLLOW_USER';
export const REQUEST_UNFOLLOW_USER = 'REQUEST_UNFOLLOW_USER';
export const END_UNFOLLOW_USER = 'END_UNFOLLOW_USER';
export const REQUEST_CHECK_BLOCKER = 'REQUEST_CHECK_BLOCKER';
export const RECEIVE_CHECK_BLOCKER = 'RECEIVE_CHECK_BLOCKER';
export const REQUEST_STORY_FEED = 'REQUEST_STORY_FEED';
export const RECEIVE_STORY_FEED = 'RECEIVE_STORY_FEED';
export const REQUEST_USER_ARCHIVE_STORY = 'REQUEST_USER_ARCHIVE_STORY';
export const RECEIVE_USER_ARCHIVE_STORY = 'RECEIVE_USER_ARCHIVE_STORY';

export const receiveInsCookies = makeActionCreator(RECEIVE_INS_COOKIES, 'cookies');
export const requestInsCookies = makeActionCreator(REQUEST_INS_COOKIES);
export const requestInsProfile = makeActionCreator(REQUEST_INS_USER_PROFILE);
export const receiveInsProfile = makeActionCreator(RECEIVE_INS_USER_PROFILE, 'profile');
export const requestInsUserFollower = makeActionCreator(REQUEST_INS_USER_FOLLOWER);
export const receiveInsUserFollower = makeActionCreator(RECEIVE_INS_USER_FOLLOWER, 'followers');
export const requestInsUserFollowing = makeActionCreator(REQUEST_INS_USER_FOLLOWING);
export const receiveInsUserFollowing = makeActionCreator(RECEIVE_INS_USER_FOLLOWING, 'followings');
export const requestFollowUser = makeActionCreator(REQUEST_FOLLOW_USER, 'userId');
export const endFollowUser = makeActionCreator(END_FOLLOW_USER, 'userId');
export const requestUnFollowUSer = makeActionCreator(REQUEST_UNFOLLOW_USER, 'userId');
export const endUnFollowUser = makeActionCreator(END_UNFOLLOW_USER, 'userId');
export const requestCheckBlocker = makeActionCreator(REQUEST_CHECK_BLOCKER);
export const receiveCheckBlocker = makeActionCreator(RECEIVE_CHECK_BLOCKER, 'isBlocker', 'user');
export const requestStoryFeed = makeActionCreator(REQUEST_STORY_FEED);
export const receiveStoryFeed = makeActionCreator(RECEIVE_STORY_FEED, 'storyFeed');
export const requestUserArchiveStory = makeActionCreator(REQUEST_USER_ARCHIVE_STORY);
export const receiveUserArchiveStory = makeActionCreator(RECEIVE_USER_ARCHIVE_STORY, 'archives');

export const fetchInsUserProfileAction = () => async (dispatch, getState, { apis }) => {
  try {
    const state = getState();
    const csrftoken = state.instagram?.cookies?.csrftoken;
    if (!csrftoken) {
      // user not logged in
      return;
    }
    dispatch(requestInsProfile());
    const insProfile = await apis.instagram.getProfile({ csrftoken });
    dispatch(receiveInsProfile(insProfile));
    return insProfile;
  } catch (e) {
    dispatch(receiveInsProfile());
    if (__DEV__) {
      console.log('fetchInsUserProfileAction error: ', e);
    }
  }
};

export const fetchInsUserFollowing = (after = '') => async (dispatch, getState, { apis }) => {
  try {
    const userIgId = compose(insProfileIdSelector, getState)();
    dispatch(requestInsUserFollowing());
    const result = await apis.instagram.getFollowings({ userId: userIgId, after });
    dispatch(receiveInsUserFollowing(result));
    return result;
  } catch (e) {
    if (__DEV__) {
      console.log('fetchInsUserFollowing error', e, e.response);
    }
  }
};

export const fetchInsUserAllFollowing = (after = '') => async dispatch => {
  const result = await dispatch(fetchInsUserFollowing(after));
  when(
    path(['page_info', 'has_next_page']),
    compose(
      endCursor => dispatch(fetchInsUserAllFollowing(endCursor)),
      path(['page_info', 'end_cursor']),
    ),
  )(result);

  return result.count;
};

export const fetchInsUserFollower = (after = '') => async (dispatch, getState, { apis }) => {
  try {
    const userIgId = compose(insProfileIdSelector, getState)();
    const result = await apis.instagram.getFollowers({ userId: userIgId, after });
    // dispatch(receiveInsUserFollower(result));
    return result;
  } catch (e) {
    if (__DEV__) {
      console.log('fetchInsUserFollower  error', e, e.response);
    }
  }
};

export const recursiveFetchUserFollowers = (after = '') => async dispatch => {
  const result = await dispatch(fetchInsUserFollower(after));
  if (result?.page_info?.has_next_page) {
    const anotherResult = await dispatch(
      recursiveFetchUserFollowers(result?.page_info?.end_cursor),
    );
    return {
      ...result,
      ...anotherResult,
      data: concat(result?.data || [], anotherResult?.data || []),
    };
  }
  return result;
};

export const fetchInsUserAllFollower = () => async dispatch => {
  dispatch(requestInsUserFollower());
  const result = await dispatch(recursiveFetchUserFollowers());
  dispatch(receiveInsUserFollower(result));
  return result;
};

export const followUserAction = userId => async (dispatch, getState, { apis }) => {
  try {
    dispatch(requestFollowUser(userId));
    const result = await apis.instagram.follow(userId);
    dispatch(endFollowUser(userId));
    return result;
  } catch (e) {
    if (__DEV__) {
      console.log('follow user', userId, e, e.response);
    }
  }
};

export const unfollowUserAction = userId => async (dispatch, getState, { apis }) => {
  try {
    dispatch(requestUnFollowUSer(userId));
    const result = await apis.instagram.unfollow(userId);
    dispatch(endUnFollowUser(userId));
    return result;
  } catch (e) {
    if (__DEV__) {
      console.log('unfollow user', userId, e, e.response);
    }
  }
};

export const checkBlockerAction = user => async (dispatch, getState, { apis }) => {
  try {
    dispatch(requestCheckBlocker());
    await apis.instagram.checkBlockedById(user?.pk);
    dispatch(receiveCheckBlocker(false, user));
    return false;
  } catch (e) {
    dispatch(receiveCheckBlocker(true, user));
    if (__DEV__) {
      console.log('check blocker', user.pk, e);
    }
    return true;
  }
};

export const searchUserAction = username => async (dispatch, getState, { apis }) => {
  try {
    const result = await apis.instagram.search({ query: username });
    return result?.users || [];
  } catch (e) {
    if (__DEV__) {
      console.log('check user', username, e, e.response);
    }
  }
};

export const fetchUserStoriesFeed = () => async (dispatch, getState, { apis }) => {
  try {
    dispatch(requestStoryFeed());
    const result = await apis.instagram.getStoryReelFeedViaWeb();
    dispatch(receiveStoryFeed(result));
    return result;
  } catch (e) {
    if (__DEV__) {
      console.log('fetch story feed', e, e.response);
    }
  }
};

export const fetchUserArchiveStoryies = () => async (dispatch, getState, { apis }) => {
  try {
    dispatch(requestUserArchiveStory());
    const archives = await apis.instagram.getUserArchiveStories();
    const reelIds = compose(pluck('id'), path(['items']))(archives);
    const result = await apis.instagram.getStoryDetailById(reelIds);
    dispatch(receiveUserArchiveStory(result));
    return result;
  } catch (e) {
    if (__DEV__) {
      console.log('fetch story feed', e, e.response);
    }
  }
};
