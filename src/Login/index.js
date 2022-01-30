import React, { Component } from "react";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { createBrowserHistory } from 'history';
import { useLocation, useNavigate } from 'react-router-dom';

class Login extends Component {

  constructor(props) {
    super(props)
    const LoginFormValues = { "email": "", "password": "" }
    this.state = {
      LoginFormValues: LoginFormValues,
      error: ""
    }
    // this.submitForm = this.submitForm.bind(this)
  }
  componentDidMount() {
    // axios.get("/61f03c2d12abfb55db6650f6").then((response) => {
    //   console.log(response)
    // });
    console.log(this.props)
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      LoginFormValues: ({ ...this.state.LoginFormValues, [name]: value })
    }, () => {
      console.log(this.state.LoginFormValues)
    })
  }

  submitForm = (e) => {
    e.preventDefault()
    console.log(this.props)
    axios.post("https://murmuring-mountain-24156.herokuapp.com"+"/login", this.state.LoginFormValues)
      .then((response) => {
        reactLocalStorage.set("authToken", response.data["access token"])
        console.log(this.props.history)
        this.props.history("/app", { hello: "world" })
      })
      .catch(function (error) {
        console.log(error)
        alert(error);
      });
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.submitForm()
  }

  render() {
    return (
      <div className="App">
        <form
          id="main-login"
          action={this.props.action}
          method={this.props.method}
        // onSubmit={this.onSubmit}
        >
          <h2>Login</h2>
          <label>
            <span class="text">user:</span>
            <input type="email" name="email" placeholder="Email" value={this.state.LoginFormValues.email} onChange={this.handleChange} /><br />
          </label>
          <br />
          <label>
            <span class="text">password:</span>
            <input type="password" name="password" placeholder="password" value={this.state.LoginFormValues.password} onChange={this.handleChange} /><br />
          </label>
          <br />
          <div class="align-right" type="submit">
            <button onClick={this.submitForm.bind(this)}>Submit</button>
          </div>
        </form>
        <pre>{this.state.error}</pre>
      </div>
    );
  }
}
export default (props) => {
  const history = useNavigate()
  const location = useLocation()

  return <Login history={history} location={location} {...props} />
} 