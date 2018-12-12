const path = require('path');

module.exports = {
  getReact: (req,res,next) => {
    res.sendFile(path.join(__dirname,'../build/index.html'));
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
