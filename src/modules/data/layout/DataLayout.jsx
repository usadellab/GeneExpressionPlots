import React from 'react';


export default class HomeLayout extends React.Component {

  render () {

    return (
      <main className="flex justify-center mr-6 py-10 px-6 md:px-12 w-full" >

        { this.props.children }

      </main>
    );
  }
}