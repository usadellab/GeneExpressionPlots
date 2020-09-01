import React from 'react';

// MUI Components
import {
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';

import {
  Menu     as MenuIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';


// Styles
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({

  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },

}));

export default function MenuBar (props) {

  const classes = useStyles();

  return (

    <AppBar position="static">
      <Toolbar>

        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" className={classes.title}>
            Gene Expression Plots
        </Typography>

        <IconButton color="inherit">
          <SettingsIcon />
        </IconButton>

      </Toolbar>
    </AppBar>

  );
}
