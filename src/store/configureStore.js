// @format
/* eslint-disable import/no-namespace, no-console */
import { AsyncStorage, Platform } from 'react-native';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import { persistStore, persistReducer } from 'redux-persist';
import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

// import { navigationReduxMiddleware } from 'navigation/AppNavigator';
import rootReducer from 'reducers';
// import * as firebaseApi from 'services/firebase';
// import {verifyAuth} from 'modules/auth/authActions';
import apis from 'apis';
import DEBUG from 'utils/logUtils';

export const loggerMiddleware = store => next => action => {
  DEBUG.group(action.type);
  DEBUG.info('dispatching', action);
  // DEBUG.log('current state', store.getState());
  const result = next(action);
  // DEBUG.log('next state', store.getState());
  DEBUG.groupEnd();
  return result;
};

const middlewares = [
  thunkMiddleware.withExtraArgument({ apis }),
  // navigationReduxMiddleware,
  // loggerMiddleware,
];

const finalCreateStore = compose(applyMiddleware(...middlewares))(createStore);

const persistConfig = {
  key: 'root',
  storage: Platform.OS === 'web' ? AsyncStorage : ExpoFileSystemStorage,
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default initialState => {
  const store = finalCreateStore(persistedReducer, initialState);
  const persistor = persistStore(store);
  // persistor.purge();
  // store.dispatch(verifyAuth());
  return { store, persistor };
};
