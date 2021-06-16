import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import DataPage from './data-home';
import FilesPage from './data-files';

const DataRoutes: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={DataPage} />
      <Route exact path={path + '/files'} component={FilesPage} />
    </Switch>
  );
};

export default DataRoutes;
