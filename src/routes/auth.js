import React, { Component, Fragment } from 'react';
import { Route, NavLink } from 'react-router-dom';
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
          <NavLink to="/auth/signin" activeStyle={{ color: 'red' }}>
            sign in
          </NavLink>
        </div>
        <div>
          <NavLink to="/auth/signup" activeStyle={{ color: 'red' }}>
            sign up
          </NavLink>
        </div>
      </Fragment>
    );
  }

  render() {
    const { loading } = this.props;

    return (
      <div>
        <h1>Auth page</h1>
        {this.menu}
        <Route
          path="/auth/signin"
          render={() => <SignInForm onSubmit={this.handleSignIn} />}
        />
        <Route
          path="/auth/signup"
          render={() => <SignUpForm onSubmit={this.handleSignUp} />}
        />
        {loading && <Loader />}
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: state.auth.loading
  }),
  { signUp }
)(AuthPage);
