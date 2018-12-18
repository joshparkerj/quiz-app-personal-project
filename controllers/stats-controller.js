const r = (status, res) => {
  return r => {
    res.status(status).send(r);
  }
}

const err = (message, res) => {
  return err => {
    res.status(400).send(message);
    console.log(err);
  }
}

const ap = (acc, e) => {
  acc.x = Number(e.correctly_answered) + Number(acc.x);
  acc.y = Number(e.questions_total) + Number(acc.y);
  acc.avg = acc.x / acc.y;
  return acc;
}

module.exports = {
  globalStats: (req, res, next) => {
    const db = req.app.get('db');
    db.get_all_time_stats()
      .then(r(200, res))
      .catch(err('get global stats failed', res))
  },
  userStats: (req, res, next) => {
    const db = req.app.get('db');
    db.get_all_time_user_stats([req.session.userid])
      .then(r(200, res))
      .catch(err('get user stats failed', res))
  },
  userProgress: (req, res, next) => {
    const db = req.app.get('db');
    db.get_user_progress([req.session.userid])
      .then(r(200, res))
      .catch(err('get user progress failed', res))
  },
  progressLeaderboard: (req, res, next) => {
    const db = req.app.get('db');
    db.get_all_users()
      .then(r => {
        return Promise.all(
          r.map(e => {
            return db.get_user_progress([e.id]);
          })
        )
      })
      .then(r => {
        return r.sort((a, b) => {
          let apr = a.reduce(ap, {x:0,y:0});
          let bpr = b.reduce(ap, {x:0,y:0});
          return bpr.x - apr.x;
        }).map(e => {
          return {
            username: e[0].username,
            progress: e.reduce(ap, { x: 0, y: 0 })
          };
        }).slice(0, 10);
      })
      .then(r(200, res))
      .catch(err('get progress leaderboard failed', res))
  },
  getSimilarUsers: (req,res,next) => {
    const db = req.app.get('db');
    db.get_other_users([req.session.userid])
      .then(r => {
        return Promise.all(
          r.map(e => {
            return db.get_similarity_score([req.session.userid,e.id])
          })
        )
      })
      .then(r => {
        return r.map(e=>e[0]).sort((a,b) => b.score - a.score).slice(0,10);
      })
      .then(r(200,res))
      .catch(err('get similar users failed',res))
  }
}
