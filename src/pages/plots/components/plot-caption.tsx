import React from 'react';

import GeneCard from '@/components/gene-card';
import { PlotContext } from './plotly-plot';
import { Flex } from '@chakra-ui/layout';

interface PlotCaptionProps {
  accession: string;
  color?: string;
  caption: Map<string, string>;
}

const PlotCaption: React.FC<PlotCaptionProps> = (props) => {
  return (
    <PlotContext.Consumer>
      {({ hoveredGene }) => (
        <Flex
          as="figcaption"
          py="5"
          textColor="gray.600"
          textAlign="justify"
          fontSize="sm"
          _hover={{
            backgroundColor: 'yellow.100',
          }}
          _odd={{
            backgroundColor: 'gray.100',
          }}
        >
          <GeneCard
            // className="px-2"
            accession={props.accession}
            geneInfo={props.caption}
            color={props.color}
          />
        </Flex>

        // <figcaption
        //   className={`
        //              flex py-5
        //              hover:bg-yellow-100 odd:bg-gray-100
        //              text-justify text-gray-800 text-sm ${props.className ?? ''}
        //              ${
        //                hoveredGene && !hoveredGene.includes(props.accession)
        //                  ? 'opacity-50'
        //                  : ''
        //              }
        //              ${
        //                hoveredGene.includes(props.accession)
        //                  ? 'bg-yellow-100'
        //                  : ''
        //              }
        //              `}
        //   style={{ borderColor: props.color ?? '' }}
        // >
        //   <GeneCard
        //     className="px-2"
        //     accession={props.accession}
        //     geneInfo={props.caption}
        //     color={props.color}
        //   />
        // </figcaption>
      )}
    </PlotContext.Consumer>
  );
};

export default PlotCaption;
