import { appName } from '../config';
import firebase from 'firebase';
import { Record, List } from 'immutable';
import { put, take, call, takeEvery, all, spawn } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { createSelector } from 'reselect';
import { fbToEntities } from './utils';

export const moduleName = 'people';

const ReducerRecord = Record({
  entities: new List([])
});

const PersonRecord = Record({
  uid: null,
  firstName: null,
  lastName: null,
  email: null
});

//ACTION_TYPES
export const FETCH_ALL_REQUEST = `${appName}/${moduleName}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${appName}/${moduleName}/FETCH_ALL_SUCCESS`;
export const ADD_PERSON_REQUEST = `${appName}/${moduleName}/ADD_PERSON_REQUEST`;
export const ADD_PERSON_START = `${appName}/${moduleName}/ADD_PERSON_START`;
export const ADD_PERSON_SUCCESS = `${appName}/${moduleName}/ADD_PERSON_SUCCESS`;

//REDUCER
export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PERSON_SUCCESS:
      return state.setIn(['entities', payload.uid], new PersonRecord(payload));

    case FETCH_ALL_SUCCESS:
      return state.set('entities', fbToEntities(payload, PersonRecord));

    default:
      return state;
  }
}

//SELECTORS
export const stateSelector = state => state[moduleName];
export const entitiesSelector = createSelector(
  stateSelector,
  state => state.entities
);
export const peopleSelector = createSelector(entitiesSelector, entities =>
  entities.valueSeq().toArray()
);

//ACTION_CREATORS
export const addPerson = person => ({
  type: ADD_PERSON_REQUEST,
  payload: { person }
});

export function fetchAllPeople() {
  return {
    type: FETCH_ALL_REQUEST
  };
}

//SAGAS
export function* addPersonSaga(action) {
  yield put({
    type: ADD_PERSON_START
  });

  const peopleRef = firebase.database().ref('people');

  const { key } = yield call(
    [peopleRef, peopleRef.push],
    action.payload.person
  );

  yield put({
    type: ADD_PERSON_SUCCESS,
    payload: { uid: key, ...action.payload.person }
  });
}

export function* fetchAllSaga() {
  const peopleRef = firebase.database().ref('people');

  const data = yield call([peopleRef, peopleRef.once], 'value');

  yield put({
    type: FETCH_ALL_SUCCESS,
    payload: data.val()
  });
}

const createEventChannel = () =>
  eventChannel(emit => {
    const callback = data => emit({ data });

    firebase
      .database()
      .ref('people')
      .on('value', callback);

    return () =>
      firebase
        .database()
        .ref('people')
        .off('value', callback);
  });

export function* realtimeSyncSaga() {
  const channel = yield call(createEventChannel);
  while (true) {
    const { data } = yield take(channel);

    yield put({
      type: FETCH_ALL_SUCCESS,
      payload: data.val()
    });
  }
}

export const saga = function*() {
  yield spawn(realtimeSyncSaga);
  yield all([
    takeEvery(ADD_PERSON_REQUEST, addPersonSaga),
    takeEvery(FETCH_ALL_REQUEST, fetchAllSaga)
  ]);
};
