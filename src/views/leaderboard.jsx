import React, { useState, useEffect } from 'react';

import StatsButton from './stats-button';
import { getMyProgress, getProgressLeaderboard } from '../api';
import colSort from '../utils';
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
};

const Leaderboard = function Leaderboard() {
  const [myProgress, setMyProgress] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sorting, setSorting] = useState(sortingInit);

  useEffect(() => {
    getMyProgress()
      .then((r) => {
        mp = r;
        return mp;
      })
      .then((r) => {
        setMyProgress(r);
      });

    getProgressLeaderboard()
      .then((r) => {
        setLeaderboard(r);
      });
  }, []);

  const columnSort = (column, alpha = false) => {
    const { sorting: newSorting, myProgress: newMyProgress } = colSort(columnKeys, column, sorting, sortingInit, myProgress, mp, 'myProgress', alpha);
    setSorting(newSorting);
    setMyProgress(newMyProgress);
  };

  const progressMapper = (e, i) => (
    <tr className="progcat" key={i}>
      {columnKeys.map((f) => <td key={f}>{e[f]}</td>)}
    </tr>
  );

  const overallProgress = () => {
    const op = myProgress.reduce(ap, { x: 0, y: 0 });
    return (
      <tr className="overall-progress">
        <td><strong>Overall Progress:</strong></td>
        <td>{op.x}</td>
        <td>{op.y}</td>
        <td>{(op.avg * 100).toFixed(1)}</td>
      </tr>
    );
  };

  const leaderboardMapper = (e) => (
    <tr className="progress-leader">
      <td>{e.username}</td>
      <td>{e.progress.x}</td>
      <td>{e.progress.y}</td>
      <td>{(e.progress.avg * 100).toFixed(1)}</td>
    </tr>
  );

  return (
    <table className="leaderboard">
      <thead>
        <tr>
          {['Category', 'Correctly Answered', 'Total Questions', 'Percent Answered'].map((e, i) => (
            <th key={e}>
              {e}
              <StatsButton
                column={i}
                columnSort={columnSort}
                sorting={sorting}
                alpha={i === 0 ? true : undefined}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {
          myProgress.length > 0
            ? myProgress.map(progressMapper)
            : ''
        }
        <tr className="end-of-personal-progress" />
        {
          myProgress.length > 0
            ? overallProgress() : ''
        }
        <tr />
        <tr><td><strong>Progress Leaders: </strong></td></tr>
        {
          leaderboard.length > 0
            ? leaderboard.map(leaderboardMapper) : ''
        }
      </tbody>
    </table>
  );
};

export default Leaderboard;
