import React, { Component } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import { Outlet, Navigate } from "react-router-dom";
import { useLocation, useNavigate, useParams } from 'react-router-dom';

class PrivateRoute extends Component {
  logout = () => {
    reactLocalStorage.remove('authToken')
    this.props.history("/login")
  }

  render() {
    let isLoggedIn = reactLocalStorage.get("authToken");
    if (isLoggedIn) {
      return (
        <div>
          <button onClick={() => { this.logout() }}>Logout</button>
          <Outlet />
        </div>
      );
    }
    return <Navigate to="/login" replace />;
  }
}
export default (props) => {
  const history = useNavigate()
  const location = useParams()

  return <PrivateRoute history={history} location={location} {...props} />
}

