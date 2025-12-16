import React from 'react';
import { Box, VStack, HStack, Text, Badge } from '@chakra-ui/react';
import { Card as CardType } from '../../../types/card';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isInDeck?: boolean;
}

export const CardComponent: React.FC<CardProps> = ({ card, onClick, isInDeck = false }) => {
  const opacity = 1;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={0}
      bg="white"
      boxShadow="md"
      opacity={opacity}
      cursor="pointer"
      w={isInDeck ? "120px" : "150px"}
      h={isInDeck ? "160px" : "200px"}
      onClick={onClick}
      _hover={{ transform: 'translateY(-4px)', transition: 'transform 0.2s' }}
    >
      {/* Card Image */}
      <Box 
        bg="gray.100" 
        h={isInDeck ? "160px" : "200px"} 
        w="100%"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        {card.imageUrl ? (
          <>
            <img 
              src={card.imageUrl} 
              alt={card.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
              onError={(e) => {
                // If image fails to load, show the fallback
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <Box 
              display="none"
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="gray.200"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              p={2}
              textAlign="center"
            >
              <Text color="gray.500" fontSize="sm" fontWeight="bold">
                画像を読み込めません
              </Text>
              <Text color="gray.400" fontSize="xs" mt={1}>
                {card.name}
              </Text>
            </Box>
          </>
        ) : (
          <Box 
            w="100%" 
            h="100%" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            flexDirection="column"
            p={2}
          >
            <Text color="gray.400" fontSize="sm" fontWeight="bold">
              画像がありません
            </Text>
            <Text color="gray.400" fontSize="xs" mt={1}>
              {card.name}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CardComponent;