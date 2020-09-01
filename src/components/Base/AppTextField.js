import React from 'react';

// MUI Components
import TextField from '@material-ui/core/TextField';

// Styles
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({

  root: {
    width: '100%',
  },

}));


export default function AppTextField ({ id, label, variant, bind }) {

  const classes = useStyles();

  return (
    <form noValidate autoComplete="off">

      <TextField
        className={ classes.root }
        id={ id }
        label={ label }
        variant={ variant }
        onChange={ bind }
      />

    </form>
  );
}