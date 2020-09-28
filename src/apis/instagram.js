// @format
import Axios from 'axios';
import UserAgent from 'user-agents';
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
        'User-Agent': 'Instagram 60.0.0.12.96 ',
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
