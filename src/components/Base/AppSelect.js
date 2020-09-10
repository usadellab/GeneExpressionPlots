import React, { useState }  from 'react';

// MUI Components
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';

// Styles
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({

  root: {
    width: "100%",
  },

}));


export default function AppSelect({ label, select, variant, bind }) {

  const classes = useStyles();

  const [ option, setOption ] = useState('');

  const handleChange = event => {

    bind(event);
    setOption(event.target.value);

  };

  return (
    <FormControl variant={variant} className={classes.root}>
      <InputLabel id={ label.id }>{ label.value }</InputLabel>
      <Select
        id={ select.id }
        labelId={ label.id }
        value={ option }
        onChange={ handleChange }
      >
        {
          select.options.map(opt =>
            <MenuItem
              key={ opt.label }
              value={ opt.value }
            >
              { opt.label }
            </MenuItem>
          )
        }
      </Select>
    </FormControl>
  );
}
