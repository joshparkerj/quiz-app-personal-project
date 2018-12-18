import React, { Component } from 'react';
import { getMyStats, getAllStats } from '../api';
import { colSort } from '../utils';
import './show-stats.css';

let myStats = [];
let allStats = [];
const sortingInit = ['⇵', '⇵', '⇵', '⇵', '⇵', '⇵', '⇵'];
const columnKeys = ['category', 'attempts', 'right', 'percent',
  'allAttempts', 'allRight', 'allPercent'];

class ShowStats extends Component {

  constructor() {
    super();
    this.state = {
      stats: [],
      sorting: sortingInit
    }
  }

  componentDidMount() {
    getMyStats()
      .then(r => {
        myStats = r;
        return getAllStats();
      })
      .then(r => {
        allStats = r;
        this.setState({
          stats: myStats.map(this.statInitializer)
        })
      })
  }

  statInitializer = e => {
    const all = allStats.find(r => r.category === e.category);
    e.allAttempts = all.attempts;
    e.allRight = all.right;
    e.allPercent = all.percent;
    return e;
  }

  statMapper = (e, i) => {
    return (
      <tr className="statcat" key={i}>
        {columnKeys.map((f, i) => {
          return <td key={i}>{String(e[f]).replace(/_/g,' ')}</td>
        })}
      </tr>
    )
  }

  colSort = (column, alpha = false) => {
    this.setState(colSort(columnKeys, column, this.state.sorting, sortingInit, this.state.stats, myStats.map(this.statInitializer),'stats',alpha));
  }

  render() {
    return (
      <table className="show-stats">
        <tr>
          <th>Category<button onClick={() => this.colSort(0, true)}>
            {this.state.sorting[0]}</button></th>
          <th>Your Attempts<button onClick={() => this.colSort(1)}>
            {this.state.sorting[1]}</button></th>
          <th>Your Right Answers<button onClick={() => this.colSort(2)}>
            {this.state.sorting[2]}</button></th>
          <th>Your Percent Correct<button onClick={() => this.colSort(3)}>
            {this.state.sorting[3]}</button></th>
          <th>All Users' Attempts<button onClick={() => this.colSort(4)}>
            {this.state.sorting[4]}</button></th>
          <th>All Users' Right Answers<button onClick={() => this.colSort(5)}>
            {this.state.sorting[5]}</button></th>
          <th>All Users' Percent Correct<button onClick={() => this.colSort(6)}>
            {this.state.sorting[6]}</button></th>
        </tr>
        {
          this.state.stats.length > 0 ?
            this.state.stats.map(this.statMapper) :
            ''
        }
      </table>
    )
  }
}

export default ShowStats;
