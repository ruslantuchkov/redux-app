import React, { Component, Fragment } from 'react';
import { Route, NavLink, Redirect } from 'react-router-dom';
import SignInForm from '../components/auth/SignInForm';
import SignUpForm from '../components/auth/SignUpForm';
import Loader from '../components/common/Loader';
import { connect } from 'react-redux';
import { signUp } from '../ducks/auth';

class AuthPage extends Component {
  handleSignIn = values => console.log(values);
  handleSignUp = ({ email, password }) => this.props.signUp(email, password);

  get menu() {
    return (
      <Fragment>
        <div>
          <NavLink
            to={`${this.props.match.path}/signin`}
            activeStyle={{ color: 'red' }}
          >
            sign in
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`${this.props.match.path}/signup`}
            activeStyle={{ color: 'red' }}
          >
            sign up
          </NavLink>
        </div>
      </Fragment>
    );
  }

  render() {
    const { loading, error, isAuthorized } = this.props;

    return (
      <div>
        {isAuthorized ? <Redirect to="/" /> : null}
        <h1>Auth page</h1>
        {this.menu}
        {error && <p style={{ color: 'red' }}>{error.message}</p>}
        <Route
          path={`${this.props.match.path}/signin`}
          render={() => <SignInForm onSubmit={this.handleSignIn} />}
        />
        <Route
          path={`${this.props.match.path}/signup`}
          render={() => <SignUpForm onSubmit={this.handleSignUp} />}
        />
        {loading && <Loader />}
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthorized: !!state.auth.user
  }),
  { signUp }
)(AuthPage);
