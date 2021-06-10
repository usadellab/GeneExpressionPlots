/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// import cypressReact from '@cypress/react/plugins/react-scripts';
import task from '@cypress/code-coverage/task';

/**
 * This function is called when a project is opened or re-opened (e.g. due to
 * the project's config changing)
 * @param on function to hook into the various events cypress emits
 * @param config the resolved cypress config
 */
const config: Cypress.PluginConfig = (on, config) => {
  // cypressReact(on, config);
  task(on, config);
  return config;
};

export default config;
