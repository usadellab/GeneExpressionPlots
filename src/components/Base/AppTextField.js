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

const submitHandler = (event) => {
  event.preventDefault();
};

export default function AppTextField (props) {

  const classes = useStyles();

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={ submitHandler }
    >

      <TextField
        className={ classes.root }
        { ...props }
      />

    </form>
  );
}