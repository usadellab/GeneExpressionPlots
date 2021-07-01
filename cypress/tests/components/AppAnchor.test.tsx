import React from 'react';
import { mount } from '@cypress/react';
import AppAnchor from '@/components/AppAnchor';

it('renders learn react link', () => {
  mount(<AppAnchor href="/test/path">Gene Expression Plots</AppAnchor>);
  cy.get('a').contains('Gene Expression Plots');
});
