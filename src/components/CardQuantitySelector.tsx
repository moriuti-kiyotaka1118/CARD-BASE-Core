import React, { useState } from 'react';
import { HStack, Button, Input, Text } from '@chakra-ui/react';

interface CardQuantitySelectorProps {
  max: number;
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

export const CardQuantitySelector: React.FC<CardQuantitySelectorProps> = ({
  max,
  onConfirm,
  onCancel,
}) => {
  const [quantity, setQuantity] = useState<number>(1);

  const handleIncrement = () => {
    if (quantity < max) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= max) {
      setQuantity(value);
    }
  };

  return (
    <HStack spacing={2} p={2} bg="white" borderRadius="md" boxShadow="md">
      <Text fontSize="sm" whiteSpace="nowrap">枚数を選択:</Text>
      <Button size="xs" onClick={handleDecrement} isDisabled={quantity <= 1}>
        -
      </Button>
      <Input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        min={1}
        max={max}
        w="60px"
        textAlign="center"
        size="sm"
      />
      <Button size="xs" onClick={handleIncrement} isDisabled={quantity >= max}>
        +
      </Button>
      <Button
        colorScheme="blue"
        size="xs"
        onClick={() => onConfirm(quantity)}
      >
        追加
      </Button>
      <Button size="xs" variant="outline" onClick={onCancel}>
        キャンセル
      </Button>
    </HStack>
  );
};

export default CardQuantitySelector;
