import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import debug from 'debug';

import Auth from './views/auth';
import { getApiAuthMe } from './api';

import {
  onWhoAreYou,
  emitWhoAmI,
} from './socket-api';

import 'react-toastify/dist/ReactToastify.min.css';
import './app.css';

import JoinCreate from './views/join-create';
import ShowStats from './views/show-stats';
import Leaderboard from './views/leaderboard';
import SimilarUsers from './views/similar-users';
import Admin from './views/admin';

const App = function App() {
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('games');
  const [loggedin, setLoggedin] = useState(false);
  const [admin, setAdmin] = useState(false);

  const checkAuth = () => {
    getApiAuthMe()
      .then((r) => {
        if (r && r[0]) {
          setUsername(r[0].username);
          setLoggedin(true);
          setAdmin(r[0].privilege_level > 0);
        } else {
          setUsername('');
          setLoggedin(false);
        }
      })
      .catch((err) => {
        debug('app-check-auth-error')(err);
      });
  };

  useEffect(() => {
    checkAuth();

    onWhoAreYou(() => {
      debug('app')('socket id-ing');
      emitWhoAmI(username);
    });
  }, []);

  const displayLoginStatus = () => {
    if (username) {
      return (
        <div className="logged-in">
          Logged in as
          {' '}
          {username}
        </div>
      );
    }

    return (
      <div className="not-logged-in">
        Not currently logged in.
      </div>
    );
  };

  const handleRadio = ({ target }) => {
    setContent(target.value);
  };

  const contentSwitch = {
    games: <JoinCreate username={username} />,
    stats: <ShowStats />,
    board: <Leaderboard />,
    users: <SimilarUsers />,
    admin: <Admin />,
  };

  const showContent = () => (
    <div className="content">
      <div className="radio-tabs" onChange={handleRadio}>
        <label htmlFor="radio-games">
          <input type="radio" name="content" value="games" id="radio-games" />
          Play Game
        </label>
        <label htmlFor="radio-stats">
          <input type="radio" name="content" value="stats" id="radio-stats" />
          See Stats
        </label>
        <label htmlFor="radio-board">
          <input type="radio" name="content" value="board" id="radio-board" />
          Leaderboard
        </label>
        <label htmlFor="radio-users">
          <input type="radio" name="content" value="users" id="radio-users" />
          Similar Users
        </label>
        {admin ? (
          <span>
            <label htmlFor="radio-admin">
              <input type="radio" name="content" value="admin" id="radio-admin" />
              Admin Options
            </label>
          </span>
        ) : ''}
      </div>
      {contentSwitch[content] || "I don't know what to show..."}
    </div>
  );

  return (
    <div className="app">
      <h1>JOSH QUIZZES</h1>
      <ToastContainer />
      <Auth checkAuth={checkAuth} loggedin={loggedin} />
      {displayLoginStatus()}
      {loggedin ? showContent() : ''}
    </div>
  );
};

export default App;
