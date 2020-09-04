import makeActionCreator from 'actions/makeActionCreator';

export const REQUEST_AUTH = 'REQUEST_AUTH';
export const RECEIVE_AUTH = 'RECEIVE_AUTH';
const requestAuth = makeActionCreator(REQUEST_AUTH);
const receiveAuth = makeActionCreator(RECEIVE_AUTH, 'user');

export const getAuthStateAction = () => async (dispatch, getState, { apis }) => {
  dispatch(requestAuth());
  const user = await apis.firebase.getAuthState();
  dispatch(receiveAuth());
  return user;
};
