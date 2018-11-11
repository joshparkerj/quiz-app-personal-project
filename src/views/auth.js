import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserId } from '../redux/reducer';
import {
  authenticateUser,
  postUser
} from '../api';

class Auth extends Component{

  constructor(){
    super();
    this.state = {
      username: '',
      password: '',
      loggedin: false,
      userid: null
    }
  }

  handleChange = e => {
    this.setState({[e.target.name]: e.target.value});
  }

  login = () => {
    authenticateUser(this.state.username,this.state.password)
      .then(r => {
        console.log(r);
        if(r[0]){
          this.setState({loggedin: true, userid: r[0].id});
          this.props.setUserId(this.state.userid);
        } else {
          console.log('try again');
        }
      })
  }

  register = () => {
    postUser(this.state.username,this.state.password)
      .then(r => {
        console.log(r);
        console.log('now try logging in');
      })
  }

  render(){
    if(!this.state.loggedin){
      return (
        <div className="auth">
          <div className="auth-inputs">
            <label>Username:</label>
            <input
              name="username"
              value={this.state.username}
              onChange={this.handleChange} />
            <label>Password:</label>
            <input
              name="password"
              value={this.state.password}
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
        <button onClick={() => this.setState({loggedin: false, userid: null})}>
          log out
        </button>
      )
    }
  }

}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = {
  setUserId
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
