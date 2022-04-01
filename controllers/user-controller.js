const debug = require('debug')('user-controller');
const bc = require('./bcrypt-controller');

module.exports = {
  authenticateUser: (req, res) => {
    debug(`Authenticating user: ${req.body.username}`);
    const db = req.app.get('db');
    db.get_hash([
      req.body.username,
    ])
      .then((hash) => {
        bc.compare(String(req.body.password), hash[0].saltedhashedpassword)
          .then((r) => {
            if (r) {
              db.login([
                req.body.username,
              ])
                .then((user) => {
                  req.session.userid = user[0].id;
                  req.session.username = user[0].username;
                  req.session.admin = user[0].privilege_level > 0;
                  res.status(200).send({ ...user, sessionUserId: req.session.userid });
                })
                .catch((err) => {
                  res.status(500).send('login failed');
                  debug(err);
                });
            } else {
              res.status(500).send('wrong password');
            }
          })
          .catch((err) => {
            res.status(500).send('hash compare failed');
            debug(err);
          });
      })
      .catch((err) => {
        res.status(500).send('password compare failed');
        debug(err);
      });
  },
  postUser: (req, res) => {
    const db = req.app.get('db');
    bc.saltAndHash(String(req.body.password))
      .then((hash) => {
        db.post_user([
          req.body.username,
          hash,
        ])
          .then(() => {
            res.status(200).send('success! you may now login');
          })
          .catch((err) => {
            res.status(500).send('post user failed');
            debug(err);
          });
      });
  },
  getApiAuthMe: (req, res) => {
    const db = req.app.get('db');
    db.get_user([req.session.userid])
      .then((r) => {
        debug(`Getting api auth me: ${r}`);
        res.status(200).send(r);
      })
      .catch(() => {
        res.status(500).send('get api auth me failed');
      });
  },
};
