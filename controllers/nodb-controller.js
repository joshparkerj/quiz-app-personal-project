const path = require('path');

module.exports = {
  getHealth: (req,res,next) => {
    res.send('seemingly ok');
  },
  getQuip: (req,res,next) => {
    let quip = 'are you sure you want to keep lighting up my life? cause ';
    quip += 'imma bouta make a lampshade out of your skin, since you won\'t be ';
    quip += 'using it once I\'m done with you. ';
    res.send(quip);
  },
  getReact: (req,res,next) => {
    console.log('gotta get react')
    res.sendFile(path.join(__dirname,'../build/index.html'));
  },
  getSession: (req,res,next) => {
    res.send({session: req.session,sessionID: req.sessionID});
  },
  logout: (req,res,next) => {
    req.session.destroy();
    res.status(204).send();
  }
}
