import React, { lazy, Suspense } from 'react';
import { Route, Switch }         from "react-router-dom";


const DataModule = lazy(() => import('./modules/data/Home'));

export default function AppRoutes () {

  return (
    <Suspense fallback={ <div>Loading...</div> }>

      <Switch>
        <Route exact path="/" component={ DataModule } />
      </Switch>

    </Suspense>
  );
}
