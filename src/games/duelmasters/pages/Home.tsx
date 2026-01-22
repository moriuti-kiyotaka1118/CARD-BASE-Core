import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card as CardType } from '../types';

interface Deck {
  id: string;
  name: string;
  cards: CardType[];
  createdAt: number;
  updatedAt: number;
}

interface HomeProps {
  onDeckClick: (deckId: string) => void;
  onCreateNewDeck: () => void;
  decks: Deck[];
}

const Home: React.FC<HomeProps> = ({ onDeckClick, onCreateNewDeck, decks }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h1 style={{ margin: 0 }}>デュエル・マスターズ デッキ一覧</h1>
        <button
          onClick={onCreateNewDeck}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          デッキ作成
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
      }}>
        {decks.map((deck) => (
          <div
            key={deck.id}
            onClick={() => onDeckClick(deck.id)}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: 'white',
            }}
          >
            <div style={{
              height: '120px',
              backgroundColor: '#f5f5f5',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
            }}>
              {deck.cards.length > 0 ? (
                <img 
                  src={deck.cards[0].imageUrl} 
                  alt={deck.cards[0].name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100px',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/card-back.jpg';
                  }}
                />
              ) : (
                <span>No Image</span>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{deck.name}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>{deck.cards.length}枚</div>
            </div>
          </div>
        ))}

        {decks.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px 0',
            color: '#888',
          }}>
            デッキが登録されていません。右上の「デッキ作成」ボタンから作成してください。
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
