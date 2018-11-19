import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import JoinCreate from './views/join-create';
import Admin from './views/admin/admin';
import Splash from './views/splash';
import Quiz from './views/quiz/quiz';
import MultipleChoice from './views/mc/multiple-choice';
import WikiQuiz from './views/wiki/wiki-quiz';

export default function Routes(props){
  return (
    <div className="routes">
      <Link to="/admin">Administrator page</Link>
      <Link to="/quiz">Quiz page</Link>
      <Link to="/mc">Multiple Choice Quiz</Link>
      <Link to="/wiki">Questions from Wikipedia</Link>
      <Link to="/games">Join or Create a Game</Link>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/mc" component={MultipleChoice} />
        <Route path="/wiki" component={WikiQuiz} />
        <Route path="/games" component={JoinCreate} />
        <Route exact path="/" component={Splash} />
      </Switch>
    </div>
  )
}
