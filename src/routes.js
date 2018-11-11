import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Admin from './views/admin/admin';
import Splash from './views/splash';
import Quiz from './views/quiz/quiz';

export default function Routes(props){
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/quiz" component={Quiz} />
      <Route exact path="/" component={Splash} />
    </Switch>
  )
}
