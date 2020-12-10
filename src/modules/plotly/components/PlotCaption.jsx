import React from 'react';


export default class PlotCaption extends React.Component {
  render() {
    return (
      <figcaption className="px-20 text-justify text-gray-800 text-sm">
        <div>
          <span className="font-semibold">{ this.props.accession }</span>
          {
            Object.entries(this.props.caption).map(([ key, value ]) => (
              <div
                key={ `${this.props.accession}-${key}` }
                className="ml-2"
              >
                <span className="uppercase" > { key } </span>
                <span className="ml-2" > { value } </span>
              </div>
            ))
          }
        </div>
      </figcaption>
    );
  }
}