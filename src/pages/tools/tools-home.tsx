import React from 'react';
import NavCard from '@/components/nav-card';
import { Box } from '@chakra-ui/react';
import { FaDna } from 'react-icons/fa';
import { BiTestTube } from 'react-icons/bi';

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
          The gene browser provides an interface to search and inspect the
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
    </Box>
  );
};

export default ToolsPage;
