const express = require('express');
const bodyParser = require('body-parser');
const nc = require('./controllers/nodb-controller');
const uc = require('./controllers/user-controller');
const sc = require('./controllers/scrape-controller');
const wc = require('./controllers/wiki-controller');
const sockc = require('./controllers/socket-controller');
const massive = require('massive');
const dotenv = require('dotenv').config();
const session = require('express-session');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const sesh = session({
  secret: process.env.SEC,
  resave: true,
  saveUninitialized: true
});

app.use(bodyParser.json());

massive(process.env.DBURI)
  .then(db => {
    app.set('db',db);})
  .catch(err => {
    console.log(err);})

app.use(sesh);

app.use(express.static('./build'));

app.get('/questions/mc/new/scrape/:term',sc.scrapeWiki);

app.get('/create-game/:category/:count',wc.createGame);

app.post('/question-answered/:id',wc.questionAnswered);

app.post('/wiki-quiz/submit-choice',wc.checkSubmission);

app.get('/wiki-quiz/categories',wc.getWikiCategories);

app.post('/user', uc.postUser);

app.post('/user-login',uc.authenticateUser);

app.get('/api/auth/me',uc.getApiAuthMe);

app.post('/setgameonsession',nc.setGameOnSession);

app.post('/api/auth/logout',nc.logout);

app.get('*',nc.getReact);

io.on('connection',sockc.connect);

http.listen(process.env.PORT || 8080);
