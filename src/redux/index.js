import { createStore, compose, applyMiddleware } from 'redux';
import reducer from './reducer';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import history from '../history';
import saga from './saga';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  connectRouter(history)(reducer),
  composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history)))
);

window.store = store; // для доступа к store из консоли

sagaMiddleware.run(saga);

export default store;
