import React, { Component } from 'react';
import './app.css';
import Routes from './routes';
import { Link } from 'react-router-dom';
import { getApiAuthMe,getSession } from './api';
import { connect } from 'react-redux';
import { loginInfo } from './redux/reducer';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class App extends Component {

  componentDidMount(){
    console.log('app did mount');
    getApiAuthMe()
      .then(r => {
        console.log('got api auth me');
        console.log(r);
        console.log(r[0]);
        if (r && r[0]){
          console.log('tryna store login info...');
          console.log(r[0].username);
          console.log(r[0].profile_pic);
          this.props.loginInfo(
            r[0].username,
            r[0].profile_pic)
        } else {
          this.props.loginInfo('','');
        }
      })
      .catch(err => {
        console.error(err);
      })
  }

  displayLoginStatus(){
    if (this.props.username){
      return(
        <div className="logged-in">
          Logged in as {this.props.username}
        </div>
      )
    } else {
      return (
        <div className="not-logged-in">
          Not currently logged in.
        </div>
      )
    }
  }

  handleSession = () => {
    getSession()
      .then(r => {
        console.log(r);
        if (r.user){
          toast.success(`You're logged in! User ID: ${r.user}`)
        }else{
          toast.warn(`Not logged in! Session ID: ${r.sessionID}`)
        }
      })
      .catch(err => {
        console.error(err);
      })
  }

  render() {
    return (
      <div className="app">
        <ToastContainer />
        {this.displayLoginStatus()}
        <button onClick={this.handleSession}>
          See session info.
        </button>
        <Link to="/admin">Administrator page</Link>
        <Link to="/quiz">Quiz page</Link>
        <Routes />
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    username: state.username,
    profile_pic: state.profile_pic
  }
}

const mapDispatchToProps = {
  loginInfo
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
