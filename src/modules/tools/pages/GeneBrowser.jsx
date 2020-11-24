import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { store } from '@/store';

@observer
export default class GeneBrowser extends Component {
  render() {
    return (
      <div>
        {
          Object.entries(store.captions).map(([ accessionId, description ]) => (

            <div
              className="px-5 py-3"
              key={ accessionId }
            >
              <div className="w-1/6 font-bold">{ accessionId }</div>
              <div className="ml-6 w-5/6">{ description }</div>
            </div>

          ))
        }
      </div>
    );
  }
}
