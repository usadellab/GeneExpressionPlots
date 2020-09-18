import React                   from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import AppButton  from '@components/AppButton';
import IconTrash  from '../assets/svg/hi-trash.svg';
import IconPencil from '../assets/svg/hi-pencil.svg';

import { useDataStore } from '../Home.store';


/**
 * Render group stats HTML element.
 * @param {GroupItemStatProps} props group stat property object
 */
const GroupItemStat = (props) => {

  const { label, value } = props;

  return (
    <div className="flex mt-1 text-sm">
      <span className="text-gray-500">{ label }</span>
      <span className="ml-1 text-gray-600">{ value }</span>
    </div>
  );
};

/**
 * Render a Group item as a HTML element.
 * @param {GroupItemProps} props properties object
 */
export default function GroupItem (props) {

  const { groupKey, groupValue } = props;
  const { path } = useRouteMatch();
  const [ _data, setData ] = useDataStore();

  return (
    <div className="px-2 py-8 flex flex-wrap md:flex-no-wrap border-t-2 hover:bg-gray-100" >

      <header className="flex flex-col flex-shrink-0 mb-6 md:w-64 md:mb-0" >

        <h2 className="text-xl text-gray-800">{ groupKey }</h2>

        <div className="mt-2" >
          <GroupItemStat label="Units:" value={ groupValue.countUnit } />
          <GroupItemStat label="Samples:" value={ groupValue.samples.length } />
        </div>

      </header>

      <section className="md:flex-grow">

        {/* <h2 className="text-2xl font-medium text-gray-900 mb-2" >
          { groupKey }
        </h2> */}

        <p className="mt-1 h-6 overflow-hidden leading-relaxed text-gray-700" >
          { groupValue.describe }
        </p>

        <div
          className="inline-flex items-center mt-4 text-gray-500"
        >

          <Link to={ `${path}/group/${groupKey}`} >
            <AppButton className="group rounded-full" >
              <IconPencil
                className="w-6 group-hover:text-blue-500"
              />
            </AppButton>
          </Link>

          <AppButton
            className="group p-1 rounded-full"
            onClick={ () => setData({
              type: 'DELETE',
              payload: { key: groupKey, value: groupValue }
            })}
          >
            <IconTrash
              className="w-6 h-6 group-hover:text-red-600"
            />
          </AppButton>

        </div>

      </section>

    </div>
  );
}
