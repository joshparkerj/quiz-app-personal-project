const debug = require('debug')('stats-controller');

const handleResponse = (status, res) => (r) => {
  res.status(status).send(r);
};

const handleError = (message, res) => (err) => {
  res.status(500).send(message);
  debug(err);
};

const ap = (acc, e) => {
  acc.x = Number(e.correctly_answered) + Number(acc.x);
  acc.y = Number(e.questions_total) + Number(acc.y);
  acc.avg = acc.x / acc.y;
  return acc;
};

module.exports = {
  globalStats: (req, res) => {
    const db = req.app.get('db');
    db.get_all_time_stats()
      .then(handleResponse(200, res))
      .catch(handleError('get global stats failed', res));
  },
  userStats: (req, res) => {
    const db = req.app.get('db');
    db.get_all_time_user_stats([req.session.userid])
      .then(handleResponse(200, res))
      .catch(handleError('get user stats failed', res));
  },
  userProgress: (req, res) => {
    const db = req.app.get('db');
    db.get_user_progress([req.session.userid])
      .then(handleResponse(200, res))
      .catch(handleError('get user progress failed', res));
  },
  progressLeaderboard: (req, res) => {
    const db = req.app.get('db');
    db.get_all_users()
      .then((r) => Promise.all(
        r.map((e) => db.get_user_progress([e.id])),
      ))
      .then((r) => r.sort((a, b) => {
        const apr = a.reduce(ap, { x: 0, y: 0 });
        const bpr = b.reduce(ap, { x: 0, y: 0 });
        return bpr.x - apr.x;
      }).map((e) => ({
        username: e[0].username,
        progress: e.reduce(ap, { x: 0, y: 0 }),
      })).slice(0, 10))
      .then(handleResponse(200, res))
      .catch(handleError('get progress leaderboard failed', res));
  },
  getSimilarUsers: (req, res) => {
    const db = req.app.get('db');
    db.get_other_users([req.session.userid])
      .then((r) => Promise.all(
        r.map((e) => db.get_similarity_score([req.session.userid, e.id])),
      ))
      .then((r) => r.map((e) => e[0]).sort((a, b) => b.score - a.score).slice(0, 10))
      .then(handleResponse(200, res))
      .catch((err) => {
        debug(err);
        res.status(204).send('get similar users failed');
      });
  },
};
