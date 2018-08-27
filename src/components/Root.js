import React, { Component } from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import AdminPage from './routes/AdminPage';
import AuthPage from './routes/AuthPage';
import PeoplePage from './routes/PeoplePage';
import ProtectedRoute from './common/ProtectedRoute';
import { connect } from 'react-redux';
import { signOut } from '../ducks/auth';

class Root extends Component {
  render() {
    const { signedIn, signOut } = this.props;

    const btn = signedIn ? (
      <button onClick={signOut}>Sign Out</button>
    ) : (
      <Link to="/auth/signin">sign in</Link>
    );

    return (
      <div>
        {btn}
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
  )(Root)
);
