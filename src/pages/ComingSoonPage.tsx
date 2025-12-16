import React from 'react';
import { Box, Button, Container, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Icon } from '@chakra-ui/icons';

interface ComingSoonPageProps {
  title: string;
  description: string;
}

const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ title, description }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box minH="calc(100vh - 64px)" display="flex" alignItems="center" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.md" py={12}>
        <Box
          bg={bgColor}
          borderRadius="xl"
          p={8}
          boxShadow="lg"
          borderWidth="1px"
          borderColor={borderColor}
          textAlign="center"
        >
          <VStack spacing={6}>
            <Box
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              w={20}
              h={20}
              borderRadius="full"
              bg="blue.50"
              color="blue.500"
              mb={4}
            >
              <Box as="span" fontSize="2.5rem">🚀</Box>
            </Box>
            
            <Heading as="h1" size="xl" fontWeight="bold">
              {title}
            </Heading>
            
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')} maxW="2xl" mx="auto">
              {description}
            </Text>
            
            <Text fontSize="md" color={useColorModeValue('gray.500', 'gray.400')} mt={2}>
              この機能は現在開発中です。もうしばらくお待ちください。
            </Text>
            
            <Button
              as={RouterLink}
              to="/"
              leftIcon={<ArrowBackIcon />}
              colorScheme="blue"
              variant="outline"
              mt={6}
            >
              ホームに戻る
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default ComingSoonPage;
