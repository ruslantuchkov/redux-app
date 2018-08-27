import firebase from 'firebase';
import { appName } from '../config';
import { Record, List } from 'immutable';

export const moduleName = 'people';

const ReducerState = Record({
  entities: new List([])
});

const PersonRecord = Record({
  id: null,
  firstName: null,
  lastName: null,
  email: null
});

export const ADD_PERSON = `${appName}/${moduleName}/ADD_PERSON`;

export default function reducer(state = new ReducerState(), action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PERSON:
      return state.update('entities', entities =>
        entities.push(new PersonRecord(payload.person))
      );

    default:
      return state;
  }
}

export const addPerson = person => dispatch => {
  dispatch({
    type: ADD_PERSON,
    payload: { person: { id: Date.now(), ...person } }
  });
};
