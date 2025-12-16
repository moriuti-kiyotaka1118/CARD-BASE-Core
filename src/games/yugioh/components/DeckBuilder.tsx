import React from 'react';
import { VStack, HStack, Text, Box, Button, Badge, useToast, SimpleGrid } from '@chakra-ui/react';
import { YugiohCard } from 'yugioh-types';
import CardComponent from './Card';

interface DeckBuilderProps {
  deck: YugiohCard[];
  onRemoveFromDeck: (cardId: string) => void;
  onClearDeck: () => void;
  onSaveDeck: () => void;
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({
  deck,
  onRemoveFromDeck,
  onClearDeck,
  onSaveDeck,
}) => {
  const toast = useToast();
  
  const countByType = (type: string) => {
    return deck.filter(card => card.type.includes(type)).length;
  };

  const monsterCount = countByType('モンスター');
  const spellCount = countByType('魔法');
  const trapCount = countByType('罠');
  const totalCards = deck.length;

  return (
    <VStack spacing={4} align="stretch">
      <Box p={4} borderWidth={1} borderRadius="md" bg="white">
        <HStack justifyContent="space-between" mb={4}>
          <Text fontSize="xl" fontWeight="bold">デッキ構成</Text>
          <HStack>
            <Badge colorScheme="blue">モンスター: {monsterCount}</Badge>
            <Badge colorScheme="green">魔法: {spellCount}</Badge>
            <Badge colorScheme="red">罠: {trapCount}</Badge>
            <Text fontWeight="bold">合計: {totalCards}/40</Text>
          </HStack>
        </HStack>

        {totalCards === 0 ? (
          <Text color="gray.500" textAlign="center" py={4}>
            デッキにカードが追加されていません
          </Text>
        ) : (
          <Box
            borderWidth={1}
            borderRadius="md"
            p={4}
            minH="200px"
            bg="gray.50"
          >
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 6 }} spacing={2}>
              {deck.map((card, index) => (
                <Box key={`${card.id}-${index}`} position="relative">
                  <Box
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    w="20px"
                    h="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    onClick={() => onRemoveFromDeck(card.id)}
                    zIndex={1}
                  >
                    ×
                  </Box>
                  <Box transform="scale(0.8)" transformOrigin="top left">
                    <CardComponent 
                      card={card} 
                      showActions={false}
                    />
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}

        <HStack mt={4} justifyContent="flex-end" spacing={4}>
          <Button 
            colorScheme="red" 
            variant="outline" 
            onClick={onClearDeck}
            isDisabled={totalCards === 0}
          >
            デッキをクリア
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={() => {
              onSaveDeck();
              toast({
                title: 'デッキを保存しました',
                status: 'success',
                duration: 2000,
                isClosable: true,
              });
            }}
            isDisabled={totalCards === 0}
          >
            デッキを保存
          </Button>
        </HStack>
      </Box>
    </VStack>
  );
};

export default DeckBuilder;
