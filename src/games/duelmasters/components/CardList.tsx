import React from 'react';
import Card from './Card';
import { Card as CardType } from '../types';

interface CardListProps {
  cards: CardType[];
  onCardClick: (card: CardType) => void;
  className?: string;
}

const CardList: React.FC<CardListProps> = ({ 
  cards, 
  onCardClick,
  className = ''
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    width: '1069.31px',
    height: '93.81px',
    padding: '5px',
    backgroundColor: '#1a1a1a',
    gap: '2px',
    boxSizing: 'border-box',
  };

  return (
    <div 
      style={containerStyle} 
      className={`card-list ${className}`}
    >
      {cards.map((card) => (
        <div key={card.id} style={{ display: 'inline-block' }}>
          <Card 
            card={card} 
            onClick={() => onCardClick(card)}
            isInDeck={true}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(CardList);
