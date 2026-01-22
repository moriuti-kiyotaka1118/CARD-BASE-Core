export type Civilization = '火' | '水' | '自然' | '光' | '闇' | 'ゼロ';

export type CardType = 'クリーチャー' | '呪文' | 'クロスギア' | '城' | '進化クリーチャー'| 'サイキック・クリーチャー' | 'サイキック・クロスギア' | 'ドラグハート・ウエポン' | 'ドラグハート・フォートレス' | 'ドラグハート・タマシード' | 'GRクリーチャー' | 'スター進化クリーチャー'| 'S-MAX進化クリーチャー' | 'NEOクリーチャー' | 'NEOドリーム・クリーチャー' | 'G-NEOクリーチャー' | 'G-NEOドリーム・クリーチャー' | 'エグザイル・クリーチャー' | '進化エグザイル・クリーチャー'| 'ドリーム・クリーチャー'| '進化ドリーム・クリーチャー'| '禁断クリーチャー'| 'ツインパクトカード'| '進化サイキック・クリーチャー'| 'ルール・プラス'| 'NEO GRクリーチャー'| '進化クロスギア'| 'オレガ・オーラ'| 'ギガ・オレガ・オーラ'| 'タマシード'| 'タマシード/クリーチャー'| '土地'| 'D2フィールド'| 'DGフィールド'| 'DMフィールド'| 'T2フィールド'| '幸せのフィールド'| 'ドラゴニック・フィールド'| 'ヒストリック・フィールド' | 'ルナティック・フィールド'| '禁断の鼓動'| '禁断フィールド'| '最終禁断フィールド'| '無月フィールド'| 'フェアリー・フィールド'| '零龍の儀'| 'Mono Artifact'| 'キング・セル';

export type ZoneType = 'main' | 'chojigen' | 'gr' | 'dolmageidon' | 'zeroryu';

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  type: CardType;
  civilization: Civilization;
  cost: number;
  power?: number; // Only for creatures
  race?: string;
  effectText: string;
  zonesSupported: ZoneType[];
  rarity?: string;
  set?: string;
  cardNumber?: string;
}

export interface DeckCard extends Card {
  zone: ZoneType;
}

export interface Deck {
  id: string;
  name: string;
  cards: DeckCard[];
  mainDeckCount: number;
  grCount: number;
  chojigenCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface DeckBuilderProps {
  onSaveDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialDeck?: Deck;
}

export interface CardListProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
  className?: string;
}

export interface DeckZoneProps {
  title: string;
  cards: DeckCard[];
  onCardClick: (card: DeckCard) => void;
  zoneType: ZoneType;
  maxCards?: number;
  className?: string;
}

export interface DeckAreaProps {
  deck: DeckCard[];
  onCardClick: (card: DeckCard) => void;
  className?: string;
}

export interface CardComponentProps {
  card: Card | DeckCard;
  onClick: () => void;
  className?: string;
  isInDeck?: boolean;
}

export interface HomePageProps {
  decks: Deck[];
  onDeckClick: (deckId: string) => void;
  onCreateNewDeck: () => void;
  onDeleteDeck: (deckId: string) => void;
}
