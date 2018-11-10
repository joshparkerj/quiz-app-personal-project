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
    res.sendFile(__dirname + '/build/index.html');
  }
}
