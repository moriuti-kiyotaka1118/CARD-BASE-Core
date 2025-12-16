import { Card } from '../types/card';

export const encodeDeck = (deck: Card[]): string => {
  // デッキをカードIDの配列に変換
  const cardIds = deck.map(card => card.id);
  // カードIDの配列をJSON文字列に変換してBase64エンコード
  return btoa(JSON.stringify(cardIds));
};

export const decodeDeck = (encodedString: string, allCards: Card[]): Card[] => {
  try {
    // Base64デコードしてJSONパース
    const cardIds = JSON.parse(atob(encodedString)) as string[];
    // カードIDからカードオブジェクトを取得
    return cardIds.map(id => allCards.find(card => card.id === id)).filter(Boolean) as Card[];
  } catch (error) {
    console.error('Failed to decode deck:', error);
    return [];
  }
};

export const generateShareLink = (deck: Card[]): string => {
  const encodedDeck = encodeDeck(deck);
  return `${window.location.origin}${window.location.pathname}?deck=${encodeURIComponent(encodedDeck)}`;
};

export const loadDeckFromUrl = (allCards: Card[]): Card[] | null => {
  const params = new URLSearchParams(window.location.search);
  const deckParam = params.get('deck');
  
  if (!deckParam) return null;
  
  return decodeDeck(decodeURIComponent(deckParam), allCards);
};
