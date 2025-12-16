import React from 'react';
import { Card as CardType } from '../../../types/card';
import { CardComponent } from './Card';
import { VStack, Text, Box, Button, HStack, Badge, IconButton } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

interface DeckBuilderProps {
  deck: CardType[];
  onAddCard: (card: CardType) => void;
  onRemoveCard: (cardIndex: number) => void;
  onClearDeck: () => void;
  onSaveDeck: () => void;
  onShareDeck: () => Promise<void>;
}

interface CardCount {
  card: CardType;
  count: number;
  indices: number[];
}

export const DeckBuilder: React.FC<DeckBuilderProps> = ({
  deck,
  onAddCard,
  onRemoveCard,
  onClearDeck,
  onSaveDeck,
  onShareDeck,
}) => {
  // カードをIDでグループ化して枚数をカウント
  const getCardCounts = (deck: CardType[]): CardCount[] => {
    const cardMap = new Map<string, CardCount>();
    
    deck.forEach((card, index) => {
      if (cardMap.has(card.id)) {
        const existing = cardMap.get(card.id)!;
        existing.count++;
        existing.indices.push(index);
      } else {
        cardMap.set(card.id, {
          card,
          count: 1,
          indices: [index]
        });
      }
    });
    
    return Array.from(cardMap.values());
  };

  const cardCounts = getCardCounts(deck);

  const handleIncrement = (card: CardType) => {
    // カードをデッキに追加
    onAddCard(card);
  };

  const handleDecrement = (indices: number[], card: CardType) => {
    // 現在のカード枚数を取得
    const currentCount = indices.length;
    
    if (currentCount > 1) {
      // 2枚以上ある場合は1枚削除
      onRemoveCard(indices[0]);
    } else if (currentCount === 1) {
      // 1枚の場合はカードを完全に削除
      onRemoveCard(indices[0]);
    }
    // 0枚の場合は何もしない（ボタンが無効になっているはず）
  };

  return (
    <VStack
      spacing={4}
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="gray.50"
      w="100%"
      minH="200px"
      position="relative"
    >
      <HStack w="100%" justify="space-between" align="center">
        <Text fontWeight="bold" fontSize="lg">デッキ</Text>
        <Box 
          bg="blue.500" 
          color="white" 
          px={3} 
          py={1} 
          borderRadius="full"
          fontSize="sm"
          fontWeight="bold"
        >
          {deck.length} / 60
        </Box>
      </HStack>
      
      <HStack spacing={4} w="100%" flexWrap="wrap">
        {deck.length === 0 ? (
          <Text color="gray.500" w="100%" textAlign="center">
            カードをクリックしてデッキに追加
          </Text>
        ) : (
          cardCounts.map(({ card, count, indices }) => (
            <VStack 
              key={card.id}
              spacing={1}
              align="center"
              position="relative"
            >
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCard(indices[0]);
                }}
                cursor="pointer"
                _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }}
              >
                <CardComponent card={card} isInDeck={true} />
              </Box>
              <HStack 
                bg="white" 
                borderRadius="md" 
                p={1} 
                boxShadow="sm"
                borderWidth="1px"
                borderColor="gray.200"
              >
                <IconButton
                  icon={<MinusIcon />}
                  size="xs"
                  aria-label="Remove one"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecrement(indices, card);
                  }}
                  isDisabled={count <= 0}
                />
                <Text minW="30px" textAlign="center" fontWeight="bold">
                  {count}
                </Text>
                <IconButton
                  icon={<AddIcon />}
                  size="xs"
                  aria-label="Add one"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncrement(card);
                  }}
                  isDisabled={count >= 4 && card.type !== 'エネルギー'}
                />
              </HStack>
            </VStack>
          ))
        )}
      </HStack>
      
      <HStack spacing={4} mt={4} justify="flex-end" flexWrap="wrap">
        <Button 
          colorScheme="blue" 
          onClick={onSaveDeck}
          isDisabled={deck.length === 0}
          flexShrink={0}
        >
          デッキを保存
        </Button>
        <Button 
          colorScheme="teal" 
          variant="outline"
          onClick={onShareDeck}
          isDisabled={deck.length === 0}
          flexShrink={0}
        >
          共有
        </Button>
        <Button 
          colorScheme="red" 
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('デッキからすべてのカードを削除しますか？')) {
              console.log('Clear deck button clicked');
              onClearDeck();
            }
          }}
          isDisabled={deck.length === 0}
          flexShrink={0}
        >
          デッキをクリア
        </Button>
      </HStack>
    </VStack>
  );
};

export default DeckBuilder;