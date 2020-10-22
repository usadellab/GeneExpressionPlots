import React, { Component } from 'react';

import '@/css/markdown.css';

export default class api extends Component {
  render() {
    return (
      <div className="flex justify-center w-full">
        <div className="markdown">
          <h2 id="api">API</h2>
          <h3 id="pre-load-data">Pre-load your data</h3>
          <p>
            It is possible to compile the application in <em>pre-load</em> mode. This functionality can be enabled by populating the <em>data/preload.json</em> file with data previously exported by this application.
          </p>
          <p>
            To generate data ready for preloading, follow the Guide to upload replicate tables. Once the tables are loaded in the application, use the <em>Export Data</em> menu. The downloaded JSON-formatted file is ready for pre-loading.
          </p>
        </div>
      </div>
    );
  }
}
