import React, { Component } from 'react';
import { getMyProgress, getProgressLeaderboard } from '../api';
import { colSort } from '../utils';
import './leaderboard.css';

let mp = [];
const sortingInit = ['⇵', '⇵', '⇵', '⇵'];
const columnKeys = ['category', 'correctly_answered',
  'questions_total', 'percent_correctly_answered'];
const ap = (acc, e) => {
  acc.x = Number(e.correctly_answered) + Number(acc.x);
  acc.y = Number(e.questions_total) + Number(acc.y);
  acc.avg = acc.x / acc.y;
  return acc;
}

class Leaderboard extends Component {

  constructor() {
    super();
    this.state = {
      myProgress: [],
      leaderboard: [],
      sorting: sortingInit
    }
  }

  componentDidMount() {
    getMyProgress()
      .then(r => {
        mp = r;
        return mp;
      })
      .then(r => {
        this.setState({ myProgress: r })
      })
    getProgressLeaderboard()
      .then(r => {
        this.setState({ leaderboard: r })
      })
  }

  colSort = (column, alpha = false) => {
    this.setState(colSort(columnKeys, column, this.state.sorting, sortingInit, this.state.myProgress, mp, 'myProgress', alpha))
  }

  progressMapper = (e, i) => {
    return (
      <tr className="progcat" key={i}>
        {columnKeys.map((f, i) => {
          return <td key={i}>{e[f]}</td>
        })}
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
        <td>{(op.avg * 100).toFixed(1)}</td>
      </tr>
    )
  }

  leaderboardMapper = (e, i) => {
    return (
      <tr className="progress-leader">
        <td>{e.username}</td>
        <td>{e.progress.x}</td>
        <td>{e.progress.y}</td>
        <td>{(e.progress.avg * 100).toFixed(1)}</td>
      </tr>
    )
  }

  render() {
    return (
      <table className="leaderboard">
        <tr>
          <th>Category<button onClick={() => this.colSort(0, true)}>
            {this.state.sorting[0]}</button></th>
          <th>Correctly Answered<button onClick={() => this.colSort(1)}>
            {this.state.sorting[1]}</button></th>
          <th>Total Questions<button onClick={() => this.colSort(2)}>
            {this.state.sorting[2]}</button></th>
          <th>Percent Answered<button onClick={() => this.colSort(3)}>
            {this.state.sorting[3]}</button></th>
        </tr>
        {
          this.state.myProgress.length > 0 ?
            this.state.myProgress.map(this.progressMapper) :
            ''
        }
        <tr className="end-of-personal-progress"></tr>
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
