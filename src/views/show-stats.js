import React, { Component } from 'react';
import { getMyStats, getAllStats } from '../api';

class ShowStats extends Component {

  constructor() {
    super();
    this.state = {
      myStats: [],
      allStats: []
    }
  }

  componentDidMount() {
    getMyStats()
      .then(r => {
        this.setState({ myStats: r })
      })
    getAllStats()
      .then(r => {
        this.setState({ allStats: r })
      })
  }

  statMapper = (e, i) => {
    const asr = this.state.allStats.find(r => r.category === e.category);
    return (
      <tr className="statcat" key={i}>
        <td>{e.category}</td>
        <td>{e.attempts}</td>
        <td>{e.right}</td>
        <td>{e.percent}</td>
        <td>{asr.attempts}</td>
        <td>{asr.right}</td>
        <td>{asr.percent}</td>
      </tr>
    )
  }

  render() {
    return (
      <table className="show-stats">
        <tr>
          <th>Category</th>
          <th>Your Attempts</th>
          <th>Your Right Answers</th>
          <th>Your Percent Correct</th>
          <th>All Users' Attempts</th>
          <th>All Users' Right Answers</th>
          <th>All Users' Percent Correct</th>
        </tr>
        {
          this.state.allStats.length > 0 ?
          this.state.myStats.map(this.statMapper) :
          ''
        }
      </table>
    )
  }
}

export default ShowStats;
