import React, { lazy, Suspense } from 'react';
import { Route, Switch }         from 'react-router-dom';


const DataHome  = lazy(() => import('./modules/data/DataHome'));
const PlotsHome = lazy(() => import('./modules/plotly/PlotsHome'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/plots" component={PlotsHome} />
        <Route path="/data"  component={DataHome} />
      </Switch>
    </Suspense>
  );
}
