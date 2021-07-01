import React from 'react';
import { FaBurn, FaChartBar, FaChartLine, FaTrashAlt } from 'react-icons/fa';
import { FcLineChart } from 'react-icons/fc';
import { MdBubbleChart } from 'react-icons/md';
import { observer } from 'mobx-react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';
import { FocusableElement } from '@chakra-ui/utils';

import { dataTable, infoTable } from '@/store/data-store';
import { plotStore } from '@/store/plot-store';

import Sidebar, { SidebarButton } from '@/components/nav-sidebar';
import FormikModal from '@/components/formik-modal';

import { GxpHeatmap, PlotlyOptions, GxpPlotly, GxpPCA } from '@/types/plots';

import BarsForm, { BarsFormSubmitHandler } from './components/bars-form';
import HeatmapForm, {
  HeatmapFormSubmitHandler,
} from './components/heatmap-form';
import HeatmapPlot from './components/heatmap-plot';
import PlotContainer from './components/plot-container';
import PlotlyPlot, { colors } from './components/PlotlyPlot';
import PCAPlot from './components/pca-plot';
import IndividualLinesForm, {
  IndividualLinesFormSubmitHandler,
} from './components/individual-lines-form';
import StackedLinesForm, {
  StackedLinesFormSubmitHandler,
} from './components/stacked-lines-form';
import PlotCaption from './components/PlotCaption';
import PCAForm, { PCAFormSubmitHandler } from './components/pca-form';

const PlotsHome: React.FC = () => {
  /* BARS PLOT */
  const refBarsFormInitialFocus = React.useRef<FocusableElement | null>(null);

  const {
    isOpen: isBarsFormOpen,
    onOpen: onBarsFormOpen,
    onClose: onBarsFormClose,
  } = useDisclosure();

  const onBarsFormSubmit: BarsFormSubmitHandler = (values, actions) => {
    if (values.accessions.length === 1) {
      plotStore.addSingleGeneBarPlot(values.accessions, {
        showlegend: values.withLegend,
        showCaption: values.withCaption,
        plotTitle: values.plotTitle,
      } as PlotlyOptions);
    } else {
      plotStore.addMultiGeneBarPlot(values.accessions, {
        showlegend: values.withLegend,
        showCaption: values.withCaption,
        plotTitle: values.plotTitle,
      });
    }

    actions.setSubmitting(false);
    onBarsFormClose();
  };

  /* INDIVIDUAL LINES */
  const refIndividualLinesFormInitialFocus =
    React.useRef<FocusableElement | null>(null);

  const {
    isOpen: isIndividualLinesFormOpen,
    onOpen: onIndividualLinesFormOpen,
    onClose: onIndividualLinesFormClose,
  } = useDisclosure();

  const onIndividualLinesFormSubmit: IndividualLinesFormSubmitHandler = (
    values,
    actions
  ) => {
    if (values.accessions.length === 1) {
      plotStore.addSingleGeneIndividualLinesPlot(values.accessions, {
        showlegend: values.withLegend,
        showCaption: values.withCaption,
        plotTitle: values.plotTitle,
      } as PlotlyOptions);
    } else {
      plotStore.addMultiGeneIndividualLinesPlot(values.accessions, {
        showlegend: values.withLegend,
        showCaption: values.withCaption,
        plotTitle: values.plotTitle,
      });
    }

    actions.setSubmitting(false);
    onIndividualLinesFormClose();
  };

  /* Stacked Lines */
  const refStackedLinesFormInitialFocus = React.useRef<FocusableElement | null>(
    null
  );

  const {
    isOpen: isStackedLinesFormOpen,
    onOpen: onStackedLinesFormOpen,
    onClose: onStackedLinesFormClose,
  } = useDisclosure();

  const onStackedLinesFormSubmit: StackedLinesFormSubmitHandler = (
    values,
    actions
  ) => {
    plotStore.addStackedLinesPlot(values.accessions, {
      showlegend: values.withLegend,
      showCaption: values.withCaption,
      plotTitle: values.plotTitle,
      colorBy: 'group',
    } as PlotlyOptions);

    actions.setSubmitting(false);
    onStackedLinesFormClose();
  };

  /* HEATMAP PLOT */
  const refHeatmapFormInitialFocus = React.useRef<FocusableElement | null>(
    null
  );

  const {
    isOpen: isHeatmapFormOpen,
    onOpen: onHeatmapFormOpen,
    onClose: onHeatmapFormClose,
  } = useDisclosure();

  const onHeatmapFormSubmit: HeatmapFormSubmitHandler = (values, actions) => {
    actions.setSubmitting(false);
    onHeatmapFormClose();
    setTimeout(
      () => plotStore.addHeatmapPlot(values.plotTitle, values.replicates),
      10
    );
  };

  /* PCA PLOT */

  const refPCAFormInitialFocus = React.useRef<FocusableElement | null>(null);

  const {
    isOpen: isPCAFormOpen,
    onOpen: onPCAFormOpen,
    onClose: onPCAFormClose,
  } = useDisclosure();

  const onPCAFormSubmit: PCAFormSubmitHandler = (values, actions) => {
    actions.setSubmitting(false);
    onPCAFormClose();
    setTimeout(() => plotStore.addPCAPlot(values.plotTitle), 10);
  };

  /* ACTIONS */

  const onDeletePlots = (): void => {
    plotStore.clearPlots();
  };

  const noDataAvailable = !dataTable.hasData;
  const noPlotsAvailable = !plotStore.hasPlots;

  return (
    <Flex as="main" flexGrow={1}>
      <Sidebar
        background="white"
        marginTop={5}
        minWidth="4.5rem"
        maxWidth="14rem"
        position="fixed"
        boxShadow="2xl"
        zIndex="overlay"
      >
        <SidebarButton
          text="Bars"
          icon={FaChartBar}
          onClick={onBarsFormOpen}
          disabled={noDataAvailable}
        />

        <SidebarButton
          text="Individual Lines"
          icon={FaChartLine}
          onClick={onIndividualLinesFormOpen}
          disabled={noDataAvailable}
        />

        <SidebarButton
          text="Stacked Lines"
          icon={FcLineChart}
          onClick={onStackedLinesFormOpen}
          disabled={noDataAvailable}
        />

        <SidebarButton
          text="Heatmap"
          icon={FaBurn}
          onClick={onHeatmapFormOpen}
          disabled={noDataAvailable}
        />

        <SidebarButton
          text="PCA"
          icon={MdBubbleChart}
          onClick={onPCAFormOpen}
          disabled={noDataAvailable}
        />

        <SidebarButton
          text="Remove All"
          icon={FaTrashAlt}
          onClick={onDeletePlots}
          disabled={noDataAvailable || noPlotsAvailable}
        />
      </Sidebar>

      <Flex
        aria-label="Visualizations"
        flexWrap="wrap"
        role="region"
        width="100%"
        margin={2}
        marginLeft={20}
        overflow="hidden"
      >
        {noDataAvailable && (
          <Alert
            alignItems="center"
            flexDirection="column"
            minHeight="16rem"
            justifyContent="center"
            marginLeft={3}
            marginTop={3}
            status="warning"
            textAlign="center"
            variant="subtle"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              No data has been loaded
            </AlertTitle>
            <AlertDescription maxWidth="xl">
              It seems no data has been loaded into the application yet. You can
              load data from various formats in the Data section of the toolbar
              above.
            </AlertDescription>
          </Alert>
        )}
        {plotStore.plots.map((plot) => {
          if (plot.isLoading) {
            return (
              <PlotContainer key={plot.key} status="loading">
                <Spinner
                  key={`${plot.key}-loading`}
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                />
              </PlotContainer>
            );
          }

          switch (plot.type) {
            case 'heatmap': {
              const heatmapPlot = plot as GxpHeatmap;
              return <HeatmapPlot {...heatmapPlot} />;
            }

            case 'plotly': {
              const plotlyPlot = plot as GxpPlotly;
              return (
                <PlotlyPlot {...plotlyPlot}>
                  {plotlyPlot.options.showCaption &&
                    plotlyPlot.accessions.map((accession, index) => (
                      <PlotCaption
                        key={`${accession}-${index}`}
                        accession={accession}
                        caption={infoTable.getRowAsMap(accession)}
                        color={
                          plotlyPlot.accessions.length > 1
                            ? colors[index]
                            : undefined
                        }
                      />
                    ))}
                </PlotlyPlot>
              );
            }

            case 'pca': {
              const pcaPlot = plot as GxpPCA;
              return (
                <PCAPlot
                  key={pcaPlot.key}
                  data={pcaPlot.data}
                  layout={pcaPlot.layout}
                />
              );
            }
            default:
              break;
          }
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

      <FormikModal
        initialFocusRef={refIndividualLinesFormInitialFocus}
        isOpen={isIndividualLinesFormOpen}
        onClose={onIndividualLinesFormClose}
        size="xl"
        title="Individual Lines Plot"
        scrollBehavior="outside"
      >
        <IndividualLinesForm
          initialFocusRef={refIndividualLinesFormInitialFocus}
          onCancel={onIndividualLinesFormClose}
          onSubmit={onIndividualLinesFormSubmit}
        />
      </FormikModal>

      <FormikModal
        initialFocusRef={refStackedLinesFormInitialFocus}
        isOpen={isStackedLinesFormOpen}
        onClose={onStackedLinesFormClose}
        size="xl"
        title="Stacked Lines Plot"
        scrollBehavior="outside"
      >
        <StackedLinesForm
          initialFocusRef={refStackedLinesFormInitialFocus}
          onCancel={onStackedLinesFormClose}
          onSubmit={onStackedLinesFormSubmit}
        />
      </FormikModal>

      <FormikModal
        initialFocusRef={refHeatmapFormInitialFocus}
        isOpen={isHeatmapFormOpen}
        onClose={onHeatmapFormClose}
        size="xl"
        title="Heatmap Plot"
        scrollBehavior="outside"
      >
        <HeatmapForm
          initialFocusRef={refHeatmapFormInitialFocus}
          onCancel={onHeatmapFormClose}
          onSubmit={onHeatmapFormSubmit}
        />
      </FormikModal>

      <FormikModal
        initialFocusRef={refPCAFormInitialFocus}
        isOpen={isPCAFormOpen}
        onClose={onPCAFormClose}
        size="xl"
        title="PCA Plot"
        scrollBehavior="outside"
      >
        <PCAForm
          initialFocusRef={refPCAFormInitialFocus}
          onCancel={onPCAFormClose}
          onSubmit={onPCAFormSubmit}
        />
      </FormikModal>
    </Flex>
  );
};

export default observer(PlotsHome);
