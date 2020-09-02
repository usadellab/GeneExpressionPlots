import React, { lazy, Suspense } from 'react';
import { Route, Switch }         from "react-router-dom";


export default function AppRoutes () {

  return (
    <Suspense fallback={ <div>Loading...</div> }>

      <Switch>
        <Route exact path="/" component={ () => <div></div> } />
      </Switch>

    </Suspense>
  );
}
