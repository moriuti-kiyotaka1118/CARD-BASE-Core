import React, { useState } from 'react';
import { Card as CardType } from '../../../types/card';
import { CardComponent } from './Card';
import { VStack, HStack, Input, SimpleGrid, Box, Select, Text, Button } from '@chakra-ui/react';

interface CardListProps {
  cards: CardType[];
  onDropCard: (card: CardType) => void;
  onSearch: (query: string) => void;
  onFilterChange: (type: string) => void;
  selectedType: string;
}

export const CardList: React.FC<CardListProps> = ({
  cards,
  onDropCard,
  onSearch,
  onFilterChange,
  selectedType,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleCardClick = (card: CardType) => {
    // カードを直接デッキに追加
    onDropCard(card);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.value);
  };

  return (
    <VStack spacing={4} w="100%" maxW="1400px" mx="auto" p={4}>
      <Text mb={2} fontWeight="bold">カード一覧</Text>

      <VStack spacing={4} w="100%" align="stretch">
        {/* 検索バー */}
        <Input
          placeholder="カード名で検索"
          value={searchQuery}
          onChange={handleSearch}
          mb={4}
        />
        
        <HStack spacing={4} w="100%" flexWrap="wrap">
          {/* タイプフィルター */}
          <Box flex="1" minW="200px">
            <Select
              placeholder="絞り込み"
              value={selectedType}
              onChange={(e) => onFilterChange(e.target.value)}
              w="100%"
            >
              <option value="">すべて</option>
              <option value="草">草</option>
              <option value="炎">炎</option>
              <option value="水">水</option>
              <option value="雷">雷</option>
              <option value="超">超</option>
              <option value="闘">闘</option>
              <option value="悪">悪</option>
              <option value="鋼">鋼</option>
              <option value="ドラゴン">ドラゴン</option>
              <option value="無色">無色</option>
              <option value="サポート">サポート</option>
              <option value="グッズ">グッズ</option>
              <option value="スタジアム">スタジアム</option>
　　　　　　　　<option value="特殊エネルギー">特殊エネルギー</option>
              <option value="エーススペック">エーススペック</option>

            </Select>
          </Box>
          
          {/* エネルギー専用フィルターボタン */}
          <Button
            colorScheme={selectedType === 'エネルギー' || selectedType === '特殊エネルギー' ? 'blue' : 'gray'}
            variant={selectedType === 'エネルギー' || selectedType === '特殊エネルギー' ? 'solid' : 'outline'}
            onClick={() => onFilterChange(selectedType === 'エネルギー' ? '' : 'エネルギー')}
            minW="100px"
          >
            基本エネルギー
          </Button>
        </HStack>

        {/* 🟦 カード一覧 */}
        <Box display="flex" justifyContent="center" w="100%" px={4} mt={4}>
          <SimpleGrid 
            columns={{ base: 1, md: 3, lg: 5 }} 
            spacing={2}
            w="100%"
            maxW="1400px"
            justifyItems="center"
            alignItems="center"
            rowGap={8}
            columnGap={3}
          >
            {cards.map((card) => (
              <CardComponent 
                card={card} 
                onClick={() => handleCardClick(card)} 
              />
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </VStack>
  );
};

export default CardList;