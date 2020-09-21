import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

// const defaultHome = lazy(() => import('./modules/default/Home'));
const plotly = lazy(() => import('./modules/plotly/Plotly'));
// import plotly from './modules/plotly/Plotly';


export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        {/* <Route exact path="/" component={defaultHome} /> */}
        <Route exact path="/" component={plotly} />
      </Switch>
    </Suspense>
  );
}
