import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import DataFiles from './data-files';

const DataRoutes: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={DataFiles} />
    </Switch>
  );
};

export default DataRoutes;
