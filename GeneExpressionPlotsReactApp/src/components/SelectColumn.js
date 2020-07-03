import React from 'react'
import { TextField } from '@material-ui/core';

function SelectColumn(props) {
  return (
    <div>
      <TextField
        id="standard-number"
        label= {props.label}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        variant="outlined"
        onInput = {(e) =>{
          e.target.value = Math.max(1, e.target.value)
        }}
        onChange= {props.handleTextField}
      />
    </div>
  )
}

export default SelectColumn
