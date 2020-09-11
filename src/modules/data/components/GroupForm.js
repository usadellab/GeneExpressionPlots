import React, { useState } from 'react';
//
import { Grid }       from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
//
import AppTextField from '../../../components/AppTextField';


const useStyles = makeStyles(theme => ({

  gridContainer: {
    margin: 0,
    width: '100%',
  },

}));

export default function CreateGroup (props) {

  const [ name, setName ] = useState('');
  const [ desc, setDesc ] = useState('');

  const handleName = e => setName(e.target.value);
  const handleDesc = e => setDesc(e.target.value);

  const { gridContainer } = useStyles();

  return (
    <Grid
      container
      direction="column"
      spacing={ 1 }
      className={ gridContainer }
    >

      <Grid item >
        <AppTextField
          id="group-name"
          label="Group Name"
          variant="outlined"
          value={ name }
          onChange={ handleName }
        />
      </Grid>

      <Grid item >
        <AppTextField
          id="group-description"
          label="Group Description"
          variant="outlined"
          multiline
          rows={ 3 }
          value={ desc }
          onChange={ handleDesc }
        />
      </Grid>

    </Grid>
  );
}
