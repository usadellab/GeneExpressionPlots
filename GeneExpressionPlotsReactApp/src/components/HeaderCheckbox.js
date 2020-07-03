import React from 'react'
import { Checkbox } from '@material-ui/core';

function HeaderCheckbox(props) {
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

export default HeaderCheckbox
