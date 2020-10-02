// @format
import Axios from 'axios';
import UserAgent from 'user-agents';
import { map, compose, path, pathOr, evolve } from 'ramda';
import qs from 'qs';
// import delay from 'delay';

import { normalizeInsProfileData } from 'utils/instagram';

const userAgentFactory = new UserAgent({ deviceCategory: 'mobile' });
const userAgent = userAgentFactory.toString();

const baseURL = 'https://www.instagram.com';

const axios = Axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'User-Agent': userAgent,
    'Accept-Language': 'en-US',
    'X-Instagram-AJAX': 1,
    'X-Requested-With': 'XMLHttpRequest',
    Referer: baseURL,
  },
});

export const getProfile = async ({ csrftoken, retry = 0 }) => {
  try {
    axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
    const res = await axios.get('/accounts/edit/?__a=1');
    const formData = res.data?.form_data;
    const username = formData?.username;
    // if (!username && retry < 5) {
    //   console.log('hi')
    //   // await delay(1000);
    //   // console.log('retry', retry);
    //   return getProfile({ csrftoken, retry: retry + 1 });
    // }
    // console.log('formData', formData);
    // console.log('username', username);
    const user = await getUserByUsername({ username });
    const insData = {
      ...formData,
      ...user,
    };
    return normalizeInsProfileData(insData);
  } catch (e) {
    if (__DEV__) {
      console.log('getProfile error: ', e);
    }
  }
};

export const getUserByUsername = async ({ username }) => {
  try {
    const res = await axios.get(`/${username}/?__a=1`, {
      headers: {
        Referer: `${baseURL}/${username}/`,
      },
    });
    return res.data?.graphql?.user;
  } catch (e) {
    if (__DEV__) {
      console.log('getUserByUsername error: ', e);
    }
  }
};

export const checkBlockedById = async userId => {
  try {
    const res = await axios.get(`/api/v1/users/${userId}/info`, {
      baseURL: 'https://i.instagram.com',
      headers: {
        'User-Agent': 'Instagram 121.0.0.29.119',
      },
    });
    return res?.data?.user;
  } catch (e) {
    if (__DEV__) {
      console.log('checkBlockedById error: ', e);
    }
    throw e;
  }
};

export const search = async ({ query, context = 'blended' }) => {
  try {
    const res = await axios.get('/web/search/topsearch/', {
      withCredentials: false,
      params: {
        query,
        context,
      },
    });
    return res.data;
  } catch (e) {
    if (__DEV__) {
      console.log('search error: ', e);
    }
  }
};

const getFollowData = ({ fieldName, queryHash, variables }) =>
  axios
    .get('/graphql/query/', {
      params: {
        query_hash: queryHash,
        variables: JSON.stringify(variables),
      },
    })
    .then(res => res.data.data.user[fieldName])
    .then(({ count, page_info, edges }) => ({
      count,
      page_info,
      data: edges.map(edge => edge.node),
    }));

export const getFollowers = ({ userId, first = 20, after = '' }) =>
  getFollowData({
    fieldName: 'edge_followed_by',
    queryHash: '37479f2b8209594dde7facb0d904896a',
    variables: {
      id: userId,
      first,
      after,
    },
  });

export const getFollowings = ({ userId, first = 20, after = '' }) =>
  getFollowData({
    fieldName: 'edge_follow',
    queryHash: '58712303d941c6855d4e888c5f0cd22f',
    variables: {
      id: userId,
      first,
      after,
    },
  });

export const follow = userId => axios.post(`/web/friendships/${userId}/follow/`);

export const unfollow = userId => axios.post(`/web/friendships/${userId}/unfollow/`);

export const getStoryReelFeedViaWeb = async (onlyStories = true) => {
  const res = await axios.get('/graphql/query/', {
    params: {
      query_hash: '60b755363b5c230111347a7a4e242001',
      variables: JSON.stringify({
        only_stories: onlyStories,
      }),
    },
  });

  return compose(
    map(path(['node'])),
    pathOr([], ['data', 'data', 'user', 'feed_reels_tray', 'edge_reels_tray_to_reel', 'edges']),
  )(res);
};

export const getStoryDetails = async ({
  reelIds = [],
  tagNames = [],
  locationIds = [],
  precomposedOverlay = false,
}) => {
  const res = await axios.get('/graphql/query/', {
    params: {
      query_hash: '297c491471fff978fa2ab83c0673a618',
      variables: JSON.stringify({
        reel_ids: reelIds,
        tag_names: tagNames,
        location_ids: locationIds,
        precomposed_overlay: precomposedOverlay,
      }),
    },
  });

  return res?.data?.data.reels_media;
};

export const getStoryReelFeed = async () => {
  const res = await axios.get('/api/v1/feed/reels_tray/', {
    baseURL: 'https://i.instagram.com',
    headers: {
      'User-Agent': 'Instagram 121.0.0.29.119',
    },
  });

  return res.data;
};

export const getUserArchiveStories = async () => {
  const res = await axios.get('/api/v1/archive/reel/day_shells/', {
    baseURL: 'https://i.instagram.com',
    headers: {
      'User-Agent': 'Instagram 121.0.0.29.119',
    },
  });

  return res.data;
};

export const getStoryDetailById = async ids => {
  const res = await axios.get('/api/v1/feed/reels_media/', {
    baseURL: 'https://i.instagram.com',
    headers: {
      'User-Agent': 'Instagram 121.0.0.29.119',
    },
    params: {
      user_ids: ids,
    },
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
  });

  return res.data;
};

export const getChainsData = async userId => {
  const result = await axios.get('/graphql/query/', {
    params: {
      query_hash: '7c16654f22c819fb63d1183034a5162f',
      variables: JSON.stringify({
        user_id: userId,
        include_chaining: true,
        include_reel: false,
        include_suggested_users: false,
        include_logged_out_extras: false,
        include_highlight_reels: false,
      }),
    },
  });
  return compose(
    map(path(['node'])),
    pathOr([], ['data', 'data', 'user', 'edge_chaining', 'edges']),
  )(result);
};

export const getPosts = async ({ userId, perPage = 12, after = '' }) => {
  const res = await axios.get('/graphql/query/', {
    params: {
      query_hash: '42323d64886122307be10013ad2dcc44',
      variables: JSON.stringify({
        id: userId,
        first: perPage,
        after,
      }),
    },
  });
  return compose(
    evolve({
      edges: map(path(['node'])),
    }),
    path(['data', 'data', 'user', 'edge_owner_to_timeline_media']),
  )(res);
};
