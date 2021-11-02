import React, { useRef, useLayoutEffect } from 'react';
import * as d3 from 'd3';

import PlotContainer from './plot-container';
import { GxpMapMan } from '@/types/plots';
import { dataTable, infoTable } from '@/store/data-store';
import {
  getXmlBins,
  getXmlRecursive,
  getXml_x_yCords,
  parseXmlData,
} from '@/utils/plots/mapman-xml-domparser';
import { BiAlignMiddle } from 'react-icons/bi';
import { removeObserver } from 'mobx/dist/internal';

// import { getDataAreaXml } from '@/utils/plots/mapman-xml-domparser';

// interface dataArea {
//   x: number;
//   y: number;
//   identifiers: identifier[];
// }

interface identifier {
  id: string;
  recursive: boolean;
}

// let rows = infoTable.colNames;

// console.log('row --- 1', rows);

// let row2 = dataTable.colNames;

// console.log('rows --- 2', row2);

const MapManPlot: React.FC<GxpMapMan> = (props) => {
  const ref = useRef(null);
  props.template;

  useLayoutEffect(() => {
    const binCoords: { [key: string]: DataPoint } = {};
    const svg = d3.select(ref.current);

    d3.xml(`mapman-templates/${props.template}`).then((data) => {
      console.log({ data });
      svg.node()?.append(data.documentElement);
    });

    var xmlBins: string = getXmlBins(
      'mapman-templates/X4.3_Metabolism_overview_R3.0.xml'
    );

    var coordinates_x_y = getXml_x_yCords(
      'mapman-templates/X4.3_Metabolism_overview_R3.0.xml'
    );

    var recursive = getXmlRecursive(
      'mapman-templates/X4.3_Metabolism_overview_R3.0.xml'
    );

    var xmlData = parseXmlData(
      'mapman-templates/X4.3_Metabolism_overview_R3.0.xml'
    ).then((x) => {
      x.querySelectorAll('DataArea').forEach((xmlNode) => {
        console.log(
          xmlNode.getElementsByTagName('Identifier')[0].attributes[0].nodeValue
        );
      });
    });

    // console.log(Object.values(recursive).map((i) => recursive[i]));

    console.log(xmlBins, coordinates_x_y, coordinates_x_y, recursive);

    console.log(xmlBins.length);

    /**
     * Get genes matching the MapMan
     */
    function getGenesForMapManBins(): any {
      //   colName: String,
      //   mapmanBin: String,
      //   recursive: boolean
      return console.log(dataTable);
    }

    console.log(dataTable.getRow('PGSC0003DMT400039136'));

    d3.xml('mapman-templates/X4.3_Metabolism_overview_R3.0.xml').then(
      (data) => {
        console.log({ data });

        [].map.call(data.querySelectorAll('DataArea'), (dataArea: any) => {
          const id: string =
            dataArea.firstElementChild.attributes.getNamedItem('id').value;
          const { x: xPoint, y: yPoint } = dataArea.attributes;
          binCoords[id] = {
            x: xPoint.value,
            y: yPoint.value,
            offset: 0,
            format: 'x',
            formatnumber: 5,
          };
        });
        console.log({ binCoords });
      }
    );
  }, []);
  return (
    <PlotContainer
      justifyContent="center"
      figureRef={ref}
      position="relative"
      height={1200}
      plotType="heatmap"
      status="idle"
      id={props.id}
    >
      <svg ref={ref} />
    </PlotContainer>
  );
};

export default MapManPlot;
