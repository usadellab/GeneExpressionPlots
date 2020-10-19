import React from 'react';


export default function HomeLayout (props) {

  return (
    <main className="flex justify-center mt-10 mr-6 px-6 md:px-12 w-full" >

      { props.children }

    </main>
  );
}