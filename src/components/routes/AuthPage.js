import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import SignInForm from '../auth/SignInForm';
import SignUpForm from '../auth/SignUpForm';
import { connect } from 'react-redux';
import { signUp } from '../../ducks/auth';

class AuthPage extends Component {
  handleSignIn = values => console.log(values);
  handleSignUp = ({ email, password }) => this.props.signUp(email, password);

  render() {
    return (
      <div>
        <h1>Auth page</h1>
        <NavLink to="/auth/signin" activeStyle={{ color: 'red' }}>
          sign in
        </NavLink>
        <NavLink to="/auth/signup" activeStyle={{ color: 'red' }}>
          sign up
        </NavLink>
        <Route
          path="/auth/signin"
          render={() => <SignInForm onSubmit={this.handleSignIn} />}
        />
        <Route
          path="/auth/signup"
          render={() => <SignUpForm onSubmit={this.handleSignUp} />}
        />
      </div>
    );
  }
}

export default connect(
  null,
  { signUp }
)(AuthPage);