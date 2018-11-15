import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import Admin from './views/admin/admin';
import Splash from './views/splash';
import Quiz from './views/quiz/quiz';
import MultipleChoice from './views/mc/multiple-choice';

export default function Routes(props){
  return (
    <div className="routes">
      <Link to="/admin">Administrator page</Link>
      <Link to="/quiz">Quiz page</Link>
      <Link to="/mc">Multiple Choice Quiz</Link>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/mc" component={MultipleChoice} />
        <Route exact path="/" component={Splash} />
      </Switch>
    </div>
  )
}
