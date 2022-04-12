import React, { useState, useEffect } from 'react';

import StatsButton from './stats-button';
import { getMyStats, getAllStats } from '../api';
import colSort from '../utils';
import './show-stats.css';

let myStats = [];
let allStats = [];
const sortingInit = ['⇵', '⇵', '⇵', '⇵', '⇵', '⇵', '⇵'];
const columnKeys = ['category', 'attempts', 'right', 'percent',
  'allAttempts', 'allRight', 'allPercent'];

const ShowStats = function ShowStats() {
  const [stats, setStats] = useState([]);
  const [sorting, setSorting] = useState(sortingInit);

  const statInitializer = (e) => {
    const all = allStats.find((r) => r.category === e.category);
    e.allAttempts = all.attempts;
    e.allRight = all.right;
    e.allPercent = all.percent;
    return e;
  };

  useEffect(() => {
    getMyStats()
      .then((r) => {
        myStats = r;
        return getAllStats();
      })
      .then((r) => {
        allStats = r;
        setStats(myStats.map(statInitializer));
      });
  }, []);

  const statMapper = (e, i) => (
    <tr className="statcat" key={i}>
      {columnKeys.map((f) => <td key={f}>{String(e[f]).replace(/_/g, ' ')}</td>)}
    </tr>
  );

  const columnSort = (column, alpha = false) => {
    const { sorting: newSorting, stats: newStats } = colSort(columnKeys, column, sorting, sortingInit, stats, myStats.map(statInitializer), 'stats', alpha);
    setSorting(newSorting);
    setStats(newStats);
  };

  return (
    <table className="show-stats">
      <thead>
        <tr>
          {['Category', 'Your Attempts', 'Your Right Answers', 'Your Percent Correct', 'All Users&apos; Attempts', 'All Users&apos; Right Answers', 'All Users&apos; Percent Correct'].map((e, i) => (
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
          stats.length > 0
            ? stats.map(statMapper)
            : (<tr />)
        }
      </tbody>
    </table>
  );
};

export default ShowStats;
