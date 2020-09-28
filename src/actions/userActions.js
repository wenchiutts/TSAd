import makeActionCreator from 'actions/makeActionCreator';
import { PRODUCTS_IDS, PRODUCT_PLAN_TYPE_MAP, IAP_PRODUCTS } from 'constants/Products';

export const UPDATE_PREMIUM = 'UPDATE_PREMIUM';
export const updatePremium = makeActionCreator('UPDATE_PREMIUM', 'purchase');

export const purchaseSubscriptionAction = ({ purchaseTime, productId }) => async (
  dispatch,
  getState,
  { apis },
) => {
  try {
    const state = getState();
    if (state.user.premium?.status === 'inactive' || state.user.premium?.status === 'expired') {
      dispatch(updatePremium({
        status: 'active',
        productId,
        lastUpdatedAt: purchaseTime,
      }));
      // Todo: Update user FireStore record, save the the whole premium structure
    } else {
      console.log('subscription is still active');
    }
  } catch (e) {
    console.log('purchaseStarsAction error: ', e);
  }
};

export const checkSubscriptionStatus = () => async (dispatch, getState, { apis }) => { // Check if subscription expired
  const state = getState();
  const premium = state?.user?.premium;
  console.log('fuck', premium);

  if (premium?.status !== 'active') {
    return;
  }

  const purchaseHistory = state?.payment?.history;
  console.log('purchaseHistory', purchaseHistory)
  const latestPurchase = purchaseHistory.sort((a, b) => b?.purchaseTime - a?.purchaseTime)?.[0];
  console.log('latestPurchase', latestPurchase);
  if (latestPurchase) {
    const { purchaseTime, productId } = latestPurchase;
    const periodDays = IAP_PRODUCTS[productId];
    const currentTime = (new Date()).getTime();
    const dateDifference = Math.floor((currentTime - purchaseTime) / (1000 * 60 * 60 * 24));
    if (dateDifference > periodDays) {
      dispatch(updatePremium({
        status: 'expired',
        productId,
        lastUpdatedAt: new Date().getTime()
      }))
    }
    return;
  }
  if (premium?.status === 'active') {
    console.log('fuck active')
    dispatch(updatePremium({
      status: 'expired',
      productId: null,
      lastUpdatedAt: new Date().getTime()
    }));
    // Todo: Update user FireStore record, save the the whole premium structure
  }
};
