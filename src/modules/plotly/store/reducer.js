import { createBarPlot } from './plots';


function createPlot (state, accession, showlegend) {

  state.push( createBarPlot(accession, showlegend) );

  return [ ...state ];
}


export function plotStoreReducer (state, action) {

  const { type, payload } = action;

  switch (type) {

    case 'CREATE_PLOT':
      return createPlot(state, payload.accession, payload.showlegend);

    case 'RESET_PLOTS':
      return [];

    default:
      throw new Error(`Unhandled data store action type: ${type}`);
  }

}