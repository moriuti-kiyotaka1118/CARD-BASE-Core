import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCards } from '../mockCards';
import DeckArea from '../components/DeckArea';
import CardList from '../components/CardList';
import CardDetail from '../components/CardDetail';
import { Card as CardType, Deck, DeckCard, ZoneType } from '../types';

interface DeckBuilderProps {
  onSaveDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialDeck?: Deck;
}

// Helper function to create a deck card from a card and zone
const toDeckCard = (card: CardType, zone: ZoneType = 'main'): DeckCard => ({
  ...card,
  zone,
});

// Helper function to get cards that can be added to a specific zone
const getCardsForZone = (cards: CardType[], zone: ZoneType): CardType[] => {
  return cards.filter(card => card.zonesSupported.includes(zone));
};

const DeckBuilder: React.FC<DeckBuilderProps> = ({ 
  onSaveDeck, 
  initialDeck 
}) => {
  const [deck, setDeck] = useState<DeckCard[]>(initialDeck?.cards || []);
  const [deckName, setDeckName] = useState(initialDeck?.name || '新しいデッキ');
  const [selectedZone, setSelectedZone] = useState<ZoneType>('main');
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const navigate = useNavigate();

  // Filter cards that can be added to the selected zone
  const availableCards = useMemo(() => {
    return getCardsForZone(mockCards, selectedZone);
  }, [selectedZone]);

  // Count cards in each zone
  const cardCounts = useMemo(() => {
    return deck.reduce((acc, card) => {
      acc[card.zone] = (acc[card.zone] || 0) + 1;
      return acc;
    }, {} as Record<ZoneType, number>);
  }, [deck]);

  const handleAddCard = useCallback((card: CardType) => {
    // Check if we can add more cards to this zone
    const maxCards = {
      main: 60,
      chojigen: 8,
      gr: 12,
      dolmageidon: 1,
      zeroryu: 1,
    }[selectedZone];

    const currentCount = cardCounts[selectedZone] || 0;
    if (currentCount >= maxCards) return;

    // Check if this is a unique card (for dolmageidon and zeroryu)
    if ((selectedZone === 'dolmageidon' || selectedZone === 'zeroryu') && 
        deck.some(c => c.zone === selectedZone)) {
      return;
    }

    setDeck(prevDeck => [...prevDeck, toDeckCard(card, selectedZone)]);
  }, [selectedZone, deck, cardCounts]);

  const handleRemoveCard = useCallback((cardToRemove: DeckCard) => {
    setDeck(prevDeck => {
      const index = prevDeck.findIndex(card => 
        card.id === cardToRemove.id && card.zone === cardToRemove.zone
      );
      if (index === -1) return prevDeck;
      
      const newDeck = [...prevDeck];
      newDeck.splice(index, 1);
      return newDeck;
    });
  }, []);

  const handleCardClick = useCallback((card: CardType) => {
    setSelectedCard(card);
  }, []);

  const handleCloseCardDetail = useCallback(() => {
    setSelectedCard(null);
  }, []);

  const handleAddCardFromDetail = useCallback((card: CardType) => {
    handleAddCard(card);
    // Don't close modal automatically after adding card
  }, [handleAddCard]);

  const handleRemoveCardFromDetail = useCallback((card: CardType) => {
    const deckCard = deck.find(c => c.id === card.id && c.zone === selectedZone);
    if (deckCard) {
      handleRemoveCard(deckCard);
    }
    handleCloseCardDetail();
  }, [deck, selectedZone, handleRemoveCard, handleCloseCardDetail]);

  const isCardInDeck = useCallback((card: CardType) => {
    return deck.some(deckCard => deckCard.id === card.id && deckCard.zone === selectedZone);
  }, [deck, selectedZone]);

  const handleSaveDeck = () => {
    if (deck.length === 0) return;
    
    const deckToSave: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'> = {
      name: deckName,
      cards: deck,
      mainDeckCount: cardCounts.main || 0,
      grCount: cardCounts.gr || 0,
      chojigenCount: cardCounts.chojigen || 0,
    };
    
    onSaveDeck(deckToSave);
    navigate('/duelmasters');
  };

  const zoneButtons: { zone: ZoneType; label: string }[] = [
    { zone: 'main', label: 'メインデッキ' },
    { zone: 'chojigen', label: '超次元' },
    { zone: 'gr', label: 'GR' },
    { zone: 'dolmageidon', label: 'ドルマゲドン' },
    { zone: 'zeroryu', label: '零龍' },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
    }}>
      <div style={{
        padding: '10px',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        width: 'fit-content',
      }}>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
      </div>

      {/* Zone selector */}
      <div style={{ 
        display: 'flex', 
        gap: '8px',
        marginBottom: '15px',
        overflowX: 'auto',
        paddingBottom: '5px',
        alignItems: 'center',
      }}>
        {zoneButtons.map(({ zone, label }) => {
          const count = cardCounts[zone] || 0;
          const max = {
            main: 60,
            chojigen: 8,
            gr: 12,
            dolmageidon: 1,
            zeroryu: 1,
          }[zone];
          const isFull = count >= max;
          
          // Special display for main deck: show "40~60" range
          const displayCount = zone === 'main' 
            ? `${count}/40~60` 
            : `${count}${max > 0 ? `/${max}` : ''}`;
          
          return (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: selectedZone === zone ? '#007bff' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {label} ({displayCount})
            </button>
          );
        })}
        <button
          onClick={handleSaveDeck}
          style={{
            padding: '8px 20px',
            fontSize: '14px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >
          デッキを保存
        </button>
      </div>

      {/* Deck Area */}
      <div style={{ marginBottom: '10px' }}>
        <DeckArea 
          deck={deck}
          onCardClick={handleRemoveCard}
          selectedZone={selectedZone}
        />
      </div>

      {/* Card List */}
      <div>
        <CardList 
          cards={availableCards}
          onCardClick={handleCardClick}
        />
      </div>

      {/* Card Detail Modal */}
      <CardDetail 
        card={selectedCard}
        onClose={handleCloseCardDetail}
        onAddToDeck={handleAddCardFromDetail}
        onRemoveFromDeck={handleRemoveCardFromDetail}
        isInDeck={selectedCard ? isCardInDeck(selectedCard) : false}
      />
      </div>
    </div>
  );
};

export default DeckBuilder;
