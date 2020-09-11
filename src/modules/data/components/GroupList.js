import React from 'react';

import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';

import {
  Delete as DeleteIcon,
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({

  delIcon: {
    marginRight: theme.spacing(1),
  },

}));


export default function GroupList (props) {

  const { delIcon } = useStyles();

  const { data } = props;

  return (
    <List >
      {
        Object.keys(data).map(groupName => {

          return (

            <ListItem key={ groupName }>

              <ListItemText
                primary={ groupName }
                secondary={ data[groupName].description }
              />

              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  className={ delIcon }
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>

            </ListItem>

          );
        })
      }
    </List>
  );
}