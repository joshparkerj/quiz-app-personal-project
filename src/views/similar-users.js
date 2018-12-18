import React, { Component } from 'react';
import { getSimilarUsers } from '../api';

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
        <td>{e.score}</td>
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
          this.state.similarUsers.length > 0 ?
            this.state.similarUsers.map(this.userMapper) :
            ''
        }
      </table>
    )
  }
}

export default SimilarUsers;
