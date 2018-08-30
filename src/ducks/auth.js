import firebase from 'firebase';
import { appName } from '../config';
import { Record } from 'immutable';
import { all, take, put, call, apply, takeEvery } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { push, replace } from 'connected-react-router';

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
export const SIGN_IN_REQUEST = `${appName}/${moduleName}/SIGN_IN_REQUEST`;
export const SIGN_IN_SUCCESS = `${appName}/${moduleName}/SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `${appName}/${moduleName}/SIGN_IN_ERROR`;
export const SIGN_OUT_REQUEST = `${appName}/${moduleName}/SIGN_OUT_REQUEST`;
export const SIGN_OUT_SUCCESS = `${appName}/${moduleName}/SIGN_OUT_SUCCESS`;

//REDUCER
export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload, error } = action;

  switch (type) {
    case SIGN_UP_REQUEST:
    case SIGN_IN_REQUEST:
      return state.set('loading', true);

    case SIGN_UP_SUCCESS:
    case SIGN_IN_SUCCESS:
      return state
        .set('loading', false)
        .set('user', payload.user)
        .set('error', null);

    case SIGN_UP_ERROR:
    case SIGN_IN_ERROR:
      return state.set('loading', false).set('error', error);

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

export const signIn = (email, password) => ({
  type: SIGN_IN_REQUEST,
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

export function* signInSaga({ payload }) {
  const auth = firebase.auth();

  try {
    const user = yield apply(auth, auth.signInWithEmailAndPassword, [
      payload.email,
      payload.password
    ]);

    yield put({
      type: SIGN_IN_SUCCESS,
      payload: { user }
    });
  } catch (error) {
    yield put({
      type: SIGN_IN_ERROR,
      error
    });
  }
}

const createAuthChannel = () =>
  eventChannel(emit =>
    firebase.auth().onAuthStateChanged(user => emit({ user }))
  );

export const watchStatusChangeSaga = function*() {
  const chan = yield call(createAuthChannel);

  while (true) {
    const { user } = yield take(chan);

    if (user) {
      yield put({
        type: SIGN_IN_SUCCESS,
        payload: { user }
      });
    } else {
      yield put({
        type: SIGN_OUT_SUCCESS
      });
      yield put(replace('/auth/signin'));
    }
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
    takeEvery(SIGN_IN_REQUEST, signInSaga),
    watchStatusChangeSaga(),
    takeEvery(SIGN_OUT_REQUEST, signOutSaga)
  ]);
};
