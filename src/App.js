import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Link, NavLink, withRouter } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import AuthPage from './routes/AuthPage';
import PeoplePage from './routes/PeoplePage';
import EventsPage from './routes/EventsPage';
import { signOut } from './ducks/auth';

class App extends Component {
  get menu() {
    return (
      <Fragment>
        <div>
          <NavLink to="/events" activeStyle={{ color: 'red' }}>
            events
          </NavLink>
        </div>
        <div>
          <NavLink to="/people" activeStyle={{ color: 'red' }}>
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
      <Link to="/auth/signin">Sign In</Link>
    );
  }

  render() {
    return (
      <div>
        {this.authBtn}
        {this.menu}
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/people" component={PeoplePage} />
        <Route path="/events" component={EventsPage} />
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
