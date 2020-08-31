import React from 'react'
import { TextField } from '@material-ui/core';

function FreeTextField(props) {
  return (
    <TextField
      required
      id="outlined-required"
      label={props.label}
      defaultValue=""
      variant="outlined"
      onChange={props.handleTextField}
    />
  )
}

export default FreeTextField
