import React from 'react';


export default class HomeLayout extends React.Component {

  render () {

    return (
      <main className="flex justify-center mt-10 mr-6 px-6 md:px-12 w-full" >

        { this.props.children }

      </main>
    );
  }
}