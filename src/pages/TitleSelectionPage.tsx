import React from 'react';
import { Box, Container, Heading, Text, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { GAMES } from '../types/game';
// Using direct SVG paths as a fallback
const PokemonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const YugiohIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
);

const DuelMastersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
  </svg>
);


const TitleSelectionPage = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const handleTitleSelect = (gameId: string) => {
    navigate(`/${gameId}/deck-builder`);
  };

  return (
    <Box minH="calc(100vh - 64px)" bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
      <Container maxW="container.lg">
        <Box textAlign="center" mb={10}>
          <Heading as="h1" size="xl" mb={4}>
            デッキ構築を始めよう
          </Heading>
          <Text fontSize="lg" color={textColor}>
            構築したいゲームを選択してください
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {Object.entries(GAMES).map(([id, game]) => (
            <Box
              key={id}
              as="button"
              onClick={() => handleTitleSelect(id)}
              bg={cardBg}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              textAlign="center"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-4px)',
                boxShadow: 'lg',
                bg: hoverBg,
              }}
            >
              <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                w={20}
                h={20}
                mb={4}
                borderRadius="full"
                bg={`${game.colorScheme}.50`}
                color={`${game.colorScheme}.600`}
                fontSize="2xl"
              >
                {game.id === 'pokemon' && <PokemonIcon />}
                {game.id === 'yugioh' && <YugiohIcon />}
                {game.id === 'duelmasters' && <DuelMastersIcon />}
              </Box>
              <Heading as="h3" size="md" mb={2} color={`${game.colorScheme}.600`}>
                {game.name} デッキビルダー
              </Heading>
              <Text color={textColor} fontSize="sm">
                {game.name}のカードでデッキを構築できます
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default TitleSelectionPage;
