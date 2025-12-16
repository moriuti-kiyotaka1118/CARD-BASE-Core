import React from 'react';
import { SimpleGrid, Box } from '@chakra-ui/react';
import { YugiohCard } from 'yugioh-types';
import CardComponent from './Card';

interface CardListProps {
  cards: YugiohCard[];
  onAddToDeck: (card: YugiohCard) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onAddToDeck }) => {
  return (
    <SimpleGrid 
      columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
      spacing={4}
      p={2}
    >
      {cards.map((card) => (
        <Box key={card.id}>
          <CardComponent 
            card={card} 
            onAddToDeck={() => onAddToDeck(card)}
            showActions={true}
          />
        </Box>
      ))}
    </SimpleGrid>
  );
};

export default CardList;
