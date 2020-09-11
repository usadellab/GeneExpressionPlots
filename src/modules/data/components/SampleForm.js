import React from 'react';

/* MUI Components */
import { Grid }     from '@material-ui/core';

/* App Components */
import AppTextField from '../../../components/AppTextField';

/* Styles */
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({

  gridContainer: {
    margin: 0,
    width: "100%"
  },

  gridItem: {
    width: "50%",
  },

}));

export default function CreateGroup (props) {

  const { gridContainer, gridItem } = useStyles();

  return (
    <Grid
      container
      className={ gridContainer }
      spacing={ 1 }
    >

      <Grid item className={ gridItem } >
        <AppTextField
          id="sample-name"
          label="Sample Name"
          variant="outlined"
        />
      </Grid>

      <Grid item className={ gridItem } >
        <AppTextField
          id="sample-delimiter"
          label="Column Separator"
          variant="outlined"
        />
      </Grid>

      <Grid item className={ gridItem } >
        <AppTextField
          id="sample-accession"
          label="Accession Column"
          variant="outlined"
        />
      </Grid>

      <Grid item className={ gridItem } >
        <AppTextField
          id="sample-count"
          label="Count Column"
          variant="outlined"
        />
      </Grid>

    </Grid>
  );
}
