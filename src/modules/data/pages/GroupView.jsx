import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import AppButton   from '@components/AppButton';
import AppText     from '@components/AppText';

import GroupForm from '../components/GroupForm';

import { useDataStore } from '../store/context';
import { Group }        from '../store/types';


/**
 * Render a single group as a JSX.Element
 *
 * @typedef  {Object} GroupViewProps Properties object for the GroupVIew component.
 * @property {string} className css classes to apply in the root element
 *
 * @param {GroupViewProps} props component props
 */
export default function GroupView (props) {

  /** @type {GroupLocation} */
  const { state } = useLocation();

  /** @type {RouteParams} */
  const history = useHistory();

  const [ group, setGroup ] = useState(state ? state.group : new Group());

  const { dispatch } = useDataStore();

  /**
   * Submit new or updated group to the store. Navigate to DataView page.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  const handleSubmit = (event) => {

    event.preventDefault();

    dispatch({
      type: state?.groupIndex >= 0 ? 'UPDATE' : 'CREATE',
      payload: {
        key: state?.groupIndex,
        value: group,
      }
    });
    history.push('/data');
  };

  /**
   * Return to DataView page.
   * @param {React.MouseEvent<HTMLButtonElement>} event
   */
  const handleCancel = (event) => history.push('/data');


  /**
   * Update the local group-layer state with the appropriate input value.
   * @param {Object<string,string>} param0 group key-value pair
   */
  const updateGroupInput = ({ key, value }) => setGroup(
    Object.assign({}, group, { [key]: value })
  );

  return (
    <form
      className={
        `w-full ${props.className || ''}`
      }
      onSubmit={ handleSubmit }
    >

      {/* GROUP LAYER */}

      <GroupForm
        name={ group.name }
        countUnit={ group.countUnit }
        describe={ group.describe }
        onChange={ updateGroupInput }
      />


      {/* STATE CONTROLS */}

      <div className="flex mt-6 mx-1">

        <AppButton
          className="primary-blue"
          type="Submit"
        >
          Save
        </AppButton>

        <AppButton
          className="tertiary-pink ml-3"
          type="Button"
          value="Cancel"
          onClick={ handleCancel }
        >
          Cancel
        </AppButton>

      </div>
    </form>
  );
}