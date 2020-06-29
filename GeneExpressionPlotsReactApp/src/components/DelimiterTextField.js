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
  const [delimiter, setDelimiter] = React.useState('comma');

  const handleChange = (event) => {
    setDelimiter(event.target.value);
  };

  return (
    
    <div>
      <TextField
          id="select-delimiter"
          select
          label="Select Delimiter"
          value={delimiter}
          onChange={(e) => {handleChange(e); props.handleDelimiter(e)}}
          helperText="Please select your delimiter"
        >
          {delimiters.map((option) => (
            <MenuItem key={option.value} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
      </TextField>
    </div>
  )
}

export default DelimiterTextField
