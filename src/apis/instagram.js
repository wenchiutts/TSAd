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
