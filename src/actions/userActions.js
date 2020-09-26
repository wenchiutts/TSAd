import makeActionCreator from 'actions/makeActionCreator';
import { PRODUCTS_IDS, PRODUCT_PLAN_TYPE_MAP } from 'constants/Products';

export const UPDATE_PREMIUM = 'UPDATE_PREMIUM';
export const updatePremium = makeActionCreator(
  'UPDATE_PREMIUM',
  'status',
  'planType',
  'purchaseTime',
);

export const purchaseSubscriptionAction = ({ description, purchaseTime }) => async (
  dispatch,
  getState,
  { apis },
) => {
  try {
    const state = getState();
    const planType = PRODUCT_PLAN_TYPE_MAP[description];
    console.log('planType', planType);
    // dispatch(updatePremium('active', planType, purchaseTime));

    if (state.user.premium?.status === 'inactive' || state.user.premium?.status === 'expired') {
      dispatch(updatePremium('active', planType, purchaseTime));
    } else {
      console.log('subscription is still active');
    }
  } catch (e) {
    console.log('purchaseStarsAction error: ', e);
  }
};

export const validateOrderStatusAction = () => async (dispatch, getState, { apis }) => {};
