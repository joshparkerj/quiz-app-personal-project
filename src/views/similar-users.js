import React, { Component } from 'react';
import { getSimilarUsers } from '../api';
import './similar-users.css';

class SimilarUsers extends Component {

  constructor() {
    super();
    this.state = {
      similarUsers: []
    }
  }

  componentDidMount() {
    getSimilarUsers()
      .then(r => {
        this.setState({ similarUsers: r })
      })
  }

  userMapper = (e, i) => {
    return (
      <tr className="user" key={i}>
        <td>{e.username}</td>
        <td>{(e.score * 100).toFixed(1)}</td>
      </tr>
    )
  }

  render() {
    return (
      <table className="similar-users">
        <h2>Similarity score based on having answered the same questions</h2>
        <tr>
          <th>Username</th>
          <th>Similarity Score</th>
        </tr>
        {
          this.state.similarUsers === 'try answering some questions first' ?
            <h1>No similar users available.
            Try answering some quiz questions!</h1> :
            this.state.similarUsers.length > 0 ?
              this.state.similarUsers.map(this.userMapper) :
              ''
        }
      </table>
    )
  }
}

export default SimilarUsers;
