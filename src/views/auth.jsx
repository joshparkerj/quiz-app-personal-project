import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import debug from 'debug';

import {
  authenticateUser,
  postUser,
  logout,
} from '../api';

import {
  emitLogIn,
} from '../socket-api';

import './auth.css';

const Auth = function Auth({ checkAuth, loggedin }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [disableButtons, setDisableButtons] = useState(true);

  const handleUsername = ({ target }) => {
    setUsernameInput(target.value);
    setDisableButtons(target.value.length === 0 || passwordInput.length === 0);
  };

  const handlePassword = ({ target }) => {
    setPasswordInput(target.value);
    setDisableButtons(target.value.length === 0 || usernameInput.length === 0);
  };

  const login = () => {
    authenticateUser(usernameInput, passwordInput)
      .then((r) => {
        if (r[0]) {
          checkAuth();
          emitLogIn(usernameInput);
          setUsernameInput('');
          setPasswordInput('');
        } else {
          toast.warn('try again');
        }
      })
      .catch(() => {
        toast.warn('try again');
      });
  };

  const register = () => {
    postUser(usernameInput, passwordInput)
      .then((r) => {
        debug('auth-register')(r);
        if (r === 'success! you may now login') {
          toast.success('now try logging in');
        } else {
          toast.error('username not available');
        }
      });
  };

  const handleLogout = () => {
    logout()
      .then(() => {
        checkAuth();
      })
      .catch((err) => {
        debug('auth-logout-error')(err);
      });
  };

  if (!loggedin) {
    return (
      <div className="auth">
        <label htmlFor="usernameInput">
          Username:
          <input
            name="usernameInput"
            id="usernameInput"
            value={usernameInput}
            onChange={handleUsername}
          />
        </label>
        <label htmlFor="passwordInput">
          Password:
          <input
            type="password"
            name="passwordInput"
            id="passwordInput"
            value={passwordInput}
            onChange={handlePassword}
          />
        </label>
        <span />
        <button
          type="button"
          onClick={login}
          disabled={disableButtons}
        >
          login
        </button>
        <button
          type="button"
          onClick={register}
          disabled={disableButtons}
        >
          register
        </button>
      </div>
    );
  }

  return (
    <button type="button" onClick={handleLogout}>
      log out
    </button>
  );
};

Auth.propTypes = {
  checkAuth: PropTypes.func.isRequired,
  loggedin: PropTypes.bool.isRequired,
};

export default Auth;
