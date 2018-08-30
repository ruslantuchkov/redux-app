import firebase from 'firebase';
import { appName } from '../config';
import { Record } from 'immutable';
import { all, take, put, call, cps, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

export const moduleName = 'auth';

const ReducerRecord = Record({
  user: null,
  error: null,
  loading: false
});

//ACTION_TYPES
export const SIGN_UP_REQUEST = `${appName}/${moduleName}/SIGN_UP_REQUEST`;
export const SIGN_UP_SUCCESS = `${appName}/${moduleName}/SIGN_UP_SUCCESS`;
export const SIGN_UP_ERROR = `${appName}/${moduleName}/SIGN_UP_ERROR`;
export const SIGN_IN_SUCCESS = `${appName}/${moduleName}/SIGN_IN_SUCCESS`;
export const SIGN_OUT_REQUEST = `${appName}/${moduleName}/SIGN_OUT_REQUEST`;
export const SIGN_OUT_SUCCESS = `${appName}/${moduleName}/SIGN_OUT_SUCCESS`;

//REDUCER
export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case SIGN_UP_REQUEST:
      return state.set('loading', true);

    case SIGN_UP_SUCCESS:
      return state
        .set('loading', false)
        .set('user', payload.user)
        .set('error', null);

    case SIGN_UP_ERROR:
      return state.set('loading', false).set('error', error);

    case SIGN_IN_SUCCESS:
      return state
        .set('loading', false)
        .set('user', payload.user)
        .set('error', null);

    case SIGN_OUT_SUCCESS:
      return new ReducerRecord();

    default:
      return state;
  }
}

//ACTION CREATORS
export const signUp = (email, password) => ({
  type: SIGN_UP_REQUEST,
  payload: { email, password }
});

export const signOut = () => ({
  type: SIGN_OUT_REQUEST
});

//SAGAS
export function* signUpSaga({ payload }) {
  const auth = firebase.auth();

  try {
    const user = yield call(
      [auth, auth.createUserWithEmailAndPassword],
      payload.email,
      payload.password
    );

    yield put({
      type: SIGN_UP_SUCCESS,
      payload: { user }
    });
  } catch (error) {
    yield put({
      type: SIGN_UP_ERROR,
      error
    });
  }
}

export const watchStatusChange = function*() {
  const auth = firebase.auth();

  try {
    yield cps([auth, auth.onAuthStateChanged]); //временно для примера
  } catch (user) {
    yield put({
      type: SIGN_IN_SUCCESS,
      payload: { user }
    });
  }
};

export const signOutSaga = function*() {
  const auth = firebase.auth();

  try {
    yield call([auth, auth.signOut]);
    yield put({
      type: SIGN_OUT_SUCCESS
    });
    yield put(push('/auth/signin'));
  } catch (_) {}
};

export const saga = function*() {
  yield all([
    takeEvery(SIGN_UP_REQUEST, signUpSaga),
    watchStatusChange(),
    takeEvery(SIGN_OUT_REQUEST, signOutSaga)
  ]);
};
