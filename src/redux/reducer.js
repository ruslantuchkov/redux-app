import { combineReducers } from 'redux';
import auth from '../ducks/auth';
import people from '../ducks/people';
import events from '../ducks/events';

export default combineReducers({
  auth,
  people,
  events
});
