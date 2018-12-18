import React, { Component } from 'react';
import {
  authenticateUser,
  postUser,
  logout
} from '../api';
import {
  emitLogIn
} from '../socket-api';
import { toast } from 'react-toastify';

class Auth extends Component {

  constructor() {
    super();
    this.state = {
      usernameInput: '',
      passwordInput: '',
      disableButtons: true
    }
  }

  handleUsername = e => {
    this.setState({
      usernameInput: e.target.value,
      disableButtons: e.target.value.length === 0 ||
        this.state.passwordInput.length === 0
    });
  }

  handlePassword = e => {
    this.setState({
      passwordInput: e.target.value,
      disableButtons: e.target.value.length === 0 ||
        this.state.usernameInput.length === 0
    });
  }

  login = () => {
    authenticateUser(this.state.usernameInput, this.state.passwordInput)
      .then(r => {
        if (r[0]) {
          this.props.checkAuth();
          emitLogIn(this.state.usernameInput);
          this.setState({
            usernameInput: '',
            passwordInput: '',
          });
        } else {
          toast.warn('try again');
        }
      })
      .catch(err => {
        toast.warn('try again');
      })
  }

  register = () => {
    postUser(this.state.usernameInput, this.state.passwordInput)
      .then(r => {
        console.log(r);
        if (r === 'success! you may now login') {
          toast.success('now try logging in');
        } else {
          toast.error('username not available')
        }
      })
  }

  handleLogout = () => {
    logout()
      .then(r => {
        this.props.checkAuth();
      })
      .catch(err => {
        console.error(err);
      })
  }

  render() {
    if (!this.props.loggedin) {
      return (
        <div className="auth">
          <div className="auth-inputs">
            <label>Username:</label>
            <input
              name="usernameInput"
              value={this.state.usernameInput}
              onChange={this.handleUsername} />
            <label>Password:</label>
            <input
              type="password"
              name="passwordInput"
              value={this.state.passwordInput}
              onChange={this.handlePassword} />
          </div>
          <div className="auth-buttons">
            <button
              onClick={this.login}
              disabled={this.state.disableButtons}
            >login</button>
            <button
              onClick={this.register}
              disabled={this.state.disableButtons}
            >register</button>
          </div>
        </div>
      )
    } else {
      return (
        <button onClick={this.handleLogout}>
          log out
        </button>
      )
    }
  }

}

export default Auth;
