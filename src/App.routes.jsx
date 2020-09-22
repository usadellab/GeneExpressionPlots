import React, { lazy, Suspense }        from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


const DataHome  = lazy(() => import('./modules/data/Home'));
const PlotsHome = lazy(() => import('./modules/plotly/PlotsHome'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={PlotsHome} />
          <Route path="/data"   component={DataHome} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}
