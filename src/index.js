import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import App from './App';
import store from './redux';
import history from './history';
import './config';
import './mocks';

ReactDOM.render(
  <div>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </div>,
  document.getElementById('root')
);
