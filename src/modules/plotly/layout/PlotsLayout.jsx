import React from 'react';

import { PRELOAD_IMAGE } from '@/config/globals.js';


export default class PlotsLayout extends React.Component {

  constructor () {
    super();
    this.state = {
      img: null,
    };
  }

  async componentDidMount () {
    if (PRELOAD_IMAGE) {
      try {
        const response = await fetch(PRELOAD_IMAGE);
        if (response.ok)
          this.setState({ img: response.url });
        else
          console.error('Loading preloaded image caused an error');
      }
      catch (error) {
        console.error(error.message);
      }
    }
  }

  render () {
    return (
      <div className="flex flex-col xl:flex-row max-w-screen">

        {/* MAIN CONTENT: ROUTES */}

        <main className="flex flex-wrap p-6 mt-10 w-full h-full" >

          {/* PRELOADED IMAGE

            This <img/> element comes pre-styled to integrate with the existing layout as
            best as possible. To do this, it makes some sensible assumptions about how the
            image should likely be displayed.

            The current layout is a flex display with automatic wrapping, where each element
            uses half the <main> container width.

            The <img/> element is positioned as if it were another plot in the layout. A
            padding of 6rem units is also added to the <img/> element to emulate the default
            positioning of the <Plot/> element as produced by Plotly.js.

          */}
          {
            this.state.img &&
            <div className="flex justify-center items-center w-full xl:w-1/2">
              <img className="p-24" src={ this.state.img } />
            </div>
          }

          {/* PLOTS */}
          { this.props.children }

        </main>

      </div>
    );
  }
}