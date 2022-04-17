const path = require('path');
const debug = require('debug')('nodb-controller');

module.exports = {
  getReact: (_, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  },

  logout: (req, res) => {
    debug(`${req.session.username} logging out now...`);
    req.session.destroy();
    res.status(204).send();
  },

  setGameOnSession: (req, res) => {
    req.session.game = req.body.game;
    res.status(200).send('game set');
  },

  leaveGameSession: (req, res) => {
    delete req.session.game;
    req.session.gamescore = 0;
    res.status(200).send('game deleted');
  },

  resetScore: (req, res) => {
    req.session.gamescore = 0;
    res.status(200).send('score reset');
  },
};
