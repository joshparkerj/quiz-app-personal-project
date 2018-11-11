const express = require('express');
const bodyParser = require('body-parser');
const nc = require('./controllers/nodb-controller');
const qc = require('./controllers/question-controller');
const uc = require('./controllers/user-controller');
const massive = require('massive');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: ['http://localhost:3000']}));

massive(process.env.DBURI)
  .then(db => {
    app.set('db',db);})
  .catch(err => {
    console.log(err);})

app.use(express.static('./build'));

app.get('/questions', qc.getQuestions);

app.post('/question', qc.addQuestion);

app.get('/question/:id', qc.getQuestion);

app.delete('/question/:id', qc.deleteQuestion);

app.get('/quiz/questions', qc.getQuizQuestions);

app.get('/quiz/question/:id', qc.getQuizQuestion);

app.post('/quiz/response', qc.checkQuizResponse);

app.get('/users', uc.getUsers);

app.post('/user', uc.postUser);

app.get('/user/:id', uc.getUser);

app.delete('/user/:id', uc.deleteUser);

app.post('/user-login',uc.authenticateUser);

app.get('/health', nc.getHealth);

app.get('/quip', nc.getQuip);

app.get('*',nc.getReact);

app.listen(process.env.PORT || 8080);
