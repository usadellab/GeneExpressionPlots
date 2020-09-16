import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

const defaultHome = lazy(() => import('./modules/default/Home'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={defaultHome} />
      </Switch>
    </Suspense>
  );
}
