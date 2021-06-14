import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import DataLayout from '@/layouts/data-layout';
import DataPage from './data-page';

const DataRoutes: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <DataLayout>
      <Switch>
        <Route exact path={path} component={DataPage} />
      </Switch>
    </DataLayout>
  );
};

export default DataRoutes;
