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
        <div className="radio-tabs" onChange={this.handleRadio}>
          <input type="radio" name="content" value="games" id="radio-games" />
          <label for="radio-games">Play Game</label>
          <input type="radio" name="content" value="stats" id="radio-stats" />
          <label for="radio-stats">See Stats</label>
          <input type="radio" name="content" value="board" id="radio-board" />
          <label for="radio-board">Leaderboard</label>
          <input type="radio" name="content" value="users" id="radio-users" />
          <label for="radio-users">Similar Users</label>
          {this.state.admin ? (
            <span>
              <input type="radio" name="content" value="admin" id="radio-admin" />
              <label for="radio-admin">Admin Options</label>
            </span>
          ) : ''}
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
                  this.state.content === 'admin' ?
                    <Admin /> :
                    "I don't know what to show..."
        }
      </div>
    )
  }

  handleRadio = e => {
    this.setState({ content: e.target.value });
  }

  render() {
    return (
      <div className="app">
        <ToastContainer />
        <Auth checkAuth={this.checkAuth} loggedin={this.state.loggedin} />
        {this.displayLoginStatus()}
        {this.state.loggedin ? this.showContent() : ''}
      </div>
    )
  }
}

export default App;
