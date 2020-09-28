import makeActionCreator from './makeActionCreator';
import { Platform } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';


export const RECEIVE_PURCHASE_HISTORY = 'RECEIVE_PURCHASE_HISTORY';

const receivePurchaseHistory = makeActionCreator(RECEIVE_PURCHASE_HISTORY, 'history');


export const connectAppStore = () => async (dispatch, getState, { apis }) => {
  try {
    await InAppPurchases.connectAsync();
    const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync(false);
    dispatch(receivePurchaseHistory(results));
  } catch (e) {
    if (__DEV__) {
      console.log('initIap error: ', e);
    }
    dispatch(receivePurchaseHistory([]));
  }
};
