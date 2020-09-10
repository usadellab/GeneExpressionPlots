import React from 'react';
//
import { Link } from 'react-router-dom';
//
import {
  Avatar,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
//
import {
  Add      as AddIcon,
  Delete   as DeleteIcon,
  Folder   as FolderIcon,
} from '@material-ui/icons';
//
import { makeStyles } from '@material-ui/core/styles';
//
import { useDataState } from '../store/DataContext';


const useStyles = makeStyles(theme => ({

  root: {
    position: "relative",
    paddingBottom: theme.spacing(8),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  delIcon: {
    marginRight: theme.spacing(1),
  },

}));


export default function GroupList (props) {

  const classes = useStyles();

  const [ data ] = useDataState();

  return (

    <div className={ classes.root } >

      <List>
        {
          Object.keys(data).map(groupName => {

            return (

              <ListItem key={ groupName }>

                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={ groupName }
                  secondary={ data[groupName].description }
                />

                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    className={ classes.delIcon }
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>

              </ListItem>

            );
          })
        }
      </List>

      <Fab
        color="primary"
        aria-label="add"
        className={ classes.fab }
        // onClick={() => setData({
        //   type: 'ADD_GROUP',
        //   payload: {
        //     newName: { description: 'newDescription' }
        //   }
        // })}
        component={ Link }
        to="/wizard"
      >
        <AddIcon />
      </Fab>



    </div>

  );
}