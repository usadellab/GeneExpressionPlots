import React from 'react';

const AppAnchor: React.FC<React.AnchorHTMLAttributes<{}>> = (props) => {
  return (
    <a target="_blank" rel="noreferrer" {...props}>
      {props.children}
    </a>
  );
};

export default AppAnchor;
