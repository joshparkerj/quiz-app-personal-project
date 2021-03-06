const bc = require('./bcrypt-controller');

module.exports = {
  authenticateUser: (req,res,next) => {
    console.log(`Authenticating user: ${req.body.username}`);
    const db = req.app.get('db');
    db.get_hash([
      req.body.username
    ])
      .then(hash => {
        bc.compare(String(req.body.password),hash[0].saltedhashedpassword)
          .then(r => {
            if (r){
              db.login([
                req.body.username
              ])
                .then(user => {
                  req.session.userid = user[0].id;
                  req.session.username = user[0].username;
                  req.session.admin = user[0].privilege_level > 0;
                  user.sessionUserId = req.session.userid;
                  res.status(200).send(user);
                })
                .catch(err => {
                  res.status(500).send('login failed');
                  console.log(err);
                })
            } else {
              res.status(500).send('wrong password');
            }
          })
          .catch(err => {
            res.status(500).send('hash compare failed');
            console.error(err);
          })
      })
      .catch(err => {
        res.status(500).send('password compare failed');
        console.log(err);
      })
  },
  postUser: (req,res,next) => {
    const db = req.app.get('db');
    bc.saltAndHash(String(req.body.password))
      .then(hash => {
        db.post_user([
          req.body.username,
          hash
        ])
          .then(r => {
            res.status(200).send('success! you may now login');})
          .catch(err => {
            res.status(500).send('post user failed');
            console.error(err);})
      })
  },
  getApiAuthMe: (req,res,next) => {
    const db = req.app.get('db');
    db.get_user([req.session.userid])
      .then(r => {
        console.log(`Getting api auth me: ${r}`);
        res.status(200).send(r);
      })
      .catch(err => {
        res.status(500).send('get api auth me failed');
      })
  }
}
