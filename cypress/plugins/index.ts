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

import codeCoverageTask from '@cypress/code-coverage/task';
import { startDevServer } from '@cypress/vite-dev-server';

/**
 * This function is called when a project is opened or re-opened (e.g. due to
 * the project's config changing)
 * @param on function to hook into the various events cypress emits
 * @param config the resolved cypress config
 */
const config: Cypress.PluginConfig = (on, config) => {
  on('dev-server:start', async (options) =>
    startDevServer({
      options,
      viteConfig: {
        configFile: 'vite.config.js',
      },
    })
  );

  codeCoverageTask(on, config);
  return config;
};

export default config;
