import React, { Component } from 'react';
import './app.css';
import Auth from './views/auth';
import Splash from './views/splash';
import { getApiAuthMe, getSession } from './api';
import {
  emitSocketQuery,
  onSocketQuery,
  onWhoAreYou,
  emitWhoAmI
} from './socket-api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Nav from './nav';
// Components linked through Nav:
import JoinCreate from './views/join-create';
import Quiz from './views/quiz/quiz';
import MultiWiki from './views/multi-wiki/multi-wiki';
import MultipleChoice from './views/mc/multiple-choice';
import Admin from './views/admin/admin';

class App extends Component {

  constructor() {
    super();
    this.state = {
      username: '',
      profile_pic: '',
      loggedin: false,
      admin: false,
      navSelection: null
    }
  }

  componentDidMount() {
    this.checkAuth();
    onSocketQuery(response => {
      console.log(response);
      toast.success(`socket nickname is: ${response[0]}`);
    })
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

  handleSession = () => {
    getSession()
      .then(r => {
        if (r.user) {
          toast.success(`You're logged in! User ID: ${r.user}`)
        } else {
          toast.warn(`Not logged in! Session ID: ${r.sessionID}`)
        }
      })
      .catch(err => {
        console.error(err);
      })
  }

  handleSocket = () => {
    emitSocketQuery()
  }

  handleClick = selection => {
    console.log(`button clicked: ${selection}`);
    this.setState({ navSelection: selection });
  }

  renderNavSelection = () => {
    if (this.state.navSelection === 'join-create') {
      return <JoinCreate username={this.state.username} />
    } else if (this.state.navSelection === 'quiz') {
      return <Quiz />
    } else if (this.state.navSelection === 'multi-wiki') {
      return <MultiWiki />
    } else if (this.state.navSelection === 'mc') {
      return <MultipleChoice />
    } else if (this.state.navSelection === 'admin') {
      return <Admin />
    } else {
      return <Splash />
    }
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
        <button onClick={this.handleSocket}>
          See socket info.
        </button>
        <button onClick={() => console.log(this.state)}>
          Console Log App State
        </button>
        <Nav
          loggedIn={this.state.loggedin}
          admin={this.state.admin}
          hc={this.handleClick} />
        {this.state.loggedin ? this.renderNavSelection() : <Splash />}
      </div>
    )
  }
}

export default App;
