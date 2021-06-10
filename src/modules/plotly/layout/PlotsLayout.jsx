import React from 'react';
import { observer } from 'mobx-react';
import { plotStore } from '@/store/plot-store';

class PlotsLayout extends React.Component {
  render() {
    return (
      <div className="flex flex-col xl:flex-row max-w-screen">
        {/* MAIN CONTENT: ROUTES */}

        <main className="flex flex-wrap w-full" >
          {/* PRELOADED IMAGE

            This <img/> element is pre-styled to integrate with the existing layout as
            best as possible. To do this, we make some sensible assumptions about how the
            image is most likely going to be displayed in relation to the plots.

            - The layout in small screens (up to width: 768px) is a flex display with column
            orientation. Each <Plot/> element will use the full width of the <main> container.

            - The layout in large screens (width: 1440px) is a flex display with automatic
             wrapping. Each <Plot/> element will use half of the <main> container width.

            Considering the points above, the <img/> element is positioned as if it were another
            <Plot/>, with a few differences:

            - The image container is a <div/> element with a full width, and a padding percentage
            base on that full width. This creates a fluid container that will resize along with
            the screen width.

            - The image container width is limited to a maximum size in screens up to laptop
            size (width: 1280px). After that, the image width will always take up 50% of the
            <main> element, like the plots.

            These <img/> styles try to emulate the way Plotly.js renders <Plot/> elements, while
            at same time keeping the image locked to an aspect ratio.

            Source: https://tailwindcss.com/course/locking-images-to-a-fixed-aspect-ratio

          */}
          {plotStore.image && (
            <div className="flex justify-center items-center m-3 w-full
                            resize-x overflow-auto shadow-outer bg-white"
            >
              <img src={plotStore.image} />
            </div>
          )}

          {/* PLOTS */}
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default observer(PlotsLayout);