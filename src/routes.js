import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Admin from './views/admin/admin';
import Splash from './views/splash';
import Quiz from './views/quiz/quiz';
import MultipleChoice from './views/mc/multiple-choice';

export default function Routes(props){
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/mc" component={MultipleChoice} />
      <Route exact path="/" component={Splash} />
    </Switch>
  )
}
