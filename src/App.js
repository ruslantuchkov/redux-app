import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Link, NavLink, withRouter } from 'react-router-dom';
import AdminPage from './routes/admin';
import AuthPage from './routes/auth';
import PeoplePage from './routes/people';
import ProtectedRoute from './components/common/ProtectedRoute';

import { signOut } from './ducks/auth';

class App extends Component {
  get menu() {
    return (
      <Fragment>
        <div>
          <NavLink to="/admin/events" activeStyle={{ color: 'red' }}>
            events
          </NavLink>
        </div>
        <div>
          <NavLink to="/admin/people" activeStyle={{ color: 'red' }}>
            people
          </NavLink>
        </div>
      </Fragment>
    );
  }

  get authBtn() {
    const { signedIn, signOut } = this.props;

    return signedIn ? (
      <button onClick={signOut}>Sign Out</button>
    ) : (
      <Link to="/auth/signin">sign in</Link>
    );
  }

  render() {
    return (
      <div>
        {this.authBtn}
        {this.menu}
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/admin" component={AdminPage} />
        <ProtectedRoute path="/people" component={PeoplePage} />
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      signedIn: !!state.auth.user
    }),
    { signOut }
  )(App)
);
