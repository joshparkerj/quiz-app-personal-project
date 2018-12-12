import React, { Component } from 'react';
import './app.css';
import Auth from './views/auth';
import { getApiAuthMe } from './api';
import {
  onWhoAreYou,
  emitWhoAmI
} from './socket-api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import JoinCreate from './views/join-create';
import Admin from './views/admin';

class App extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      profile_pic: '',
      loggedin: false,
      admin: false,
    }
  }

  componentDidMount() {
    this.checkAuth();
    onWhoAreYou(() => {
      console.log('socket id-ing');
      emitWhoAmI(this.state.username);
    })
  }

  checkAuth = () => {
    getApiAuthMe()
      .then(r => {
        if (r && r[0]) {
          this.setState({
            username: r[0].username,
            profile_pic: r[0].profile_pic,
            loggedin: true,
            admin: r[0].privilege_level > 0
          })
        } else {
          this.setState({ username: '', profile_pic: '', loggedin: false });
        }
      })
      .catch(err => {
        console.error(err);
      })
  }

  displayLoginStatus = () => {
    if (this.state.username) {
      return (
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

  showGame = () => {
    return <JoinCreate username={this.state.username} />
  }

  showAdmin = () => {
    return <Admin />
  }

  render() {
    return (
      <div className="app">
        <ToastContainer />
        <Auth checkAuth={this.checkAuth} loggedin={this.state.loggedin} />
        {this.displayLoginStatus()}
        {this.state.loggedin ? this.showGame() : ''}
        {this.state.admin ? this.showAdmin() : ''}
      </div>
    )
  }
}

export default App;
