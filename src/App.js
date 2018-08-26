import React, { Component } from 'react';
import Root from './components/Root';
import store from './redux';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from './history';

class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Root />
          </ConnectedRouter>
        </Provider>
      </div>
    );
  }
}

export default App;
