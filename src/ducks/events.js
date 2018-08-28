import { appName } from '../config';
import firebase from 'firebase';
import { all, take, call, put } from 'redux-saga/effects';
import { Record, OrderedMap } from 'immutable';
import { createSelector } from 'reselect';
import { fbToEntities } from './utils';

export const moduleName = 'events';

export const ReducerRecord = Record({
  entities: new OrderedMap({}),
  loading: false,
  loaded: false
});

export const EventRecord = Record({
  uid: null,
  title: null,
  url: null,
  where: null,
  when: null,
  month: null,
  submissionDeadline: null
});

//ACTION TYPES
export const FETCH_ALL_REQUEST = `${appName}/${moduleName}/FETCH_ALL_REQUEST`;
export const FETCH_ALL_SUCCESS = `${appName}/${moduleName}/FETCH_ALL_SUCCESS`;

//REDUCER
export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_REQUEST:
      return state.set('loading', true);

    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', true)
        .set('loaded', true)
        .set('entities', fbToEntities(payload, EventRecord));
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
export const eventListSelector = createSelector(entitiesSelector, entities =>
  entities.valueSeq().toArray()
);

//ACTION CREATORS
export function fetchAll() {
  return {
    type: FETCH_ALL_REQUEST
  };
}

//SAGAS
export const fetchAllSaga = function*() {
  while (true) {
    yield take(FETCH_ALL_REQUEST);

    const ref = firebase.database().ref('events');
    const snapshot = yield call([ref, ref.once], 'value');

    yield put({
      type: FETCH_ALL_SUCCESS,
      payload: snapshot.val()
    });
  }
};

export function* saga() {
  yield all([fetchAllSaga()]);
}
