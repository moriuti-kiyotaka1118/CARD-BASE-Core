import React from 'react';
import { Box, VStack } from '@chakra-ui/react';

export const GameLayout: React.FC<{
  children: React.ReactNode;
}> = ({
  children,
}) => {
  return (
    <VStack spacing={4} w="100%" align="stretch">
      <Box p={4}>
        {children}
      </Box>
    </VStack>
  );
};
