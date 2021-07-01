import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import InfoHome from './info-home';

const InfoRoutes: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={InfoHome} />
    </Switch>
  );
};

export default InfoRoutes;
