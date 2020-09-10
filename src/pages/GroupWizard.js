import React, { useState } from 'react';

import {
  Button,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';

import GroupForm  from '../components/GroupForm';
import SampleForm from '../components/SampleForm';

import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({

  root: {
    width: '100%',
  },

  buttonsContainer: {
    marginBottom: theme.spacing(2),
  },

  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },

  hidden: {
    display: "none"
  },

  form: {
    padding: theme.spacing(2),
  },

  resetContainer: {
    padding: theme.spacing(3),
  },

}));


const stepContent = [

  {
    title: 'Create Group',
    description: `Groups are collections of samples under the same treatment
                  conditions (e.g. Heat Shock Arabidopsis).`,
    form: (
      <GroupForm />
    ),
  },

  {
    title: 'Add Samples',
    description: `Samples are data measurements obtained at various time points
                  during the experiment. When different samples have the same
                  timestamp, they are considered replicates.`,
    form: <SampleForm />
  },

  {
    title: 'Review & Complete',
    description: `Review the information and sample data you added in the
                  previous steps.`
  },
];


export default function GroupWizard () {

  const classes = useStyles();

  const [ activeStep, setActiveStep ] = useState(1);

  const steps = Object.keys(stepContent);

  const handleAdd   = (e) => { console.log(e.target.files[0]); };
  const handleBack  = () => setActiveStep(step => step - 1);
  const handleNext  = () => setActiveStep(step => step + 1);
  const handleReset = () => setActiveStep(0);


  return (
    <div className={ classes.root }>

      <Stepper activeStep={ activeStep } orientation="vertical">
        {
          stepContent.map(({ title, description, form }) => (

            <Step key={ title }>

              <StepLabel>{ title }</StepLabel>

              <StepContent>

                <Typography>{ description }</Typography>

                <div className={ classes.form }>

                  { form ? form : null }

                </div>

                <div className={ classes.buttonsContainer }>

                  <Button
                    disabled={ activeStep === 0 }
                    onClick={ handleBack }
                    className={ classes.button }
                  >
                    Back
                  </Button>

                  <Button
                    component="label"
                    variant="contained"
                    color="secondary"
                    // onClick={ handleAdd }
                    className={`
                      ${classes.button}
                      ${activeStep !== 1 ? classes.hidden : ''}
                    `}
                  >
                    Add
                    <input
                      type="file"
                      hidden
                      onChange={ handleAdd }
                    />
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={ handleNext }
                    className={ classes.button }
                  >
                    { activeStep === steps.length - 1 ? 'Finish' : 'Next' }
                  </Button>

                </div>

              </StepContent>

            </Step>

          ))
        }
      </Stepper>

      {
        activeStep === steps.length && (

          <Paper square elevation={ 0 } className={ classes.resetContainer }>

            <Typography>
              All steps completed - group added successfully
            </Typography>

            <Button
              onClick={ handleReset }
              className={ classes.button }
            >
                Reset
            </Button>

          </Paper>

        )
      }

    </div>
  );
}
