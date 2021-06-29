import React from 'react';
import NavCard from '@/components/nav-card';
import { Box } from '@chakra-ui/react';
import { FaDna } from 'react-icons/fa';

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
    </Box>
  );
};

export default ToolsPage;
