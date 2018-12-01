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

class Auth extends Component{

  constructor(){
    super();
    this.state = {
      usernameInput: '',
      passwordInput: '',
    }
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  }

  login = () => {
    console.log('tryna log in...');
    console.log(this.state.usernameInput);
    console.log(this.state.passwordInput);
    authenticateUser(this.state.usernameInput,this.state.passwordInput)
      .then(r => {
        if(r[0]){
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
  }

  register = () => {
    postUser(this.state.usernameInput,this.state.passwordInput)
      .then(r => {
        console.log(r);
        toast.success('now try logging in');
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

  render(){
    if(!this.props.loggedin){
      return (
        <div className="auth">
          <div className="auth-inputs">
            <label>Username:</label>
            <input
              name="usernameInput"
              value={this.state.usernameInput}
              onChange={this.handleChange} />
            <label>Password:</label>
            <input
              name="passwordInput"
              value={this.state.passwordInput}
              onChange={this.handleChange} />
          </div>
          <div className="auth-buttons">
            <button onClick={this.login}>login</button>
            <button onClick={this.register}>register</button>
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
