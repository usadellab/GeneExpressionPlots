import React from 'react';


export default class PlotCaption extends React.Component {
  render() {
    return (
      <figcaption
        className="flex flex-col py-5 mt-2 mx-20 border-t hover:border-yellow-600 hover:bg-yellow-100
                   text-justify text-gray-800 text-sm"
      >

        <div className="font-semibold text-base text-green-800">{ this.props.accession }</div>

        <div className="flex items-center mt-2">

          <div>
            {
              Object.keys(this.props.caption).map((colName, index) => (
                <div
                  key={ colName }
                  className="ml-2 py-1 uppercase font-semibold text-yellow-700"
                >
                  { colName }
                </div>
              ))
            }
          </div>

          <div>
            {
              Object.values(this.props.caption).map((cellValue, index) => (
                <div key={ index } className="ml-5 py-1">
                  { cellValue }
                </div>
              ))
            }
          </div>

        </div>
      </figcaption>
    );
  }
}