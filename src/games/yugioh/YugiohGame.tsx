import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel, 
  useToast, 
  Input, 
  Select, 
  HStack, 
  VStack, 
  Text, 
  Button, 
  Badge,
  SimpleGrid,
  Tooltip,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Divider,
  Heading,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon, MinusIcon, ExternalLinkIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import CardList from './components/CardList';
import CardComponent from './components/Card';
import { YugiohCard } from 'yugioh-types';

// デッキの型定義
interface Deck {
  id: string;
  name: string;
  mainDeck: { card: YugiohCard; count: number }[];
  extraDeck: { card: YugiohCard; count: number }[];
  sideDeck: { card: YugiohCard; count: number }[];
  lastUpdated: string;
}

// デッキの初期状態
const initialDeck: Omit<Deck, 'id' | 'lastUpdated'> = {
  name: '新しいデッキ',
  mainDeck: [],
  extraDeck: [],
  sideDeck: []
};

// カードデータを読み込み
const yugiohCardsData = require('./data/cards.json') as YugiohCard[];

interface YugiohGameProps {
  onGameChange: (game: string) => void;
}

const YUGIOH_STORAGE_KEY = 'yugioh-deck-builder-deck';

// カードの種類を抽出
const cardTypes = Array.from(new Set(yugiohCardsData.map(card => {
  if (card.type.includes('魔法')) return '魔法';
  if (card.type.includes('罠')) return '罠';
  if (card.type.includes('モンスター')) return 'モンスター';
  return 'その他';
})));

// 属性を抽出
const attributes = Array.from(new Set(
  yugiohCardsData
    .filter(card => card.attribute)
    .map(card => card.attribute as string)
));

const YugiohGame: React.FC<YugiohGameProps> = ({ onGameChange }) => {
  // モーダルの状態管理
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deckName, setDeckName] = useState('新しいデッキ');
  const [currentDeck, setCurrentDeck] = useState<Deck>(() => ({
    ...initialDeck,
    id: Date.now().toString(),
    lastUpdated: new Date().toISOString()
  }));
  const [savedDecks, setSavedDecks] = useState<Deck[]>([]);
  const [isEditingDeck, setIsEditingDeck] = useState(false);
  const [deck, setDeck] = useState<YugiohCard[]>(() => {
    const savedDeck = localStorage.getItem(YUGIOH_STORAGE_KEY);
    return savedDeck ? JSON.parse(savedDeck) : [];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('全て');
  const [selectedAttribute, setSelectedAttribute] = useState<string>('全て');
  const [selectedLevel, setSelectedLevel] = useState<string>('全て');
  const toast = useToast();

  // デッキをlocalStorageに保存
  useEffect(() => {
    localStorage.setItem(YUGIOH_STORAGE_KEY, JSON.stringify(deck));
  }, [deck]);

  // フィルタリングされたカードリスト
  const filteredCards = useMemo(() => {
    return (yugiohCardsData as YugiohCard[]).filter(card => {
      // 検索語でフィルタリング
      const matchesSearch = searchTerm === '' || 
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.description && card.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // 種類でフィルタリング
      const matchesType = selectedType === '全て' || 
        (selectedType === 'モンスター' && card.type.includes('モンスター')) ||
        (selectedType === '魔法' && card.type.includes('魔法')) ||
        (selectedType === '罠' && card.type.includes('罠')) ||
        (selectedType === 'その他' && !['モンスター', '魔法', '罠'].some(t => card.type.includes(t)));
      
      // 属性でフィルタリング
      const matchesAttribute = selectedAttribute === '全て' || 
        card.attribute === selectedAttribute;
      
      // レベルでフィルタリング
      const matchesLevel = selectedLevel === '全て' || 
        (card.level && card.level.toString() === selectedLevel) ||
        (card.rank && `R${card.rank}` === selectedLevel);
      
      return matchesSearch && matchesType && matchesAttribute && matchesLevel;
    });
  }, [searchTerm, selectedType, selectedAttribute, selectedLevel]);

  // デッキにカードを追加
  const addToDeck = (card: YugiohCard, deckType: 'mainDeck' | 'extraDeck' | 'sideDeck' = 'mainDeck') => {
    const deck = currentDeck[deckType];
    const cardIndex = deck.findIndex(item => item.card.id === card.id);
    const maxCards = deckType === 'extraDeck' ? 15 : 3;
    
    // デッキの最大枚数チェック
    if (deck.length >= maxCards && !deck[cardIndex]) {
      toast({
        title: 'エラー',
        description: `${deckType === 'extraDeck' ? 'エクストラデッキ' : 'サイドデッキ'}の最大枚数は${maxCards}枚です`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 同じカードが3枚以上ないかチェック
    const totalCardCount = [
      ...currentDeck.mainDeck,
      ...currentDeck.extraDeck,
      ...currentDeck.sideDeck
    ].reduce((total, item) => 
      item.card.id === card.id ? total + item.count : total, 0);

    if (totalCardCount >= 3) {
      toast({
        title: 'エラー',
        description: '同じカードはデッキに3枚までしか追加できません',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setCurrentDeck(prev => {
      const newDeck = { ...prev };
      
      if (cardIndex >= 0) {
        // 既存のカードの枚数を増やす
        newDeck[deckType] = [...newDeck[deckType]];
        newDeck[deckType][cardIndex] = {
          ...newDeck[deckType][cardIndex],
          count: Math.min(newDeck[deckType][cardIndex].count + 1, 3)
        };
      } else {
        // 新しいカードを追加
        newDeck[deckType] = [...newDeck[deckType], { card, count: 1 }];
      }
      
      return {
        ...newDeck,
        lastUpdated: new Date().toISOString()
      };
    });
    
    // 追加成功メッセージ
    toast({
      title: 'カードを追加',
      description: `${card.name}を${getDeckTypeName(deckType)}に追加しました`,
      status: 'success',
      duration: 1500,
      isClosable: true,
    });
  };

  // デッキからカードを削除
  const removeFromDeck = (cardId: string, deckType: 'mainDeck' | 'extraDeck' | 'sideDeck') => {
    setCurrentDeck(prev => {
      const deck = [...prev[deckType]];
      const cardIndex = deck.findIndex(item => item.card.id === cardId);
      
      if (cardIndex >= 0) {
        const removedCard = deck[cardIndex];
        
        // カードの枚数を減らす（1枚の場合は削除）
        if (deck[cardIndex].count > 1) {
          deck[cardIndex] = {
            ...deck[cardIndex],
            count: deck[cardIndex].count - 1
          };
        } else {
          deck.splice(cardIndex, 1);
        }
        
        const newDeck = {
          ...prev,
          [deckType]: deck,
          lastUpdated: new Date().toISOString()
        };
        
        // 削除メッセージ
        toast({
          title: 'カードを削除',
          description: `${removedCard.card.name}を${getDeckTypeName(deckType)}から削除しました`,
          status: 'info',
          duration: 1500,
          isClosable: true,
        });
        
        return newDeck;
      }
      
      return prev;
    });
  };

  // デッキをクリア
  const clearDeck = (deckType?: 'mainDeck' | 'extraDeck' | 'sideDeck') => {
    const confirmMessage = deckType 
      ? `${getDeckTypeName(deckType)}をクリアしますか？`
      : 'デッキをすべてクリアしますか？この操作は元に戻せません。';
    
    if (window.confirm(confirmMessage)) {
      setCurrentDeck(prev => {
        const newDeck = { ...prev };
        
        if (deckType) {
          newDeck[deckType] = [];
        } else {
          newDeck.mainDeck = [];
          newDeck.extraDeck = [];
          newDeck.sideDeck = [];
        }
        
        return {
          ...newDeck,
          lastUpdated: new Date().toISOString()
        };
      });
      
      toast({
        title: deckType ? `${getDeckTypeName(deckType)}をクリア` : 'デッキをクリア',
        description: deckType ? `${getDeckTypeName(deckType)}を空にしました` : 'デッキを空にしました',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // デッキを保存
  const saveDeck = () => {
    const mainDeckCount = currentDeck.mainDeck.reduce((sum, item) => sum + item.count, 0);
    const extraDeckCount = currentDeck.extraDeck.reduce((sum, item) => sum + item.count, 0);
    
    // デッキのバリデーション
    if (mainDeckCount < 40) {
      toast({
        title: 'メインデッキの枚数不足',
        description: 'メインデッキは40枚以上必要です',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (mainDeckCount > 60) {
      toast({
        title: 'メインデッキの枚数超過',
        description: 'メインデッキは60枚までです',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    if (extraDeckCount > 15) {
      toast({
        title: 'エクストラデッキの枚数超過',
        description: 'エクストラデッキは15枚までです',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // デッキを保存
    const savedDecks = JSON.parse(localStorage.getItem('yugioh-saved-decks') || '[]');
    const existingDeckIndex = savedDecks.findIndex((d: Deck) => d.id === currentDeck.id);
    
    const deckToSave = {
      ...currentDeck,
      name: deckName || '無題のデッキ',
      lastUpdated: new Date().toISOString()
    };
    
    if (existingDeckIndex >= 0) {
      savedDecks[existingDeckIndex] = deckToSave;
    } else {
      savedDecks.push(deckToSave);
    }
    
    localStorage.setItem('yugioh-saved-decks', JSON.stringify(savedDecks));
    setSavedDecks(savedDecks);
    onClose();
    
    toast({
      title: 'デッキを保存',
      description: `${deckToSave.name}を保存しました`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  // フィルターをリセット
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('全て');
    setSelectedAttribute('全て');
    setSelectedLevel('全て');
  };

  // デッキの統計情報を取得
  const getDeckStats = (deck: { card: YugiohCard; count: number }[]) => {
    let monster = 0;
    let spell = 0;
    let trap = 0;
    
    deck.forEach(({ card, count }) => {
      if (card.type.includes('モンスター')) monster += count;
      else if (card.type.includes('魔法')) spell += count;
      else if (card.type.includes('罠')) trap += count;
    });
    
    return {
      monster,
      spell,
      trap,
      total: monster + spell + trap
    };
  };
  
  const mainDeckStats = useMemo(() => getDeckStats(currentDeck.mainDeck), [currentDeck.mainDeck]);
  const extraDeckStats = useMemo(() => getDeckStats(currentDeck.extraDeck), [currentDeck.extraDeck]);
  const sideDeckStats = useMemo(() => getDeckStats(currentDeck.sideDeck), [currentDeck.sideDeck]);
  
  // デッキタイプの表示名を取得 (型を明示的に指定)
  const getDeckTypeName = (type: string | null | undefined): string => {
    if (!type) return '';
    switch (type) {
      case 'mainDeck': return 'メインデッキ';
      case 'extraDeck': return 'エクストラデッキ';
      case 'sideDeck': return 'サイドデッキ';
      default: return '';
    }
  };
  
  // デッキを読み込む
  const loadDeck = (deck: Deck) => {
    setCurrentDeck(deck);
    setDeckName(deck.name);
    setIsEditingDeck(true);
    onOpen();
  };
  
  // 新しいデッキを作成
  const createNewDeck = () => {
    setCurrentDeck({
      ...initialDeck,
      id: Date.now().toString(),
      lastUpdated: new Date().toISOString()
    });
    setDeckName('新しいデッキ');
    setIsEditingDeck(false);
    onOpen();
  };
  
  // 保存済みデッキを読み込む
  useEffect(() => {
    const saved = localStorage.getItem('yugioh-saved-decks');
    if (saved) {
      setSavedDecks(JSON.parse(saved));
    }
  }, []);

  // 現在選択中のデッキタイプを管理 (nullはデッキ選択画面を表示するための状態)
  const [selectedDeckType, setSelectedDeckType] = useState<'mainDeck' | 'extraDeck' | 'sideDeck' | null>(null);
  
  // 現在選択中のデッキのカードを取得
  const currentDeckCards = useMemo(() => {
    if (selectedDeckType === null) return [];
    
    const cards: Array<{card: YugiohCard, instanceId: string}> = [];
    
    currentDeck[selectedDeckType].forEach((deckItem: { card: YugiohCard; count: number }) => {
      for (let i = 0; i < deckItem.count; i++) {
        cards.push({
          card: deckItem.card,
          instanceId: `${deckItem.card.id}-${i}`
        });
      }
    });
    return cards;
  }, [currentDeck, selectedDeckType]);

  // カードをデッキに追加
  const handleAddToDeck = (card: YugiohCard) => {
    if (!selectedDeckType) return;
    
    // エクストラデッキカードは常にエクストラデッキに、それ以外は選択中のデッキタイプに追加
    const deckType = card.type.includes('エクストラ') ? 'extraDeck' : selectedDeckType;
    
    setCurrentDeck(prev => {
      const deck = { ...prev };
      const deckArray = [...deck[deckType]];
      const existingCardIndex = deckArray.findIndex(item => item.card.id === card.id);
      
      // デッキタイプごとの最大枚数をチェック
      const maxCards = deckType === 'mainDeck' ? 60 : 15;
      const currentCount = deckArray.reduce((sum, item) => sum + item.count, 0);
      
      if (currentCount >= maxCards) {
        toast({
          title: 'エラー',
          description: `${deckType === 'mainDeck' ? 'メインデッキ' : 'エクストラデッキ'}の最大枚数に達しています`,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
        return prev;
      }
      
      // 同名カードの最大枚数をチェック
      if (existingCardIndex >= 0) {
        if (deckArray[existingCardIndex].count >= 3) {
          toast({
            title: 'エラー',
            description: '同名カードは3枚までしか追加できません',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
          return prev;
        }
        deckArray[existingCardIndex].count += 1;
      } else {
        deckArray.push({ card, count: 1 });
      }
      
      return {
        ...deck,
        [deckType]: deckArray,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  // デッキからカードを削除
  const handleRemoveFromDeck = (instanceId: string) => {
    if (selectedDeckType === null) return;
    
    const cardId = instanceId.split('-')[0]; // 元のカードIDを取得
    const deckType = selectedDeckType;
    
    setCurrentDeck(prev => {
      const deckItems = [...prev[deckType]];
      const cardIndex = deckItems.findIndex(item => item.card.id === cardId);
      
      if (cardIndex === -1) return prev;
      
      const newItems = [...deckItems];
      const existingItem = newItems[cardIndex];
      
      if (existingItem.count > 1) {
        // 同じカードが複数ある場合はカウントを減らす
        newItems[cardIndex] = {
          ...existingItem,
          count: existingItem.count - 1
        };
      } else {
        // カードを削除
        newItems.splice(cardIndex, 1);
      }
      
      return {
        ...prev,
        [deckType]: newItems,
        lastUpdated: new Date().toISOString()
      };
    });
  };

  // デッキタイプ選択画面を表示
  if (selectedDeckType === null) {
    return (
      <Box p={4} textAlign="center">
        <VStack spacing={6} maxW="md" mx="auto">
          <Button 
            colorScheme="blue" 
            size="lg" 
            w="100%" 
            h="80px"
            onClick={() => setSelectedDeckType('mainDeck')}
            leftIcon={<Box w="24px" h="24px" bg="blue.500" borderRadius="md" />}
            justifyContent="center"
            _focus={{ boxShadow: 'none' }}
            _active={{ bg: 'blue.500' }}
          >
            メインデッキを作成
          </Button>
          
          <Button 
            colorScheme="purple" 
            size="lg" 
            w="100%" 
            h="80px"
            onClick={() => setSelectedDeckType('extraDeck')}
            leftIcon={<Box w="24px" h="24px" bg="purple.500" borderRadius="md" />}
            justifyContent="center"
            _focus={{ boxShadow: 'none' }}
            _active={{ bg: 'purple.500' }}
          >
            エクストラデッキを作成
          </Button>
          
          <Button 
            colorScheme="green" 
            size="lg" 
            w="100%" 
            h="80px"
            onClick={() => setSelectedDeckType('sideDeck')}
            leftIcon={<Box w="24px" h="24px" bg="green.500" borderRadius="md" />}
            justifyContent="center"
            _focus={{ boxShadow: 'none' }}
            _active={{ bg: 'green.500' }}
          >
            サイドデッキを作成
          </Button>
        </VStack>
      </Box>
    );
  }
  
  // Using the getDeckTypeName function defined above

  return (
    <Box p={4}>
      {/* デッキ表示エリア */}
      <Box mb={6} p={4} borderWidth={1} borderRadius="md" bg="white" boxShadow="sm">
        <HStack justifyContent="space-between" mb={4}>
          <Button 
            colorScheme="gray" 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedDeckType(null as any)}
            leftIcon={<ChevronLeftIcon />}
            _focus={{ boxShadow: 'none' }}
          >
            デッキ選択に戻る
          </Button>
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              {getDeckTypeName(selectedDeckType)}
              {selectedDeckType === 'mainDeck' && ` (${currentDeck.mainDeck.reduce((sum, item) => sum + item.count, 0)})`}
              {selectedDeckType === 'extraDeck' && ` (${currentDeck.extraDeck.reduce((sum, item) => sum + item.count, 0)}/15)`}
              {selectedDeckType === 'sideDeck' && ` (${currentDeck.sideDeck.reduce((sum, item) => sum + item.count, 0)}/15)`}
            </Text>
          </Box>
          <Box w="100px"></Box> {/* 左右のバランスを取るための空のBox */}
        </HStack>
        {currentDeckCards.length > 0 ? (
          <SimpleGrid columns={{ base: 3, sm: 4, md: 6, lg: 8 }} spacing={2}>
            {currentDeckCards.map(({card, instanceId}) => (
              <Box 
                key={instanceId}
                as="button"
                type="button"
                position="relative"
                _hover={{ opacity: 0.8, cursor: 'pointer' }}
                onClick={() => handleRemoveFromDeck(instanceId)}
                aria-label="カードを削除"
                p={0}
                m={0}
                border="none"
                bg="transparent"
              >
                <Box transform="scale(0.8)" transformOrigin="top left">
                  <CardComponent 
                    card={card}
                    showActions={false}
                  />
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        ) : (
          <Text color="gray.500" textAlign="center" py={4}>
            デッキにカードが追加されていません。下のカード一覧からカードを追加してください。
          </Text>
        )}
      </Box>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb={4}>
          <Tab>カード一覧</Tab>
          <Tab>デッキ管理</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {/* 検索・フィルターエリア */}
              <Box 
                p={4} 
                bg="white" 
                borderRadius="md" 
                boxShadow="sm"
              >
                <HStack mb={4} spacing={4} flexWrap="wrap">
                  <Box flex="1" minW="200px">
                    <Input
                      placeholder="カード名・テキストで検索"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="md"
                    />
                  </Box>
                  
                  <Select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    maxW="150px"
                  >
                    <option value="全て">全ての種類</option>
                    {cardTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                  
                  <Select 
                    value={selectedAttribute} 
                    onChange={(e) => setSelectedAttribute(e.target.value)}
                    maxW="120px"
                  >
                    <option value="全て">全ての属性</option>
                    {attributes.map(attr => (
                      <option key={attr} value={attr}>{attr}</option>
                    ))}
                  </Select>
                  
                  <Select 
                    value={selectedLevel} 
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    maxW="120px"
                  >
                    <option value="全て">全てのレベル</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(level => (
                      <option key={level} value={level.toString()}>Lv{level}</option>
                    ))}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(rank => (
                      <option key={`R${rank}`} value={`R${rank}`}>R{rank}</option>
                    ))}
                  </Select>
                  
                  <Button 
                    onClick={resetFilters}
                    leftIcon={<span>×</span>}
                    size="md"
                    variant="outline"
                  >
                    リセット
                  </Button>
                </HStack>
                
                {searchTerm || selectedType !== '全て' || selectedAttribute !== '全て' || selectedLevel !== '全て' ? (
                  <Text color="gray.600" fontSize="sm">
                    {filteredCards.length}枚のカードが見つかりました
                  </Text>
                ) : null}
              </Box>
              
              {/* カード一覧 */}
              <CardList 
                cards={filteredCards} 
                onAddToDeck={handleAddToDeck} 
              />
            </VStack>
          </TabPanel>
          
          <TabPanel px={0}>
            <VStack spacing={6} align="stretch">
              {/* 保存済みデッキ一覧 */}
              {savedDecks.length > 0 && (
                <Box>
                  <Heading size="md" mb={4}>保存済みデッキ</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {savedDecks.map(deck => (
                      <Box 
                        key={deck.id} 
                        p={4} 
                        borderWidth="1px" 
                        borderRadius="md"
                        _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                        onClick={() => loadDeck(deck)}
                      >
                        <Text fontWeight="bold">{deck.name}</Text>
                        <Text fontSize="sm" color="gray.600">
                          メイン: {deck.mainDeck.reduce((sum, item) => sum + item.count, 0)}枚 / 
                          エクストラ: {deck.extraDeck.reduce((sum, item) => sum + item.count, 0)}枚 / 
                          サイド: {deck.sideDeck.reduce((sum, item) => sum + item.count, 0)}枚
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          最終更新: {new Date(deck.lastUpdated).toLocaleString()}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
              
              {/* 現在のデッキ */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Heading size="md">現在のデッキ: {currentDeck.name || '無題のデッキ'}</Heading>
                  <Button 
                    colorScheme="blue" 
                    size="sm" 
                    onClick={() => {
                      setDeckName(currentDeck.name || '無題のデッキ');
                      setIsEditingDeck(true);
                      onOpen();
                    }}
                  >
                    デッキを保存
                  </Button>
                </HStack>
                
                {/* メインデッキ */}
                <DeckSection 
                  title="メインデッキ" 
                  cards={currentDeck.mainDeck}
                  stats={mainDeckStats}
                  maxCards={60}
                  onAddCard={(card) => addToDeck(card, 'mainDeck')}
                  onRemoveCard={(cardId) => removeFromDeck(cardId, 'mainDeck')}
                  onClearDeck={() => clearDeck('mainDeck')}
                  colorScheme="green"
                />
                
                {/* エクストラデッキ */}
                <DeckSection 
                  title="エクストラデッキ" 
                  cards={currentDeck.extraDeck}
                  stats={extraDeckStats}
                  maxCards={15}
                  onAddCard={(card) => addToDeck(card, 'extraDeck')}
                  onRemoveCard={(cardId) => removeFromDeck(cardId, 'extraDeck')}
                  onClearDeck={() => clearDeck('extraDeck')}
                  colorScheme="blue"
                  mt={6}
                />
                
                {/* サイドデッキ */}
                <DeckSection 
                  title="サイドデッキ" 
                  cards={currentDeck.sideDeck}
                  stats={sideDeckStats}
                  maxCards={15}
                  onAddCard={(card) => addToDeck(card, 'sideDeck')}
                  onRemoveCard={(cardId) => removeFromDeck(cardId, 'sideDeck')}
                  onClearDeck={() => clearDeck('sideDeck')}
                  colorScheme="purple"
                  mt={6}
                />
              </Box>
            </VStack>
            
            {/* デッキ保存モーダル */}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{isEditingDeck ? 'デッキを編集' : '新しいデッキを作成'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>デッキ名</FormLabel>
                      <Input 
                        value={deckName}
                        onChange={(e) => setDeckName(e.target.value)}
                        placeholder="デッキ名を入力"
                      />
                    </FormControl>
                    
                    <Box w="100%">
                      <Text fontWeight="bold">デッキ情報</Text>
                      <Text>メインデッキ: {mainDeckStats.total}枚</Text>
                      <Text>エクストラデッキ: {extraDeckStats.total}枚</Text>
                      <Text>サイドデッキ: {sideDeckStats.total}枚</Text>
                      
                      {mainDeckStats.total < 40 && (
                        <Text color="red.500">※ メインデッキは40枚以上必要です</Text>
                      )}
                      {mainDeckStats.total > 60 && (
                        <Text color="red.500">※ メインデッキは60枚までです</Text>
                      )}
                      {extraDeckStats.total > 15 && (
                        <Text color="red.500">※ エクストラデッキは15枚までです</Text>
                      )}
                      {sideDeckStats.total > 15 && (
                        <Text color="red.500">※ サイドデッキは15枚までです</Text>
                      )}
                    </Box>
                  </VStack>
                </ModalBody>
                
                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>
                    キャンセル
                  </Button>
                  <Button 
                    colorScheme="blue" 
                    onClick={saveDeck}
                    isDisabled={
                      !deckName || 
                      mainDeckStats.total < 40 || 
                      mainDeckStats.total > 60 ||
                      extraDeckStats.total > 15 ||
                      sideDeckStats.total > 15
                    }
                  >
                    保存
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

// デッキセクションコンポーネント
const DeckSection = ({
  title,
  cards,
  stats,
  maxCards,
  onAddCard,
  onRemoveCard,
  onClearDeck,
  colorScheme = 'gray',
  ...props
}: {
  title: string;
  cards: { card: YugiohCard; count: number }[];
  stats: { monster: number; spell: number; trap: number; total: number };
  maxCards: number;
  onAddCard: (card: YugiohCard) => void;
  onRemoveCard: (cardId: string) => void;
  onClearDeck: () => void;
  colorScheme?: string;
  [key: string]: any;
}) => (
  <Box 
    borderWidth="1px" 
    borderRadius="md" 
    p={4} 
    bg="white"
    {...props}
  >
    <HStack justify="space-between" mb={4}>
      <HStack>
        <Heading size="md">{title}</Heading>
        <Badge 
          colorScheme={stats.total <= maxCards ? colorScheme : 'red'}
          borderRadius="full"
          px={2}
        >
          {stats.total}/{maxCards}枚
        </Badge>
      </HStack>
      <Button 
        size="sm" 
        variant="outline" 
        colorScheme="red"
        onClick={onClearDeck}
        leftIcon={<DeleteIcon />}
      >
        クリア
      </Button>
    </HStack>
    
    {/* デッキ内訳 */}
    <HStack mb={4} spacing={4}>
      <Text fontSize="sm">
        <Badge colorScheme="blue" mr={1}>モンスター</Badge> {stats.monster}
      </Text>
      <Text fontSize="sm">
        <Badge colorScheme="green" mr={1}>魔法</Badge> {stats.spell}
      </Text>
      <Text fontSize="sm">
        <Badge colorScheme="pink" mr={1}>罠</Badge> {stats.trap}
      </Text>
    </HStack>
    
    {/* カード一覧 */}
    {cards.length === 0 ? (
      <Text color="gray.500" textAlign="center" py={4}>
        カードが追加されていません
      </Text>
    ) : (
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={3}>
        {cards.map(({ card, count }) => (
          <Box 
            key={card.id} 
            borderWidth="1px" 
            borderRadius="md" 
            p={2}
            bg="white"
            position="relative"
            _hover={{ shadow: 'md' }}
          >
            <Box 
              position="absolute" 
              top={1} 
              right={1} 
              bg="white" 
              borderRadius="full" 
              w={6} 
              h={6} 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              borderWidth="1px"
              borderColor="gray.200"
              zIndex={1}
            >
              <Text fontSize="xs" fontWeight="bold">×{count}</Text>
            </Box>
            <Box 
              as="img" 
              src={card.imageUrl || 'https://via.placeholder.com/150x210?text=No+Image'} 
              alt={card.name}
              w="100%"
              borderRadius="sm"
              mb={1}
            />
            <Text fontSize="xs" fontWeight="bold" noOfLines={1} title={card.name}>
              {card.name}
            </Text>
            <HStack mt={1} justify="space-between">
              <Button 
                size="xs" 
                colorScheme={colorScheme} 
                onClick={() => onAddCard(card)}
                isDisabled={count >= 3}
              >
                <AddIcon />
              </Button>
              <Button 
                size="xs" 
                colorScheme="red" 
                variant="outline"
                onClick={() => onRemoveCard(card.id)}
              >
                <MinusIcon />
              </Button>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    )}
  </Box>
);

export default YugiohGame;
