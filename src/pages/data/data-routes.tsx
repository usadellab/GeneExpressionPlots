import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import DataFiles from './data-files';
import DataHome from './data-home';

const DataRoutes: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={DataHome} />
      <Route exact path={path + '/files'} component={DataFiles} />
    </Switch>
  );
};

export default DataRoutes;
