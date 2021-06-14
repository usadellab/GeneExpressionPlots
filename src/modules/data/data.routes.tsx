import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import DataLayout from '@/layouts/data-layout';
import DataView from './pages/DataView';

const DataRoutes: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <DataLayout>
      <Switch>
        <Route exact path={path} component={DataView} />
      </Switch>
    </DataLayout>
  );
};

export default DataRoutes;
