import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

interface ComingSoonPageProps {
  title: string;
  description: string;
}

const ComingSoonPage = ({ title, description }: ComingSoonPageProps) => {
  return (
    <Box 
      minH="calc(100vh - 200px)" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      p={4}
    >
      <VStack spacing={6} textAlign="center" maxW="md" mx="auto">
        <Box>
          <Heading as="h1" size="xl" mb={4} color="blue.500">
            {title}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {description}
          </Text>
        </Box>
        <Button 
          as={RouterLink} 
          to="/" 
          colorScheme="blue" 
          size="lg"
          mt={4}
        >
          ホームに戻る
        </Button>
      </VStack>
    </Box>
  );
};

export default ComingSoonPage;
