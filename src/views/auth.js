import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserId,loginInfo } from '../redux/reducer';
import {
  authenticateUser,
  postUser,
  logout
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
          this.props.setUserId(r[0].id);
          this.props.loginInfo(r[0].username,r[0].profile_pic);
          this.setState({
            username: '',
            password: '',
            loggedin: true,
            userid: r[0].id
          });
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

  handleLogout = () => {
    logout()
      .then(r => {
        this.props.setUserId(null);
        this.props.loginInfo('','');
        this.setState({loggedin: false, userid: null});
      })
      .catch(err => {
        console.error(err);
      })
  }

  render(){
    if(!this.props.username){
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
        <button onClick={this.handleLogout}>
          log out
        </button>
      )
    }
  }

}

const mapStateToProps = state => {
  return {
    username: state.username,
    profile_pic: state.profile_pic,
    user_id: state.user_id
  }
}

const mapDispatchToProps = {
  setUserId,
  loginInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
