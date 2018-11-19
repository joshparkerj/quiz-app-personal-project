import React, { Component } from 'react';
import './app.css';
import Routes from './routes';
import Auth from './views/auth';
import { getApiAuthMe,getSession } from './api';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class App extends Component {

  constructor(){
    super();
    this.state = {
      username: '',
      profile_pic: '',
      loggedin: false
    }
  }

  componentDidMount(){
    this.checkAuth()
  }

  checkAuth = () => {
    getApiAuthMe()
      .then(r => {
        if (r && r[0]){
          this.setState({
            username: r[0].username,
            profile_pic: r[0].profile_pic,
            loggedin: true})
        } else {
          this.setState({username: '', profile_pic: '', loggedin: false});
        }
      })
      .catch(err => {
        console.error(err);
      })
  }

  displayLoginStatus = () => {
    if (this.state.username){
      return(
        <div className="logged-in">
          Logged in as {this.state.username}
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
        <Auth checkAuth={this.checkAuth} loggedin={this.state.loggedin} />
        {this.displayLoginStatus()}
        <button onClick={this.handleSession}>
          See session info.
        </button>
        {this.state.loggedin ? <Routes /> : ''}
      </div>
    )
  }

}

export default App;
