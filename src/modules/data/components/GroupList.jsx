import React from 'react';

import { useDataStore } from '../Home.store';

import AppButton  from '@components/AppButton';
import IconTrash  from '../assets/svg/hi-trash.svg';
import IconPencil from '../assets/svg/hi-pencil.svg';
import IconAdd    from '../assets/svg/hi-plus.svg';


const GroupStat = ({ label, value }) => {

  return (
    <div className="flex mt-1 text-sm">
      <span className="text-gray-500">{ label }</span>
      <span className="ml-1 text-gray-600">{ value }</span>
    </div>
  );
};

/**
 * Render a Group as a JSX.Element
 * @param {Object<string,Group>} groupObject group object from the data store
 */
const Group = ({ name, group }) => {

  const { countUnit, describe, samples } = group;

  return (
    <div className="px-2 py-8 flex flex-wrap md:flex-no-wrap border-t-2 hover:bg-gray-100">

      <section className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">

        <h2 className="text-xl text-gray-800">{ name }</h2>

        <div className="mt-2" >
          <GroupStat label="Units:" value={ countUnit } />
          <GroupStat label="Samples:" value={ samples.length } />
        </div>

      </section>

      <section className="md:flex-grow">

        {/* <h2 className="text-2xl font-medium text-gray-900 title-font mb-2"> { name } </h2> */}

        <p className="mt-1 h-6 overflow-hidden leading-relaxed" >{ describe }</p>

        <div className="inline-flex items-center mt-4 text-gray-500">

          <AppButton className="group rounded-full" >
            <IconPencil className="w-6 group-hover:text-blue-500" />
          </AppButton>

          <AppButton className="group p-1 rounded-full" >
            <IconTrash className="w-6 h-6 group-hover:text-red-600" />
          </AppButton>

        </div>

      </section>

    </div>
  );

};


export default function GroupList (props) {

  const [ data, setData ] = useDataStore();

  const { groups } = data;

  return (
    <section className="font-abeeze text-gray-700 body-font overflow-hidden container px-5 py-24 mx-auto">

      {
        Object.entries(groups).map(([key, entry],index) => (

          <Group
            key={ `${key}-${index}` }
            name={ key }
            group={ entry }
          />
        ))

      }

      <AppButton className="group flex justify-center w-full border-t-2">
        <IconAdd className="w-24 text-gray-500 group-hover:text-blue-500"/>
      </AppButton>

    </section>
  );
}