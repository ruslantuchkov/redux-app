import { combineReducers } from 'redux';
import auth from '../ducks/auth';
import people from '../ducks/people';

export default combineReducers({
  auth,
  people
});
