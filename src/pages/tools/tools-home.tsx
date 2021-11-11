import React from 'react';
import NavCard from '@/components/nav-card';
import { Box } from '@chakra-ui/react';
import { FaDna } from 'react-icons/fa';
import { BiTestTube } from 'react-icons/bi';
import { VscGraphScatter } from 'react-icons/vsc';

const ToolsPage: React.FC = () => {
  return (
    <Box
      as="main"
      padding={6}
      width="100%"
      __css={{
        '& a:not(:first-of-type)': {
          marginTop: '2rem',
        },
      }}
    >
      <NavCard
        icon={FaDna}
        label="Gene Browser"
        text={`
          The gene browser provides is a tools to search and inspect the
          individual gene information stored in the replicates database.
          All searches are privately kept within your browser and will not be
          sent anywhere.
        `}
        to="/tools/gene-browser"
      />
      <NavCard
        icon={BiTestTube}
        label="Enrichment Analyses"
        text={`
          The enrichment analyses tool allows you to run enrichment tests for your data.
          Use the "Gene Info Table" to store information about differentially expressed genes.
          All tests and results will be private to your browser and will not be sent anywhere.
        `}
        to="/tools/enrichment"
      />

      <NavCard
        icon={VscGraphScatter}
        label="MapMan Functional Annotations"
        text={`
          The MapMan Functional Annotations provide resources to run functional annotations on your
          sequence data via Mercator v4, that can automatically be linked to your sublementary gene information.
          You can directly use that meta data to plot MapMan Classification and expression of your genes. 
        `}
        to="/tools/mapman"
      />
    </Box>
  );
};

export default ToolsPage;
