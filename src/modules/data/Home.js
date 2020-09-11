import React from 'react';
// import { Link } from 'react-router-dom';
//
import { makeStyles } from '@material-ui/core/styles';
//
import GroupForm  from './components/GroupForm';
import GroupList  from './components/GroupList';
import SampleForm from './components/SampleForm';
import SampleList from './components/SampleList';
//
import { useDataState } from '../../store/DataContext';


const useStyles = makeStyles(theme => ({

  root: {
    display: 'flex',
    width: '100%'
  },

  half: {
    padding: theme.spacing(1, 2),
    width: '50%',
  },

  // fab: {
  //   position: 'absolute',
  //   bottom: theme.spacing(2),
  //   right: theme.spacing(2),
  // },

}));


export default function DataHome (props) {

  const classes = useStyles();

  const [ data ] = useDataState();   // global store
  // const [ open, setOpen ] = useState(false);  // local store

  // const openDataForm = () => {
  //   setOpen(true);
  // };

  // const closeDataForm = () => {
  //   setOpen(false);
  // };

  return (

    <div className={ classes.root } >


      <div className={ classes.half }>

        <GroupList
          data={ data }
        />

      </div>

      <div className={ classes.half } >
        <GroupForm />
        <SampleForm />
      </div>

      {/* <DataForm
        open={open}
        handleClose={closeDataForm}
      /> */}

      {/* <Fab
        color="primary"
        aria-label="add"
        className={ classes.fab }
        onClick={ openDataForm }
        // onClick={() => setData({
        //   type: 'ADD_GROUP',
        //   payload: {
        //     newName: { description: 'newDescription' }
        //   }
        // })}
        // component={ Link }
        // to="/wizard"
      >
        <AddIcon />
      </Fab> */}



    </div>

  );
}