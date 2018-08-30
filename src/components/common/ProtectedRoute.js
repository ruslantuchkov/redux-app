import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const ProtectedRoute = ({ isAuthorized, component, ...rest }) => (
  <Route
    {...rest}
    render={() =>
      isAuthorized ? (
        <Route component={component} {...rest} />
      ) : (
        <Redirect to="/auth" />
      )
    }
  />
);

export default withRouter(
  connect(state => ({ isAuthorized: !!state.auth.user }))(ProtectedRoute)
);
