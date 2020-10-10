// @format
import { useContext } from 'react';
import { ifElse, curry, always, __ } from 'ramda';
import { ReactReduxContext } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { isPremiumUserSelector } from 'modules/user/userSelector';

const condictionInvoke = curry((predictFn, leftFn, rightFn) => ifElse(predictFn, leftFn, rightFn));

export const useCheckPremium = () => {
  const navigation = useNavigation();
  const storeContext = useContext(ReactReduxContext);
  const store = storeContext.store;
  const isPremiuum = isPremiumUserSelector(store.getState());
  const navigateToPurchaseModal = () => {
    navigation.navigate('purchase');
  };

  return {
    checkPremium: condictionInvoke(always(isPremiuum), __, navigateToPurchaseModal),
  };
};
