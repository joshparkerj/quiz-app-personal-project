const fs = require('fs');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/joshquizzes.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/joshquizzes.com/fullchain.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const express = require('express');
const bodyParser = require('body-parser');
const nc = require('./controllers/nodb-controller');
const uc = require('./controllers/user-controller');
const sc = require('./controllers/scrape-controller');
const wc = require('./controllers/wiki-controller');
const sockc = require('./controllers/socket-controller');
const statc = require('./controllers/stats-controller');
const massive = require('massive');
const dotenv = require('dotenv').config();
const session = require('express-session');

const app = express();

const http = require('http').createServer(app);
const https = require('https').createServer(credentials, app);

const socketLib = require('socket.io');
const io = socketLib(http);
const secio = socketLib(https);

const sesh = session({
  secret: process.env.SEC,
  resave: true,
  saveUninitialized: true
});

app.use(bodyParser.json());

massive({
  host: 'localhost',
  port: 5432,
  database: 'qapp',
  user: 'postgres',
  ssl: false,
  poolSize: 10
})
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

app.get('/admin/getcat/:category',wc.getEntireCategory);

app.delete('/admin/delete/:id',wc.deleteWikiQuestion);

app.put('/admin/update/:id',wc.updateWikiQuestion);

app.post('/user', uc.postUser);

app.post('/user-login',uc.authenticateUser);

app.get('/api/auth/me',uc.getApiAuthMe);

app.get('/api/userstats/me',statc.userStats);

app.get('/api/allstats',statc.globalStats);

app.get('/api/userprogress/me',statc.userProgress);

app.get('/api/progressleaderboard',statc.progressLeaderboard);

app.get('/api/similarusers',statc.getSimilarUsers);

app.post('/setgameonsession',nc.setGameOnSession);

app.post('/leavegamesession',nc.leaveGameSession);

app.post('/resetscore', nc.resetScore);

app.post('/api/auth/logout',nc.logout);

app.get('*',nc.getReact);

io.on('connection',sockc.connect);
secio.on('connection',sockc.connect);

http.listen(process.env.PORT || 8080);
https.listen(process.env.SECPORT || 8443);
