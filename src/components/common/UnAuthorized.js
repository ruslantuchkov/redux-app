import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class UnAuthorized extends Component {
  render() {
    return (
      <div>
        Unauthorized, please <Link to="/auth">Sign In</Link>
      </div>
    );
  }
}

export default UnAuthorized;
