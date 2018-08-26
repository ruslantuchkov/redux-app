import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './reducer';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import history from '../history';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(reducer),
  composeEnhancers(applyMiddleware(routerMiddleware(history), thunk))
);

export default store;
