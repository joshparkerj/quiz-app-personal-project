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
    console.log(`${req.session.username} logging out now...`);
    req.session.destroy();
    res.status(204).send();
  },
  setGameOnSession: (req,res,next) => {
    req.session.game = req.body.game;
    res.status(200).send('game set');
  }
}
