import React from 'react';
import { Box } from '@chakra-ui/react';
import NavCard from '@/components/nav-card';
import { FaFileAlt, FaLayerGroup } from 'react-icons/fa';

const DataPage: React.FC = () => {
  return (
    <Box
      as="main"
      padding={6}
      width="100%"
      __css={{
        '& a:not(:first-child)': {
          marginTop: '2rem',
        },
      }}
    >
      <NavCard
        _hover={{
          textDecoration: 'none',
        }}
        icon={FaFileAlt}
        label="File Browser"
        text={`
          The file browser provides tools to import, export, and inspect data in the
          database. All data is privately kept within your browser and will
          not be uploaded anywhere.
        `}
        to="/data/files"
      />
      <NavCard
        _hover={{
          textDecoration: 'none',
        }}
        icon={FaLayerGroup}
        label="Factors Manager"
        text={`
          The factors manager allows you group the data within collections and
          then use these in the statistical analyses when creating visualizations.
        `}
        to="/data/factors"
      />
    </Box>
  );
};

export default DataPage;
