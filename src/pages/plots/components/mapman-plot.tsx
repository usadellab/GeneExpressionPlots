import React, { useRef, useLayoutEffect, useState } from 'react';
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
import { readFile } from '@/utils/parser';

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
  const svgRef = useRef(null);
  props.template;
  console.log(
    infoTable.getGenesForMapManBin('MapMan-Bins', ',', '1.3.4', true)
  );

  const [xmlDocument, setxmlDocument] = useState<Document>();
  useLayoutEffect(() => {
    const svgMaster = d3.select(ref.current);
    console.log({ svgMaster });
    const svg = d3
      .select(svgRef.current)
      .attr('width', '1024')
      .attr('height', '800');

    d3.xml(`mapman-templates/${props.template}`).then((data) => {
      // console.log({ data });
      svg.node()?.append(data.documentElement);
      parseXmlData('mapman-templates/X4.3_Metabolism_overview_R3.0.xml').then(
        (xmlDocument) => {
          const bins = xmlDocument.getElementsByTagName('Identifier');
          console.log({ xmlDocument, bins });
        }
      );

      const svgViz = d3
        .select(svgRef.current)
        .append('g')
        .attr('id', 'Viz layer');
      svgViz
        .append('rect')
        .attr('x', 35)
        .attr('y', 35)
        .attr('height', 5)
        .attr('width', 5)
        .append('title')
        .text('Hello world');
    });

    // var xmlBins: string = getXmlBins(
    //   'mapman-templates/X4.3_Metabolism_overview_R3.0.xml'
    // );

    // var coordinates_x_y = getXml_x_yCords(
    //   'mapman-templates/X4.3_Metabolism_overview_R3.0.xml'
    // );

    // var recursive = getXmlRecursive(
    //   'mapman-templates/X4.3_Metabolism_overview_R3.0.xml'
    // );

    // var xmlData = parseXmlData(
    //   'mapman-templates/X4.3_Metabolism_overview_R3.0.xml'
    // ).then((x) => {
    //   x.querySelectorAll('DataArea').forEach((xmlNode) => {
    //     console.log(
    //       xmlNode.getElementsByTagName('Identifier')[0].attributes[0].nodeValue
    //     );
    //   });
    // });

    // console.log(Object.values(recursive).map((i) => recursive[i]));

    // console.log(xmlBins, coordinates_x_y, coordinates_x_y, recursive);

    // console.log(xmlBins.length);
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
      <svg ref={svgRef} />
    </PlotContainer>
  );
};

export default MapManPlot;
