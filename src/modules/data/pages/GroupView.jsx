import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import AppButton   from '@components/AppButton';
import AppSelect   from '@components/AppSelect';
import AppText     from '@components/AppText';
import AppTextArea from '@components/AppTextArea';

import { useDataStore, Group } from '../store';


/**
 * Render a Group as an HTML element.
 * @param {GroupViewProps} props properties object for the GroupView component
 */
export default function GroupView (props) {

  /** @type {RouteParams} */
  const { groupIndex } = useParams();
  const history = useHistory();

  // Store
  const { state, dispatch } = useDataStore();

  /**
   * Submit new or updated group to the store. Navigate to DataView page.
   * @param {React.FormEvent<HTMLInputElement>} event
   */
  const handleSubmit = (event) => {

    event.preventDefault();
    dispatch({
      type: groupIndex ? 'UPDATE' : 'CREATE',
      payload: {
        key: groupIndex,
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

  // Group form state
  const currentGroup = state[groupIndex] || new Group();

  const [ group, setGroup ] = useState(currentGroup);

  const handleGroup = ({ key, value }) => setGroup( Object.assign({}, group, { [key]: value }) );

  return (
    <form
      onSubmit={ handleSubmit }
      className={ `flex flex-wrap mt-10 px-2 ${props.className}` }
    >

      {/* GROUP LAYER */}

      <div className="flex w-full">

        <AppText
          className="w-1/2"
          label="Group name"
          value={ group.name }
          onChange={ (event) => handleGroup({
            key: 'name', value: event.target.value
          }) }
        />

        <AppSelect
          className="w-1/2 ml-2"
          label="Count unit"
          value={ group.countUnit }
          options={ [ 'Raw', 'RPKM', 'TPM' ] }
          onChange={ (event) => handleGroup({
            key: 'countUnit', value: event.target.value
          }) }
        />

      </div>

      <AppTextArea
        className="w-full"
        label="Group description"
        rows="5"
        value={ group.describe }
        onChange={ (event) => handleGroup({
          key: 'describe', value: event.target.value
        }) }
      />

      <AppButton className="primary-blue" type="Submit">Save</AppButton>
      <AppButton
        className="secondary-pink ml-3"
        type="Button"
        value="Cancel"
        onClick={ handleCancel }
      >
        Cancel
      </AppButton>

    </form>
  );
}