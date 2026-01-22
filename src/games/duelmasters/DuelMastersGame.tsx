import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import DeckBuilder from './pages/DeckBuilder';
import { Card as CardType, Deck } from './types';

const DECK_STORAGE_KEY = 'duelmasters-decks';

interface DuelMastersGameProps {
  onGameChange: (gameId: string) => void;
}

const DuelMastersGame: React.FC<DuelMastersGameProps> = ({ onGameChange }) => {
  const [decks, setDecks] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDecks = localStorage.getItem(DECK_STORAGE_KEY);
    if (savedDecks) {
      setDecks(JSON.parse(savedDecks));
    }
  }, []);

  const saveDeck = (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const now = Date.now();
    const newDecks = [...decks];
    
    if (deckData.id) {
      // Update existing deck
      const index = newDecks.findIndex(d => d.id === deckData.id);
      if (index !== -1) {
        newDecks[index] = {
          ...newDecks[index],
          ...deckData,
          updatedAt: now,
        };
      }
    } else {
      // Create new deck
      newDecks.push({
        ...deckData,
        id: `deck-${now}`,
        createdAt: now,
        updatedAt: now,
      });
    }
    
    setDecks(newDecks);
    localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(newDecks));
    navigate('/duelmasters');
  };

  const deleteDeck = (deckId: string) => {
    const newDecks = decks.filter(deck => deck.id !== deckId);
    localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(newDecks));
    setDecks(newDecks);
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <Home 
            onDeckClick={(deckId) => navigate(`/duelmasters/edit/${deckId}`)}
            onCreateNewDeck={() => navigate('/duelmasters/new')}
            decks={decks}
          />
        } 
      />
      <Route 
        path="/new" 
        element={
          <DeckBuilder 
            onSaveDeck={saveDeck}
          />
        } 
      />
      <Route 
        path="/edit/:deckId" 
        element={
          <DeckBuilder 
            onSaveDeck={(deckData) => {
              const deckId = window.location.pathname.split('/').pop();
              saveDeck({
                ...deckData,
                ...(deckId && { id: deckId })
              });
            }}
            initialDeck={decks.find(d => d.id === window.location.pathname.split('/').pop())}
          />
        } 
      />
    </Routes>
  );
};

export default DuelMastersGame;
