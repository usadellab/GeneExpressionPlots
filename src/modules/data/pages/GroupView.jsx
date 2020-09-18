import React         from 'react';
import { useParams } from 'react-router-dom';


export default function GroupView (props) {

  const { group } = useParams();

  return (
    <div>GroupView works! We are in { group }</div>
  );
}