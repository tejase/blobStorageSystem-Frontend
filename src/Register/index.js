import React, { Component } from "react";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { useLocation, useNavigate, Link } from "react-router-dom";

class Register extends Component {
  constructor(props) {
    super(props);
    const SignupFormValues = { name: "", email: "", password: "" };
    this.state = {
      SignupFormValues: SignupFormValues,
      error: "",
    };
  }
  componentDidMount() {
    // axios.get("/61f03c2d12abfb55db6650f6").then((response) => {
    //   console.log(response)
    // });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      {
        SignupFormValues: { ...this.state.SignupFormValues, [name]: value },
      },
      () => {
        console.log(this.state.SignupFormValues);
      }
    );
  };

  submitForm = () => {
    axios
      .post(
        "https://murmuring-mountain-24156.herokuapp.com" + "/signup",
        this.state.SignupFormValues
      )
      .then((response) => {
        reactLocalStorage.set("authToken", response.data["access token"]);
        this.props.history("/app");
      })
      .catch(function (error) {
        alert(error + JSON.stringify(error.response.data));
        console.log(error);
      });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.submitForm();
  };

  render() {
    return (
      <div
        className="App"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <form
          id="main-signup"
          action={this.props.action}
          method={this.props.method}
          onSubmit={this.onSubmit}
          style={{ border: "1px solid #ccc", padding: "45px" }}
        >
          <h2 style={{}}>Register</h2>
          <label>
            <span class="text">Name: </span>
            <input
              type="text"
              name="name"
              placeholder="Email"
              value={this.state.SignupFormValues.name}
              onChange={this.handleChange}
            />
            <br />
          </label>
          <br />
          <label>
            <span class="text">Email: </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={this.state.SignupFormValues.email}
              onChange={this.handleChange}
            />
            <br />
          </label>
          <br />
          <label>
            <span class="text">password: </span>
            <input
              type="password"
              name="password"
              placeholder="password"
              value={this.state.SignupFormValues.password}
              onChange={this.handleChange}
            />
            <br />
          </label>
          <br />
          <div class="align-right" type="submit">
            <button>Register</button>
          </div>
          <div style = {{marginTop: "20px"}}>
          <Link to="/login">Already have an account?</Link>
          </div>
        </form>
      </div>
    );
  }
}
export default (props) => {
  const history = useNavigate();
  const location = useLocation();

  return <Register history={history} location={location} {...props} />;
};
