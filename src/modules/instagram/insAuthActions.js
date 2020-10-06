// @format
import { compose, when, path, concat, gt, filter, prop, map, into, __, allPass, lte } from 'ramda';
import dayjs from 'dayjs';

import makeActionCreator from 'actions/makeActionCreator';
import {
  insProfileIdSelector,
  postsDataLengthSelector,
  insUsernameSelector,
} from 'modules/instagram/selector';
import DEBUG from 'utils/logUtils';
import { isExist } from 'utils/ramdaUtils';

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
export const REQUEST_STORY_VIEWER = 'REQUEST_STORY_VIEWER';
export const RECEIVE_STORY_VIEWER = 'RECEIVE_STORY_VIEWER';
export const REQUEST_USER_POSTS = 'REQUEST_USER_POSTS';
export const RECEIVE_USER_POSTS = 'RECEIVE_USER_POSTS';

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
export const requestStoryViewer = makeActionCreator(REQUEST_STORY_VIEWER);
export const receiveStoryViewer = makeActionCreator(RECEIVE_STORY_VIEWER, 'storyId', 'viewers');
export const requestUserPosts = makeActionCreator(REQUEST_USER_POSTS);
export const receiveUserPosts = makeActionCreator(RECEIVE_USER_POSTS, 'posts');

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
      console.log('fetchInsUserProfileAction error: ', e, e.response);
    }
  }
};

export const fetchInsUserFollowing = (after = '') => async (dispatch, getState, { apis }) => {
  const state = getState();
  try {
    const userIgId = insProfileIdSelector(state);
    const username = insUsernameSelector(state);
    dispatch(requestInsUserFollowing());
    const result = await apis.instagram.getFollowings({ userId: userIgId, after, username });
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
      endCursor => setTimeout(() => dispatch(fetchInsUserAllFollowing(endCursor)), 2500),
      path(['page_info', 'end_cursor']),
    ),
  )(result);

  return result?.count;
};

export const fetchInsUserFollower = (after = '') => async (dispatch, getState, { apis }) => {
  const state = getState();
  try {
    const userIgId = insProfileIdSelector(state);
    const username = insUsernameSelector(state);
    const result = await apis.instagram.getFollowers({ userId: userIgId, after, username });
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

export const searchUserAction = (username, includeReel, withCredentials) => async (
  dispatch,
  getState,
  { apis },
) => {
  try {
    const result = await apis.instagram.search({ query: username, includeReel, withCredentials });
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
    const reelIds = compose(
      into(
        [],
        compose(
          filter(compose(gt(__, dayjs().subtract(2, 'day').unix()), path(['timestamp']))),
          map(prop('id')),
        ),
      ),
      path(['items']),
    )(archives);
    if (isExist(reelIds)) {
      const result = await apis.instagram.getStoryDetailById(reelIds);
      dispatch(receiveUserArchiveStory(result));
      return result;
    }
    return [];
  } catch (e) {
    if (__DEV__) {
      console.log('fetch story feed', e, e.response);
    }
  }
};

export const fetchReelsMediaViewer = (id, max_id = 0) => async (dispatch, getState, { apis }) => {
  try {
    dispatch(requestStoryViewer());
    const result = await apis.instagram.getReelsMediaViewer(id, max_id);
    dispatch(receiveStoryViewer(id, result));
    // users, next_max_id, total_viewer_count
    if (isExist(result?.next_max_id)) {
      await dispatch(fetchReelsMediaViewer(id, result?.next_max_id));
    }
    return result?.total_viewer_count;
  } catch (e) {
    DEBUG.log('fetchReelsMediaViewer error', e, e.response);
  }
};

export const fetchUserPosts = (after = '') => async (dispatch, getState, { apis }) => {
  try {
    const userIgId = compose(insProfileIdSelector, getState)();
    dispatch(requestUserPosts());
    const posts = await apis.instagram.getPosts({ userId: userIgId, after });
    dispatch(receiveUserPosts(posts));
    return posts;
  } catch (e) {
    DEBUG.log('fetch user posts error', e, e.response);
  }
};

export const fetchAllUserPosts = (after = '') => async (dispatch, getState) => {
  const state = getState();
  const currentPostsLength = postsDataLengthSelector(state);
  const result = await dispatch(fetchUserPosts(after));
  when(
    allPass([
      path(['page_info', 'has_next_page']),
      compose(lte(currentPostsLength), path(['count'])),
    ]),
    compose(
      endCursor => setTimeout(() => dispatch(fetchAllUserPosts(endCursor)), 3000),
      path(['page_info', 'end_cursor']),
    ),
  )(result);
  return result?.count;
};
