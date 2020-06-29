import React from 'react'
import { Checkbox } from '@material-ui/core';

function HeadCheckbox(props) {
  return (
    <div>
    header
      <Checkbox
        value="checkedA"
        inputProps={{ 'aria-label': 'Checkbox A' }}
        onChange={props.handleHeader}
      />
    </div>
  )
}

export default HeadCheckbox
