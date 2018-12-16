const r = (status, res) => {
  return r => {
    res.status(status).send(r);
  }
}

const err = (message, res) => {
  return err => {
    res.status(500).send(message);
    console.log(err);
  }
}

module.exports = {
  globalStats: (req,res,next) => {
    const db = req.app.get('db');
    db.get_all_time_stats()
      .then(r(200,res))
      .catch(err('get global stats failed', res))
  },
  userStats: (req,res,next) => {
    const db = req.app.get('db');
    db.get_all_time_user_stats([req.session.userid])
      .then(r(200,res))
      .catch(err('get user stats failed',res))
  }
}
