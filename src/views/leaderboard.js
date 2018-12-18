import React, { Component } from 'react';
import { getMyProgress, getProgressLeaderboard } from '../api';

const ap = (acc, e) => {
  acc.x = Number(e.correctly_answered)+Number(acc.x);
  acc.y = Number(e.questions_total)+Number(acc.y);
  acc.avg = acc.x / acc.y;
  return acc;
}

class Leaderboard extends Component {

  constructor() {
    super();
    this.state = {
      myProgress: [],
      leaderboard: []
    }
  }

  componentDidMount() {
    getMyProgress()
      .then(r => {
        this.setState({ myProgress: r })
      })
    getProgressLeaderboard()
      .then(r => {
        this.setState({ leaderboard: r })
      })
  }

  progressMapper = (e, i) => {
    return (
      <tr className="progcat" key={i}>
        <td>{e.category}</td>
        <td>{e.correctly_answered}</td>
        <td>{e.questions_total}</td>
        <td>{e.percent_correctly_answered}</td>
      </tr>
    )
  }

  overallProgress = () => {
    let op = this.state.myProgress.reduce(ap, { x: 0, y: 0 });
    return (
      <tr className="overall-progress">
        <td><strong>Overall Progress:</strong></td>
        <td>{op.x}</td>
        <td>{op.y}</td>
        <td>{(op.avg*100).toFixed(1)}</td>
      </tr>
    )
  }

  leaderboardMapper = (e, i) => {
    return (
      <tr className="progress-leader">
        <td>{e.username}</td>
        <td>{e.progress.x}</td>
        <td>{e.progress.y}</td>
        <td>{(e.progress.avg*100).toFixed(1)}</td>
      </tr>
    )
  }

  render() {
    return (
      <table className="leaderboard">
        <tr>
          <th>Category</th>
          <th>Correctly Answered</th>
          <th>Total Questions</th>
          <th>Percent Answered</th>
        </tr>
        {
          this.state.myProgress.length > 0 ?
            this.state.myProgress.map(this.progressMapper) :
            ''
        }
        <tr></tr>
        {
          this.state.myProgress.length > 0 ?
            this.overallProgress() : ''
        }
        <tr></tr>
        <tr><td><strong>Progress Leaders: </strong></td></tr>
        {
          this.state.leaderboard.length > 0 ?
            this.state.leaderboard.map(this.leaderboardMapper) : ''
        }
      </table>
    )
  }
}

export default Leaderboard;
