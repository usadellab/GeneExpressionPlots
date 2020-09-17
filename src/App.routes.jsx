import React, { lazy, Suspense }        from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


const DataHome = lazy(() => import('./modules/data/Home'));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={DataHome} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}
