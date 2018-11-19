const bc = require('./bcrypt-controller');

module.exports = {
  authenticateUser: (req,res,next) => {
    console.log('tryna authenticate user...');
    console.log(req.body.username);
    console.log(req.body.password);
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
  getUsers: (req,res,next) => {
    const db = req.app.get('db');
    db.get_users()
      .then(r => {
        res.status(200).send(r);
      })
      .catch(err => {
        res.status(500).send('get users failed');
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
  getUser: (req,res,next) => {
    const db = req.app.get('db');
    db.get_user([req.params.id])
      .then(r => {
        let f = r.length;
        res.status(f ? 200 : 404).send(f ? r : 'nothing found')})
      .catch(err => {
        res.status(500).send('get user failed');
        console.log(err);})
  },
  deleteUser: (req,res,next) => {
    const db = req.app.get('db');
    db.get_user([req.params.id])
      .then(r => {
        if (!r.length){
          res.status(404).send('no user to delete');
        }else{
          db.delete_user([req.params.id])
            .then(r => {
              res.status(200).send('user deleted');})
            .catch(err => {
              res.status(500).send('delete user failed');
              console.log(err);})}})
      .catch(err => {
        res.status(500).send('get user failed, no delete attempted');
        console.log(err);})
  },
  getApiAuthMe: (req,res,next) => {
    console.log('tryna get api auth me...');
    console.log(req.session.userid);
    const db = req.app.get('db');
    db.get_user([req.session.userid])
      .then(r => {
        console.log(r);
        res.status(200).send(r);
      })
      .catch(err => {
        res.status(500).send('get api auth me failed');
      })
  }
}
