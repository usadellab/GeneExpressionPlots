import React from 'react';
import { Box } from '@chakra-ui/react';
import LinkCard from '@/components/link-card';
import { FaBookReader, FaCode } from 'react-icons/fa';

const DataHome: React.FC = () => {
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
      <LinkCard
        icon={FaBookReader}
        label="User Manual"
        text={`
          The user manual contains detailed information on how to load data
          and create new plots. All the data loaded in the application is kept
          private to your browser tab and will never be uploaded to the
          internet.
        `}
        href="https://zendro-dev.gitbook.io/geneexpressionplots/documentation/user-manual"
      />
      <LinkCard
        _hover={{
          textDecoration: 'none',
        }}
        icon={FaCode}
        label="API"
        text={`
          The application programming interface contains instructions for
          advanced users that want to deploy this application with data
          already pre-loaded. This type of deployment is useful to showcase
          public datasets.
        `}
        href="https://zendro-dev.gitbook.io/geneexpressionplots/documentation/api"
      />
    </Box>
  );
};

export default DataHome;
