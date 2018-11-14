const path = require('path');

module.exports = {
  getHealth: (req,res,next) => {
    res.send('seemingly ok');
  },
  getReact: (req,res,next) => {
    res.sendFile(path.join(__dirname,'../build/index.html'));
  },
  getSession: (req,res,next) => {
    res.send({
      session: req.session,
      sessionID: req.sessionID,
      user: req.session.userid
    });
  },
  logout: (req,res,next) => {
    console.log('logging out now...');
    req.session.destroy();
    res.status(204).send();
  }
}
