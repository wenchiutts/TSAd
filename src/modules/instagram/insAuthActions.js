// @format

import makeActionCreator from 'actions/makeActionCreator';

export const RECEIVE_INS_COOKIES = 'RECEIVE_INS_COOKIES';
export const REQUEST_INS_COOKIES = 'REQUEST_INS_COOKIES';
export const REQUEST_INS_USER_PROFILE = 'REQUEST_INS_USER_PROFILE';
export const RECEIVE_INS_USER_PROFILE = 'RECEIVE_INS_USER_PROFILE';

export const receiveInsCookies = makeActionCreator(RECEIVE_INS_COOKIES, 'cookies');
export const requestInsCookies = makeActionCreator(REQUEST_INS_COOKIES);
export const requestInsProfile = makeActionCreator(REQUEST_INS_USER_PROFILE);
export const receiveInsProfile = makeActionCreator(RECEIVE_INS_USER_PROFILE, 'profile');

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
