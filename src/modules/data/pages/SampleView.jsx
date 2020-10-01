import React from 'react';
import { useParams } from 'react-router-dom';


export default function SampleView (props) {

  const { group, sample } = useParams();

  return (
    <div>
      <p> SampleView works!  </p>
      <p> Group: { group }   </p>
      <p> Sample: { sample } </p>
    </div>
  );
}