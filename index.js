const express = require('express');
const bodyParser = require('body-parser');
const nc = require('./controllers/nodb-controller');
const qc = require('./controllers/question-controller');
const uc = require('./controllers/user-controller');
const quipc = require('./controllers/quip-controller');
const mc = require('./controllers/mc-controller');
const sc = require('./controllers/scrape-controller');
const massive = require('massive');
const dotenv = require('dotenv').config();
const cors = require('cors');
const session = require('express-session');

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: ['http://localhost:3000']}));

massive(process.env.DBURI)
  .then(db => {
    app.set('db',db);})
  .catch(err => {
    console.log(err);})

app.use(session({
  secret: process.env.SEC,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static('./build'));

app.get('/questions', qc.getQuestions);

app.post('/question', qc.addQuestion);

app.get('/question/:id', qc.getQuestion);

app.delete('/question/:id', qc.deleteQuestion);

app.get('/quiz/questions', qc.getQuizQuestions);

app.get('/quiz/question/:id', qc.getQuizQuestion);

app.post('/quiz/response', qc.checkQuizResponse);

app.get('/mc-quiz/new-question',mc.getUnansweredMultipleChoiceQuestion);

app.post('/mc-quiz/submit-choice',mc.checkSubmission);

app.get('/questions/mc/new/scrape/:term',sc.scrapeWiki);

app.get('/users', uc.getUsers);

app.post('/user', uc.postUser);

app.get('/user/:id', uc.getUser);

app.delete('/user/:id', uc.deleteUser);

app.post('/user-login',uc.authenticateUser);

app.get('/api/auth/me',uc.getApiAuthMe);

app.get('/session',nc.getSession);

app.post('/logout',nc.logout);

app.post('/api/auth/logout',nc.logout);

app.get('/health', nc.getHealth);

app.get('/quip', quipc.getQuip);

app.get('*',nc.getReact);

app.listen(process.env.PORT || 8080);
