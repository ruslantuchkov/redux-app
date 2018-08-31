import { appName } from '../config';
import firebase from 'firebase';
import { all, take, call, put, select, takeEvery } from 'redux-saga/effects';
import { Record, OrderedMap, OrderedSet } from 'immutable';
import { createSelector } from 'reselect';
import { fbToEntities } from './utils';

export const moduleName = 'events';

export const ReducerRecord = Record({
  entities: new OrderedMap({}),
  selected: new OrderedSet([]),
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
export const FETCH_ALL_START = `${appName}/${moduleName}/FETCH_ALL_START`;
export const FETCH_ALL_SUCCESS = `${appName}/${moduleName}/FETCH_ALL_SUCCESS`;
export const FETCH_LAZY_REQUEST = `${appName}/${moduleName}/FETCH_LAZY_REQUEST`;
export const FETCH_LAZY_SUCCESS = `${appName}/${moduleName}/FETCH_LAZY_SUCCESS`;
export const FETCH_LAZY_START = `${appName}/${moduleName}/FETCH_LAZY_START`;
export const SELECT_EVENT = `${appName}/${moduleName}/SELECT_EVENT`;

//REDUCER
export default function reducer(state = new ReducerRecord(), action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_ALL_START:
    case FETCH_LAZY_START:
      return state.set('loading', true);

    case FETCH_ALL_SUCCESS:
      return state
        .set('loading', false)
        .set('loaded', false)
        .set('entities', fbToEntities(payload, EventRecord));

    case FETCH_LAZY_SUCCESS:
      return state
        .set('loading', false)
        .mergeIn(['entities'], fbToEntities(payload, EventRecord))
        .set('loaded', Object.keys(payload).length < 10);

    case SELECT_EVENT:
      return state.update(
        'selected',
        selected =>
          selected.has(payload.uid)
            ? selected.remove(payload.uid)
            : selected.add(payload.uid)
      );

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
export const selectionSelector = createSelector(
  stateSelector,
  state => state.selected
);
export const selectedEventsSelector = createSelector(
  eventListSelector,
  selectionSelector,
  (eventList, selectedIds) =>
    eventList.filter(event => selectedIds.has(event.uid))
);

//ACTION CREATORS
export function fetchAll() {
  return {
    type: FETCH_ALL_REQUEST
  };
}

export function selectEvent(uid) {
  return {
    type: SELECT_EVENT,
    payload: { uid }
  };
}

export function fetchLazy() {
  return {
    type: FETCH_LAZY_REQUEST
  };
}

//SAGAS
export const fetchAllSaga = function*() {
  const state = yield select(stateSelector);
  if (state.loading || state.loaded) return;

  yield put({
    type: FETCH_ALL_START
  });

  const ref = firebase.database().ref('events');
  const snapshot = yield call([ref, ref.once], 'value');

  yield put({
    type: FETCH_ALL_SUCCESS,
    payload: snapshot.val()
  });
};

export const fetchLazySaga = function*() {
  while (true) {
    yield take(FETCH_LAZY_REQUEST);

    const state = yield select(stateSelector); //state уже после изменения от FETCH_LAZY_REQUEST, поэтому по FETCH_LAZY_REQUEST нельзя менять loading на true

    if (state.loading || state.loaded) continue;

    yield put({
      type: FETCH_LAZY_START
    });

    const lastEvent = state.entities.last();

    const ref = firebase
      .database()
      .ref('events')
      .orderByKey()
      .limitToFirst(10)
      .startAt(lastEvent ? lastEvent.uid : '');

    const data = yield call([ref, ref.once], 'value');

    yield put({
      type: FETCH_LAZY_SUCCESS,
      payload: data.val()
    });
  }
};

export function* saga() {
  yield all([takeEvery(FETCH_ALL_REQUEST, fetchAllSaga), fetchLazySaga()]);
}
