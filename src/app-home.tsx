import React from 'react';
import { Redirect } from 'react-router-dom';

const AppHome: React.FC = () => {
  return <Redirect to="/data" />;
};

export default AppHome;
