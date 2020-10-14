import makeActionCreator from 'actions/makeActionCreator';

export const FIREBASE_REQUEST_AUTH = 'FIREBASE_REQUEST_AUTH';
export const FIREBASE_RECEIVE_AUTH = 'FIREBASE_RECEIVE_AUTH';
const requetFirebaseAuth = makeActionCreator(FIREBASE_REQUEST_AUTH);
const receiveFirebaseAuth = makeActionCreator(FIREBASE_RECEIVE_AUTH, 'user');

export const getAuthStateAction = () => async (dispatch, getState, { apis }) => {
  try {
    dispatch(requetFirebaseAuth());
    const user = await apis.firebase.getAuthState();
    dispatch(receiveFirebaseAuth(user));
    return user;
  } catch (e) {
    console.log('getAuthStateAction error', e);
  }

};
