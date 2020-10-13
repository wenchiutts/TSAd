import makeActionCreator from 'actions/makeActionCreator';
import { PRODUCTS_IDS, PRODUCT_PLAN_TYPE_MAP, IAP_PRODUCTS } from 'constants/Products';
import { getCountryCode } from 'utils/location';

import {
  insFollowersCountSelector,
  insFollowingsCountSelector,
  insProfilePictureSelector,
  insUsernameSelector,
} from 'modules/instagram/selector';

export const UPDATE_PREMIUM = 'UPDATE_PREMIUM';
export const updatePremium = makeActionCreator('UPDATE_PREMIUM', 'purchase');

export const RECEIVE_USER_PROFILE = 'RECEIVE_USER_PROFILE';
export const receiveUserProfile = makeActionCreator('RECEIVE_USER_PROFILE', 'profile');

export const purchaseSubscriptionAction = ({ purchaseTime, productId }) => async (
  dispatch,
  getState,
  { apis },
) => {
  try {
    const state = getState();
    const newUserInfo = {
      ...state?.user,
      followerCount: insFollowersCountSelector(state),
      followingCount: insFollowingsCountSelector(state),
      profilePicHd: insProfilePictureSelector(state),
      username: insUsernameSelector(state),
    };

    if (state.user.premium?.status === 'inactive' || state.user.premium?.status === 'expired') {
      dispatch(
        updatePremium({
          status: 'active',
          productId,
          lastUpdatedAt: purchaseTime,
        }),
      );
      apis.slack.newPurchase({
        ...newUserInfo,
        productId,
      });
      apis.firebase.logEvent({ name: 'newPurchase' });

      // Todo: Update user FireStore record, save the the whole premium structure
    } else {
      console.log('subscription is still active');
    }
  } catch (e) {
    console.log('purchaseStarsAction error: ', e);
  }
};

export const checkSubscriptionStatus = () => async (dispatch, getState, { apis }) => {
  // Check if subscription expired
  const state = getState();
  const premium = state?.user?.premium;
  if (premium?.status !== 'active') {
    return;
  }
  const purchaseHistory = state?.payment?.history;
  const latestPurchase = purchaseHistory.sort((a, b) => b?.purchaseTime - a?.purchaseTime)?.[0];

  if (latestPurchase) {
    const { purchaseTime, productId } = latestPurchase;
    const periodDays = IAP_PRODUCTS[productId];
    const currentTime = new Date().getTime();
    const dateDifference = Math.floor((currentTime - purchaseTime) / (1000 * 60 * 60 * 24));
    if (dateDifference > periodDays) {
      dispatch(
        updatePremium({
          status: 'expired',
          productId,
          lastUpdatedAt: new Date().getTime(),
        }),
      );
    }
    return;
  }
  if (premium?.status === 'active') {
    dispatch(
      updatePremium({
        status: 'expired',
        productId: null,
        lastUpdatedAt: new Date().getTime(),
      }),
    );
    // Todo: Update user FireStore record, save the the whole premium structure
  }
};

export const updateUserProfile = user => async (dispatch, getState, { apis }) => {
  try {
    const { countryCode, country, regionName, timezone } = await getCountryCode();
    const state = getState();
    const hasLaunched = state.user?.hasLaunched;
    const userInfo = {
      uid: user?.uid,
      countryCode,
      country,
      regionName,
      timezone,
      platform: Platform.OS,
      hasLaunched: hasLaunched ? hasLaunched : !hasLaunched,
    };
    dispatch(receiveUserProfile(userInfo));
    if (!hasLaunched) {
      apis.slack.newUser(userInfo);
    }
  } catch (e) {
    console.log('updateUserProfile error: ', e);
  }
};

export const newLogin = data => async (dispatch, getState, { apis }) => {
  try {
    const state = getState();
    const newUserInfo = {
      ...state?.user,
      ...data,
    };
    apis.slack.newLogin(newUserInfo);
    apis.firebase.logEvent({ name: 'login' });
  } catch (e) {
    console.log('newLogin error: ', e);
  }
};

export const newTapPurchase = () => async (dispatch, getState, { apis }) => {
  try {
    apis.firebase.logEvent({ name: 'newTapPurchase' });
  } catch (e) {
    console.log('newTapPurchase error: ', e);
  }
};

export const purchaseErrorAction = errorMessage => async (dispatch, getState, { apis }) => {
  try {
    const state = getState();
    const newUserInfo = {
      ...state?.user,
      followerCount: insFollowersCountSelector(state),
      followingCount: insFollowingsCountSelector(state),
      profilePicHd: insProfilePictureSelector(state),
      username: insUsernameSelector(state),
    };
    apis.slack.purchaseError({
      ...newUserInfo,
      error: errorMessage,
    });
    apis.firebase.logEvent({ name: 'purchaseError' });
  } catch (e) {
    if (__DEV__) {
      console.log('purchaseErrorAction error: ', e);
    }
  }
};
