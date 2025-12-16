import React from 'react';
import { Box, Container, Heading, Text, VStack, HStack, Button, SimpleGrid, useColorModeValue, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiGrid, FiSearch, FiBookmark } from 'react-icons/fi';
import { IconType } from 'react-icons';

const HomePage = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const textColor = useColorModeValue('gray.600', 'gray.300');
  
  const features: {
    icon: any; // Using any to bypass the type issue with Chakra UI Icon
    title: string;
    description: string;
    to: string;
    color: string;
  }[] = [
    {
      icon: FiGrid,
      title: 'カードを探す',
      description: '様々なカードを検索して見つけましょう',
      to: '/search',
      color: 'blue.500'
    },
    {
      icon: FiBookmark,
      title: 'デッキを作成',
      description: 'お気に入りのカードでデッキを作成しましょう',
      to: '/decks/select-title',
      color: 'green.500'
    },
    {
      icon: FiSearch,
      title: 'デッキを探す',
      description: '他のユーザーのデッキを参考にしましょう',
      to: '/decks',
      color: 'purple.500'
    }
  ];

  return (
    <Box minH="calc(100vh - 64px)" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="container.xl" py={12}>
        <VStack spacing={6} textAlign="center" mb={16}>
          <Heading as="h1" size="2xl" fontWeight="bold" lineHeight="1.2">
            Card Base へようこそ
          </Heading>
          <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')} maxW="2xl">
            お気に入りのカードゲームのデッキを作成・管理・共有できるプラットフォームです
          </Text>
        </VStack>

        <Box>
          <Heading as="h2" size="xl" mb={8} textAlign="center">
            主な機能
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {features.map((feature, index) => (
              <Box
                key={index}
                as={RouterLink}
                to={feature.to}
                p={6}
                bg={cardBg}
                borderWidth="1px"
                borderColor={cardBorder}
                borderRadius="lg"
                transition="all 0.2s"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg',
                  bg: hoverBg,
                  borderColor: feature.color,
                }}
                textAlign="center"
              >
                <Box
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w={16}
                  h={16}
                  mb={4}
                  borderRadius="full"
                  bg={`${feature.color}0f`}
                  color={feature.color}
                >
                  {React.createElement(feature.icon, { size: 24 })}
                </Box>
                <Heading as="h3" size="md" mb={2} color={feature.color}>
                  {feature.title}
                </Heading>
                <Text color={textColor}>
                  {feature.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
