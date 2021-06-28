import React from 'react';
import { Box } from '@chakra-ui/react';

import GeneCard from './gene-browser-card';
import { dataTable, infoTable } from '@/store/data-store';
// import { settings } from '@/store/settings';

import { escapeRegExp } from '@/utils/string';
import GeneBrowserForm, { BrowserFormSubmitHandler } from './gene-browser-form';

interface GeneCard {
  accession: string;
  geneInfo: Map<string, string>;
}

const GeneBrowser: React.FC = () => {
  const [pageView, setPageView] = React.useState<{
    geneCards: GeneCard[];
    pageMax: number;
  }>({
    geneCards: [],
    pageMax: 1,
  });

  /* AUXILIARY */

  const computeGeneView = React.useCallback(
    (
      accessionId: string,
      countView: number,
      pageNum: number
    ): {
      geneCards: GeneCard[];
      pageMax: number;
    } => {
      // Retrieve gene information matching the search parameters (empty search matches all)
      const regexp = new RegExp(escapeRegExp(accessionId), 'i');
      const matchingResults = dataTable.rowNames.reduce(
        (matches, accession) => {
          // Match text in the accessions ids
          const accessionMatch = accession.search(regexp) > -1;

          // Match text in the info fields
          const geneInfo = infoTable.getRowAsMap(accession) ?? new Map();
          const infoMatch = geneInfo
            ? Array.from(geneInfo.values()).some(
                (field) => field.search(regexp) > -1
              )
            : false;

          // Include in the results if any matches are found
          if (accessionMatch || infoMatch)
            matches.push({
              accession,
              geneInfo,
            });

          return matches;
        },
        [] as Array<{ accession: string; geneInfo: Map<string, string> }>
      );

      // Calculate the current page view
      const start = (pageNum - 1) * countView;
      const end = pageNum * countView;
      const geneCards = matchingResults.slice(start, end);

      // Calculate the number of pages according to the current display options
      const pageMax = Math.ceil(matchingResults.length / countView) || 1;

      // console.log({ geneCards, pageMax });

      // setPageView({ geneCards, pageMax });
      return { geneCards, pageMax };
    },
    []
  );

  /* LYFECYCLE */

  React.useEffect(() => {
    const pageView = computeGeneView('', 20, 1);
    setPageView(pageView);
  }, [computeGeneView]);

  /* EVENTS */

  // /**
  //  * Update the _countDisplay_ state property.
  //  * @param {React.ChangeEvent<HTMLSelectElement>} event
  //  */
  // const onDisplayCountSelect = (event) => {
  //   const countView = event.target.value;
  //   this.setState({ countView });
  // };

  // /**
  //  * Re-evaluate the captions result, including only accessions ids matching fully or
  //  * partially the current _searchId_ state property. This event also re-calculates the
  //  * _countOffset_ and _countView_ state properties.
  //  * @param {React.KeyboardEvent} event
  //  */
  // const onGeneSearchSubmit = (event) => {
  //   if (event.key === 'Enter') {
  //     this.setState({ pageOffset: 1, searchId: event.target.value });
  //   }
  // };

  // /**
  //  * Update the _pageOffset_ state property.
  //  * @param {React.ChangeEvent<HTMLInputElement} event
  //  */
  // onPageOffsetChange = (event) => {
  //   let pageOffset = event.target.value;

  //   if (pageOffset <= 0 || pageOffset > this.state.pageMax) {
  //     pageOffset = this.state.pageOffset;
  //   }

  //   this.setState({ pageOffset });
  // };

  const onBrowserFormSubmit: BrowserFormSubmitHandler = (values, actions) => {
    const pageView = computeGeneView(
      values.accessionId,
      values.countView,
      values.pageNum
    );

    console.log(pageView);

    setPageView(pageView);

    actions.setSubmitting(false);
  };

  // /**
  //  * Toggle the gene details modal visibility.
  //  * @param {React.MouseEvent<HTMLDivElement>} event
  //  */
  // selectGene = (selectedGene) => {
  //   let selectedGeneCounts;
  //   if (selectedGene) {
  //     const table = dataTable.getRowAsMap(selectedGene, true);
  //     selectedGeneCounts = [...table.entries()].map(
  //       ([[group, sample, replicate], count]) => ({
  //         group,
  //         sample,
  //         replicate,
  //         count,
  //       })
  //     );
  //   }
  //   this.setState({ selectedGene, selectedGeneCounts });
  // };

  return (
    <Box backgroundColor="white" padding={6}>
      <GeneBrowserForm
        alignItems="start"
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="space-around"
        onSubmit={onBrowserFormSubmit}
        pageMax={pageView.pageMax}
      />

      {pageView.geneCards.map(({ accession, geneInfo }) => (
        <GeneCard
          _first={{
            marginTop: 5,
          }}
          _even={{
            backgroundColor: 'orange.50',
          }}
          _hover={{
            backgroundColor: 'orange.100',
            cursor: 'pointer',
          }}
          _focus={{
            outline: '1px solid',
            outlineColor: 'orange.600',
            backgroundColor: 'orange.100',
          }}
          accession={accession}
          geneInfo={geneInfo}
          key={accession}
          padding={5}
          tabIndex={0}
        />
      ))}

      {/* {this.state.selectedGene && (
        <AppModal
          className="flex flex-col w-full h-full md:w-5/6 md:h-5/6 lg:w-3/4 2xl:w-1/2"
          title={this.state.selectedGene}
          showModal={this.state.selectedGene}
          hideModal={() => this.selectGene()}
        >
          <GeneDetails
            countUnit={settings.gxpSettings.unit}
            geneCounts={this.state.selectedGeneCounts}
          />
        </AppModal>
      )} */}
    </Box>
  );
};

export default GeneBrowser;
