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
import ShowStats from './views/show-stats';
import Leaderboard from './views/leaderboard';
import SimilarUsers from './views/similar-users';
import Admin from './views/admin';

class App extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      profile_pic: '',
      content: 'games',
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

  showContent = () => {
    return (
      <div className="content">
        <div onChange={this.handleRadio}>
          <input type="radio" name="content" value="games" /> Play Game
          <input type="radio" name="content" value="stats" /> See Stats
          <input type="radio" name="content" value="board" /> Leaderboard
          <input type="radio" name="content" value="users" /> Similar Users
        </div>
        {
          this.state.content === 'games' ?
            <JoinCreate username={this.state.username} /> :
            this.state.content === 'stats' ?
              <ShowStats /> :
              this.state.content === 'board' ?
                <Leaderboard /> :
                this.state.content === 'users' ?
                  <SimilarUsers /> :
                  "I don't know what to show..."
        }
      </div>
    )
  }

  handleRadio = e => {
    this.setState({ content: e.target.value });
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
        {this.state.loggedin ? this.showContent() : ''}
        {this.state.admin ? this.showAdmin() : ''}
      </div>
    )
  }
}

export default App;
