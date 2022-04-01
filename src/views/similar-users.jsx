import React, { useEffect, useState } from 'react';
import { getSimilarUsers } from '../api';
import './similar-users.css';

const SimilarUsers = function SimilarUsers() {
  const [similarUsers, setSimilarUsers] = useState([]);

  useEffect(() => {
    getSimilarUsers()
      .then((r) => {
        setSimilarUsers(r);
      });
  }, []);

  const userMapper = (e, i) => (
    <tr className="user" key={i}>
      <td>{e.username}</td>
      <td>{(e.score * 100).toFixed(1)}</td>
    </tr>
  );

  const tableBody = () => {
    if (similarUsers === 'try answering some questions first') {
      return (
        <tbody>
          <h3>
            No similar users available.
            Try answering some quiz questions!
          </h3>
        </tbody>
      );
    }

    if (similarUsers.length === 0) {
      return <tbody />;
    }

    return (
      <tbody>
        {similarUsers.map(userMapper)}
      </tbody>
    );
  };

  return (
    <table className="similar-users">
      <thead>
        <h2>Similarity score based on having answered the same questions</h2>
        <tr>
          <th>Username</th>
          <th>Similarity Score</th>
        </tr>
      </thead>
      { tableBody() }
    </table>
  );
};

export default SimilarUsers;
