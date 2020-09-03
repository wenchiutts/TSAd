// @format
import { Platform } from 'react-native';
import makeActionCreator from './makeActionCreator';
export const REQUEST_TIME = 'REQUEST_TIME';
export const RECEIVE_TIME = 'RECEIVE_TIME';

const requestTime = makeActionCreator('REQUEST_TIME');
const receiveTime = makeActionCreator('RECEIVE_TIME', 'time');
export const fetchCurrentTimeAction = () => async (dispatch, getState, { apis }) => {
  try {
    dispatch(requestTime());
    if (Platform.OS === 'web') {
      const firebaseTime = await apis.firebase.getServerTime({
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      await dispatch(receiveTime({ datetime: firebaseTime }));
      return { datetime: firebaseTime };
    }
    const time = await apis.time.getTime();
    if (time?.data?.datetime) {
      await dispatch(receiveTime(time.data));
      return time.data;
    }
    const firebaseTime = await apis.firebase.getServerTime({});
    await dispatch(receiveTime({ datetime: firebaseTime }));
    return { datetime: firebaseTime };
  } catch (error) {
    const state = getState();
    const user = state?.user;
    apis.slack.getTimeError({
      ...user,
      error,
    });
  }
};
