import React, { useState, useEffect } from 'react';
import { VStack, HStack, Heading, Button, useToast } from '@chakra-ui/react';
import { Card as CardType } from '../../types/card';
import { CardList } from './components/CardList';
import { DeckBuilder } from './components/DeckBuilder';
import { SavedDecks } from '../../components/SavedDecks';
import { generateShareLink, loadDeckFromUrl } from '../../utils/deckUtils';

const DECK_STORAGE_KEY = 'pokemon-deck-builder-deck';

type ViewMode = 'builder' | 'savedDecks';

interface PokemonGameProps {
  onGameChange: (game: string) => void;
}

export const PokemonGame: React.FC<PokemonGameProps> = ({ onGameChange }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('builder');
  const [allCards, setAllCards] = useState<CardType[]>([]);
  const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
  const [deck, setDeck] = useState<CardType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const toast = useToast();

  // カードデータの読み込み
  useEffect(() => {
    // すべてのカードデータを同時に読み込む
    Promise.all([
      import('./data/cards.json'),
      import('./data/energyCards.json'),
      import('./data/specialEnergyCards.json'),
      import('./data/aceSpecCards.json'),
      import('./data/stadiumCards.json')
    ]).then(([cardsData, energyCardsData, specialEnergyCardsData, aceSpecCardsData, stadiumCardsData]) => {
      // すべてのカードを結合
      const allCardsData = [
        ...cardsData.default, 
        ...energyCardsData.default,
        ...specialEnergyCardsData.default,
        ...aceSpecCardsData.default,
        ...stadiumCardsData.default
      ];
      
      setAllCards(allCardsData);
      
      // 初期表示では特殊カードを非表示にする（特殊エネルギーは表示）
      const initialFilteredCards = allCardsData.filter(card => 
        !['エネルギー', 'エーススペック', 'スタジアム'].includes(card.type)
      );
      setFilteredCards(initialFilteredCards);
      
      // URLからデッキを読み込む
      const urlDeck = loadDeckFromUrl(allCardsData);
      if (urlDeck && urlDeck.length > 0) {
        setDeck(urlDeck);
      } else {
        // URLにデッキがなければローカルストレージから読み込む
        const savedDeck = localStorage.getItem(DECK_STORAGE_KEY);
        if (savedDeck) {
          try {
            setDeck(JSON.parse(savedDeck));
          } catch (error) {
            console.error('Failed to parse saved deck', error);
          }
        }
      }
    });
  }, []);

  // カードのフィルタリングとソート
  useEffect(() => {
    let result = [...allCards];
    
    // 検索クエリでフィルタリング
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(card => 
        card.name.toLowerCase().includes(query) ||
        (card.description && card.description.toLowerCase().includes(query))
      );
    }
    
    // タイプでフィルタリング
    if (selectedType) {
      if (selectedType === 'すべて' || selectedType === '特殊エネルギー') {
        result = result.filter(card => card.type === '特殊エネルギー');
      } else if (selectedType === 'エネルギー') {
        // 基本エネルギーカードのみをフィルタリング
        result = result.filter(card => card.type === 'エネルギー');
      } else {
        result = result.filter(card => card.type === selectedType);
      }
    } else {
      // デフォルトでは基本エネルギーカードのみ非表示、特殊エネルギーは表示
      result = result.filter(card => card.type !== 'エネルギー');
    }
    
    // カードをソート
    result.sort((a, b) => {
      // 基本エネルギー → 通常カード → 特殊エネルギーの順にソート
      const aType = a.type === 'エネルギー' ? 0 : (a.type === '特殊エネルギー' ? 2 : 1);
      const bType = b.type === 'エネルギー' ? 0 : (b.type === '特殊エネルギー' ? 2 : 1);
      
      if (aType !== bType) return aType - bType;
      
      // 同じカテゴリ内では名前順にソート
      return a.name.localeCompare(b.name);
    });
    
    setFilteredCards(result);
  }, [searchQuery, selectedType, allCards]);

  // デッキの変更を保存
  useEffect(() => {
    if (deck.length > 0) {
      localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
    }
  }, [deck]);

  const isEnergyCard = (card: CardType): boolean => {
    // カード名に「エネルギー」が含まれるか、タイプがエネルギー系のものを判定
    return card.name.includes('エネルギー') || 
           card.type === '無色エネルギー' ||
           card.type === '炎エネルギー' ||
           card.type === '水エネルギー' ||
           card.type === '雷エネルギー' ||
           card.type === '草エネルギー' ||
           card.type === '超エネルギー' ||
           card.type === '闘エネルギー' ||
           card.type === '悪エネルギー' ||
           card.type === '鋼エネルギー' ||
           card.type === 'フェアリエネルギー' ||
           card.type === '闘エネルギー';
  };

  const handleDropCard = (card: CardType) => {
    setDeck(prevDeck => {
      // デッキの最大枚数チェック (60枚)
      if (prevDeck.length >= 60) {
        toast({
          title: 'デッキの最大枚数に達しています',
          description: 'ポケモンカードのデッキは最大60枚までです',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        return prevDeck;
      }

      // エーススペックカードのチェック
      if (card.type === 'エーススペック') {
        const hasAceSpec = prevDeck.some(c => c.type === 'エーススペック');
        if (hasAceSpec) {
          toast({
            title: 'エラー',
            description: 'エーススペックカードはデッキに1枚しか入れることができません',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
          return prevDeck;
        }
        return [...prevDeck, { ...card }];
      }

      // スタジアムカードのチェック（1種類につき4枚まで）
      if (card.type === 'スタジアム') {
        const sameStadiumCount = prevDeck.filter(c => 
          c.type === 'スタジアム' && c.name === card.name
        ).length;
        
        if (sameStadiumCount >= 4) {
          toast({
            title: 'スタジアムカードの最大枚数に達しています',
            description: `同じスタジアムカードは4枚までしかデッキに入れることができません`,
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
          return prevDeck;
        }
        return [...prevDeck, { ...card }];
      }

      // 基本エネルギーカードの場合は制限なし
      if (card.type === 'エネルギー') {
        return [...prevDeck, { ...card }];
      }
      
      // 特殊エネルギーカードの場合は種類ごとに4枚まで
      if (card.type === '特殊エネルギー') {
        const sameSpecialEnergyCount = prevDeck.filter(c => 
          c.type === '特殊エネルギー' && c.name === card.name
        ).length;
        
        if (sameSpecialEnergyCount >= 4) {
          toast({
            title: '特殊エネルギーの最大枚数に達しています',
            description: `同じ特殊エネルギーカードは4枚までしかデッキに入れることができません`,
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
          return prevDeck;
        }
        return [...prevDeck, { ...card }];
      }
      
      // 通常カードの場合は同名カード4枚まで
      const sameCardCount = prevDeck.filter(c => c.id === card.id).length;
      
      if (sameCardCount >= 4) {
        toast({
          title: 'カードの最大枚数に達しています',
          description: '同じカードは4枚までしかデッキに入れることができません',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        return prevDeck;
      }

      return [...prevDeck, { ...card }];
    });
  };

  const handleRemoveCard = (cardIndex: number) => {
    setDeck(prevDeck => {
      const newDeck = [...prevDeck];
      newDeck.splice(cardIndex, 1);
      return newDeck;
    });
  };

  const handleClearDeck = () => {
    setDeck([]);
    localStorage.removeItem(DECK_STORAGE_KEY);
  };

  const handleSaveDeck = () => {
    if (deck.length === 0) return;
    
    const deckName = prompt('デッキ名を入力してください:');
    if (!deckName) return;
    
    const savedDecks = JSON.parse(localStorage.getItem('saved-pokemon-decks') || '{}');
    savedDecks[deckName] = deck;
    localStorage.setItem('saved-pokemon-decks', JSON.stringify(savedDecks));
    
    toast({
      title: 'デッキを保存しました',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleLoadDeck = (loadedDeck: CardType[]) => {
    setDeck(loadedDeck);
    setViewMode('builder');
  };

  const handleShareDeck = async () => {
    try {
      const shareUrl = generateShareLink(deck);
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: 'デッキのURLをコピーしました',
        description: shareUrl,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Failed to copy deck URL', error);
      toast({
        title: '共有に失敗しました',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (viewMode === 'savedDecks') {
    return (
      <SavedDecks 
        onBack={() => setViewMode('builder')}
        onLoadDeck={handleLoadDeck}
        storageKey="saved-pokemon-decks"
      />
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      <HStack justifyContent="space-between" w="100%">
        <Heading size="lg">ポケモンカード デッキビルダー</Heading>
        <Button 
          colorScheme="blue" 
          variant="outline"
          onClick={() => setViewMode('savedDecks')}
        >
          保存したデッキを見る
        </Button>
      </HStack>
      
      <DeckBuilder 
        deck={deck}
        onAddCard={handleDropCard}
        onRemoveCard={handleRemoveCard}
        onClearDeck={handleClearDeck}
        onSaveDeck={handleSaveDeck}
        onShareDeck={handleShareDeck}
      />
      
      <CardList 
        cards={filteredCards}
        onDropCard={handleDropCard}
        onSearch={setSearchQuery}
        onFilterChange={setSelectedType}
        selectedType={selectedType}
      />
    </VStack>
  );
};
