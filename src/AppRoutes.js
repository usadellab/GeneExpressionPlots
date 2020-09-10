import React, { lazy, Suspense } from 'react';
import { Route, Switch }         from "react-router-dom";


const GroupList   = lazy(() => import('./pages/GroupList'));
const GroupWizard = lazy(() => import('./pages/GroupWizard'));

export default function AppRoutes () {

  return (
    <Suspense fallback={ <div>Loading...</div> }>

      <Switch>
        <Route exact path="/" component={ GroupList } />
        <Route path="/wizard" component={ GroupWizard } />
      </Switch>

    </Suspense>
  );
}
