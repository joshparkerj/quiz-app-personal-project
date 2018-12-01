import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { onSocketQuery } from './socket-api.js';

ReactDOM.render(
  <App osq={onSocketQuery} />
  , document.getElementById('root')
);
