import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UnAuthorized from './UnAuthorized';

class ProtectedRoute extends Component {
  render() {
    const { component: Comp, authorized, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props => {
          return authorized ? <Comp {...props} /> : <UnAuthorized />;
        }}
      />
    );
  }
}

export default withRouter(
  connect(state => ({ authorized: !!state.auth.user }))(ProtectedRoute)
);
