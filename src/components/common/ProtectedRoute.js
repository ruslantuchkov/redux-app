import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UnAuthorized from './UnAuthorized';

class ProtectedRoute extends Component {
  render() {
    const { isAuthorized, component, render, ...rest } = this.props;
    return <Route {...rest} render={this.getComponent} />;
  }

  getComponent = () => {
    const { isAuthorized, ...rest } = this.props;
    return isAuthorized ? <Route {...rest} /> : <UnAuthorized />;
  };
}

export default withRouter(
  connect(state => ({ isAuthorized: !!state.auth.user }))(ProtectedRoute)
);
