import React from 'react';
import { observer } from 'mobx-react';

import SingleGenePlot from './components/singleGenePlot';

import { plotStore } from '@/store/plot-store';

import Sidebar, { SidebarButton } from '@/components/nav-sidebar';
import FormikModal from '@/components/formik-modal';
import { Flex, Text, useDisclosure } from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

import BarsForm, { BarsFormSubmitHandler } from './components/bars-form';

export interface PlotlyOptions {
  showlegend: boolean;
  showCaption: boolean;
  plotType?: string;
  colorBy?: string;
  plotTitle: string;
}

const TextIcon = (text: string) =>
  function IconRenderer(): JSX.Element {
    return (
      <Text
        border="1px"
        flexShrink={0}
        fontSize="sm"
        fontWeight="bold"
        padding=".25rem"
        width="3.5rem"
      >
        {text}
      </Text>
    );
  };

const handleBarPlotClick = () => {
  plotStore.addBarPlot2('AT1G10070.1', {
    showlegend: true,
    showCaption: false,
    plotTitle: 'My PLot',
  } as PlotlyOptions);
};

const PlotsHome: React.FC = () => {
  /* BARS PLOT */
  const refBarsFormInitialFocus = React.useRef<FocusableElement | null>(null);

  const {
    isOpen: isBarsFormOpen,
    onOpen: onBarsFormOpen,
    onClose: onBarsFormClose,
  } = useDisclosure();

  const onBarsFormSubmit: BarsFormSubmitHandler = (values, actions) => {
    console.log({ values });
    actions.setSubmitting(false);
  };

  return (
    <Flex as="main" flexGrow={1}>
      <Sidebar top={0} maxWidth="17rem" minWidth="6.5rem">
        <SidebarButton
          text="Bars Plot"
          icon={TextIcon('BAR')}
          alignItems="baseline"
          onClick={onBarsFormOpen}
        />

        <SidebarButton
          text="Curved Lines Plot"
          icon={TextIcon('CLN')}
          alignItems="baseline"
        />

        <SidebarButton
          text="Stacked Lines Plot"
          icon={TextIcon('SLN')}
          alignItems="baseline"
        />

        <SidebarButton
          text="Heatmap Plot"
          icon={TextIcon('HMP')}
          alignItems="baseline"
        />

        <SidebarButton
          text="PCA Plot"
          icon={TextIcon('PCA')}
          alignItems="baseline"
        />
      </Sidebar>

      <Flex as="main" flexWrap="wrap" width="100%">
        {plotStore.plots.map((plot) => {
          switch (plot.type) {
            case 'plotly':
              return (
                <SingleGenePlot
                  accession={plot.props.accession}
                  key={plot.key}
                  options={plot.props.options}
                ></SingleGenePlot>
              );
            default:
              break;
          }
          // return (
          // <div key={plot.key}>{JSON.stringify(plot)}</div>
          // <PlotlyPlot
          //   key={plot.plotId}
          //   className="relative flex flex-col m-3 py-6 w-full resize-x
          //                shadow-outer overflow-auto bg-white"
          //   plot={{ ...plot }}
          // >
          //   {plot.showCaption &&
          //     plot.accessions.map((accession: string, index: number) => (
          //       <PlotCaption
          //         key={`${accession}-${index}`}
          //         accession={accession}
          //         caption={infoTable.getRowAsMap(accession)}
          //         color={plot.accessions.length > 1 ? colors[index] : null}
          //       />
          //     ))}
          // </PlotlyPlot>
          // );
        })}
      </Flex>

      <FormikModal
        initialFocusRef={refBarsFormInitialFocus}
        isOpen={isBarsFormOpen}
        onClose={onBarsFormClose}
        size="xl"
        title="Bars Plot"
        scrollBehavior="outside"
      >
        <BarsForm
          initialFocusRef={refBarsFormInitialFocus}
          onCancel={onBarsFormClose}
          onSubmit={onBarsFormSubmit}
        />
      </FormikModal>
    </Flex>
  );
};

export default observer(PlotsHome);
