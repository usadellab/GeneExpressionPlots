import React from 'react'
import { TextField } from '@material-ui/core';
import { MenuItem } from '@material-ui/core'

const delimiters = [
  {
    value: ',',
    label: 'comma',
  },
  {
    value: '\t',
    label: 'tab',
  },
  {
    value: ' ',
    label: 'space',
  },
  {
    value: "",
    label: 'auto',
  }
]; 

function DelimiterTextField(props) {
  const [delimiter, setDelimiter] = React.useState('auto');

  const handleChange = (event) => {
    setDelimiter(event.target.value);
  };

  return (
    
    <TextField
        id="select-delimiter"
        select
        label="Select Delimiter"
        value={delimiter}
        onChange={(e) => {handleChange(e); props.handleTextField(e)}}
        helperText="Please select your delimiter"
        variant="outlined"
      >
        {delimiters.map((option) => (
          <MenuItem key={option.value} value={option.label}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  )
}

export default DelimiterTextField
