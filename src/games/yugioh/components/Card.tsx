import React from 'react';
import { Box, VStack, HStack, Text, Badge, Image } from '@chakra-ui/react';
import { YugiohCard } from 'yugioh-types';

interface CardProps {
  card: YugiohCard;
  onAddToDeck?: () => void;
  onRemoveFromDeck?: () => void;
  showActions?: boolean;
}

export const CardComponent: React.FC<CardProps> = ({
  card,
  onAddToDeck,
  onRemoveFromDeck,
  showActions = true,
}) => {
  return (
    <Box
      position="relative"
      _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }}
      w="100%"
      h="100%"
    >
      <Box
        w="100%"
        h="240px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        onClick={onAddToDeck}
      >
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            objectFit="contain"
            maxW="100%"
            maxH="100%"
          />
        ) : (
          <Text color="gray.500">No Image</Text>
        )}
      </Box>
      
      {onRemoveFromDeck && (
        <Box
          position="absolute"
          top="-8px"
          right="-8px"
          bg="red.500"
          color="white"
          borderRadius="full"
          w="24px"
          h="24px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={onRemoveFromDeck}
          zIndex={1}
          _hover={{ bg: 'red.600' }}
        >
          ×
        </Box>
      )}
    </Box>
  );
};

export default CardComponent;
