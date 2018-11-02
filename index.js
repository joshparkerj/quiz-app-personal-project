const express = require('express');
const app = express();

app.get('/health', (req,res) => {
  res.send('ok');
})

app.get('/quip', (req,res) => {
  let quip = 'are you sure you want to keep lighting up my life? cause ';
  quip += 'imma bouta make a lampshade out of your skin, since you won\'t be ';
  quip += 'using it once I\'m done with you. ';
  res.send(quip);
})

app.listen(8080);