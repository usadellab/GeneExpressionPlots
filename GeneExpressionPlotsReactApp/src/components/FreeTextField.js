import React from 'react'
import { TextField } from '@material-ui/core';

function FreeTextField(props) {
  return (
    <div>
      <TextField
        required
        id="outlined-required"
        label={props.label}
        defaultValue=""
        variant="outlined"
        onChange={props.handleTextField}
      />
    </div>
  )
}

export default FreeTextField
