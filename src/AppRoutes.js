import React, { lazy, Suspense } from 'react';
import { Route, Switch }         from "react-router-dom";


const GroupList   = lazy(() => import('./views/GroupList'));

export default function AppRoutes () {

  return (
    <Suspense fallback={ <div>Loading...</div> }>

      <Switch>
        <Route exact path="/" component={ GroupList } />
      </Switch>

    </Suspense>
  );
}
