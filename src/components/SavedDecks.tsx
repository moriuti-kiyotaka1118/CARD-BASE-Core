import React from 'react';
import { VStack, Heading, Button, Box, Text, useToast, HStack, Badge, SimpleGrid } from '@chakra-ui/react';
import { Card as CardType } from '../types/card';
// Card component is not used directly in this file, so we can remove this import

const DECK_STORAGE_KEY = 'card-deck-builder-deck';

interface SavedDecksProps {
  onBack: () => void;
  onLoadDeck: (deck: CardType[]) => void;
  storageKey: string;
}

export const SavedDecks: React.FC<SavedDecksProps> = ({ onBack, onLoadDeck, storageKey }) => {
  const [savedDecks, setSavedDecks] = React.useState<{id: string, name: string, cards: CardType[]}[]>([]);
  const toast = useToast();

  // 保存されたデッキを読み込む
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const decks = JSON.parse(saved);
        // 古い形式のデータを新しい形式に変換
        const formattedDecks = Object.entries(decks).map(([name, cards]) => ({
          id: `${name}-${Date.now()}`,
          name,
          cards: cards as CardType[]
        }));
        setSavedDecks(formattedDecks);
      }
    } catch (error) {
      console.error('Failed to load saved decks', error);
    }
  }, [storageKey]);

  // デッキを削除
  const handleDeleteDeck = (id: string) => {
    const updatedDecks = savedDecks.filter(deck => deck.id !== id);
    setSavedDecks(updatedDecks);
    // 新しい形式で保存
    const decksToSave: Record<string, CardType[]> = {};
    updatedDecks.forEach(deck => {
      decksToSave[deck.name] = deck.cards;
    });
    localStorage.setItem(storageKey, JSON.stringify(decksToSave));
    
    toast({
      title: 'デッキを削除しました',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // デッキを読み込む
  const handleLoadDeck = (deck: CardType[]) => {
    onLoadDeck(deck);
    onBack();
    
    toast({
      title: 'デッキを読み込みました',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={6} w="100%">
      <HStack w="100%" justifyContent="space-between">
        <Heading size="lg">保存されたデッキ</Heading>
        <Button colorScheme="blue" onClick={onBack}>戻る</Button>
      </HStack>

      {savedDecks.length === 0 ? (
        <Text>保存されたデッキがありません</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="100%">
          {savedDecks.map((savedDeck) => (
            <Box 
              key={savedDeck.id}
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              bg="white"
              boxShadow="sm"
            >
              <Box h="120px" mb={4} p={2} borderRadius="md" bg="gray.50" display="flex" alignItems="center">
                <HStack spacing={2} w="100%" justify="center">
                  {Array.from(new Set(savedDeck.cards.map(card => card.id)))
                    .slice(0, 3)
                    .map(id => {
                      const card = savedDeck.cards.find(c => c.id === id);
                      return card ? (
                        <Box 
                          key={card.id} 
                          w="80px" 
                          h="100px"
                          overflow="hidden"
                          borderRadius="md"
                          bg="gray.100"
                          flexShrink={0}
                        >
                          {card.imageUrl && (
                            <img 
                              src={card.imageUrl} 
                              alt={card.name}
                              style={{ 
                                width: '100%', 
                                height: '100%',
                                objectFit: 'contain',
                                objectPosition: 'center'
                              }}
                            />
                          )}
                        </Box>
                      ) : null;
                    })}
                  {savedDeck.cards.length > 3 && (
                    <Box 
                      w="80px" 
                      h="100px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg="gray.200"
                      borderRadius="md"
                    >
                      <Text fontSize="sm" fontWeight="bold">
                        +{savedDeck.cards.length - 3}
                      </Text>
                    </Box>
                  )}
                </HStack>
              </Box>
              
              <HStack spacing={2} justifyContent="flex-end">
                <Button 
                  size="sm" 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={() => handleLoadDeck(savedDeck.cards)}
                >
                  読み込む
                </Button>
                <Button 
                  size="sm" 
                  colorScheme="red" 
                  variant="ghost"
                  onClick={() => handleDeleteDeck(savedDeck.id)}
                >
                  削除
                </Button>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default SavedDecks;
