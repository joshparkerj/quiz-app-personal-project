const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

const expressServer = require('http').createServer(app);
const io = require('socket.io')(expressServer);

const debug = require('debug');

const nc = require('./controllers/nodb-controller');
const uc = require('./controllers/user-controller');
const sc = require('./controllers/scrape-controller');
const wc = require('./controllers/wiki-controller');
const sockc = require('./controllers/socket-controller');
const statc = require('./controllers/stats-controller');

const sesh = session({
  secret: process.env.SEC,
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true },
});

app.use(cors());
app.use(rateLimit());
app.use(bodyParser.json());
app.use(morgan('dev'));

massive(process.env.DBURI)
  .then((db) => {
    app.set('db', db);
  })
  .catch((err) => {
    debug('index-massiv')(err);
  });

app.use(cookieParser());
app.use(sesh);
app.use(csrf({ cookie: true }));

app.use(express.static('./dist'));

app.get('/questions/mc/new/scrape/:term', sc.scrapeWiki);

app.get('/create-game/:category/:count', wc.createGame);

app.post('/question-answered/:id', wc.questionAnswered);

app.post('/wiki-quiz/submit-choice', wc.checkSubmission);

app.get('/wiki-quiz/categories', wc.getWikiCategories);

app.get('/admin/getcat/:category', wc.getEntireCategory);

app.delete('/admin/delete/:id', wc.deleteWikiQuestion);

app.put('/admin/update/:id', wc.updateWikiQuestion);

app.post('/user', uc.postUser);

app.post('/user-login', uc.authenticateUser);

app.get('/api/auth/me', uc.getApiAuthMe);

app.get('/api/userstats/me', statc.userStats);

app.get('/api/allstats', statc.globalStats);

app.get('/api/userprogress/me', statc.userProgress);

app.get('/api/progressleaderboard', statc.progressLeaderboard);

app.get('/api/similarusers', statc.getSimilarUsers);

app.post('/setgameonsession', nc.setGameOnSession);

app.post('/leavegamesession', nc.leaveGameSession);

app.post('/resetscore', nc.resetScore);

app.post('/api/auth/logout', nc.logout);

app.get('*', nc.getReact);

io.on('connection', sockc.connect);

module.exports = expressServer;
