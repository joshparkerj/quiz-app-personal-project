import React, { Component } from 'react';
import './app.css';
import Routes from './routes';
import { Link } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <div className="app">
        <Link to="/admin">Administrator page</Link>
        <Link to="/quiz">Quiz page</Link>
        <Routes />
      </div>
    )
  }

}

export default App;
