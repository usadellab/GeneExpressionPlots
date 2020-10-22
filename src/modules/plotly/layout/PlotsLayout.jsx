import React from 'react';


export default class PlotsLayout extends React.Component {

  render () {
    return (
      <div className="flex max-w-screen h-screen">


        {/* MAIN CONTENT: ROUTES */}

        <main className="flex flex-wrap p-6 mt-10 w-11/12 h-full" >

          { this.props.children }

        </main>

      </div>
    );
  }
}