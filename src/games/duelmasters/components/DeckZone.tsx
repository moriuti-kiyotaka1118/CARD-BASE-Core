import React from 'react';
import Card from './Card';
import { DeckCard, ZoneType } from '../types';

interface DeckZoneProps {
  title: string;
  cards: DeckCard[];
  onCardClick: (card: DeckCard) => void;
  zoneType: ZoneType;
  maxCards?: number;
  className?: string;
}

const zoneTitles: Record<ZoneType, string> = {
  main: 'メインデッキ',
  chojigen: '超次元ゾーン',
  gr: 'GRゾーン',
  dolmageidon: 'ドルマゲドン',
  zeroryu: '零龍',
};

const zoneMaxCards: Record<ZoneType, number> = {
  main: 40,
  chojigen: 10,
  gr: 10,
  dolmageidon: 1,
  zeroryu: 1,
};

const DeckZone: React.FC<DeckZoneProps> = ({
  title,
  cards,
  onCardClick,
  zoneType,
  maxCards,
  className = '',
}) => {
  const max = maxCards ?? zoneMaxCards[zoneType] ?? 0;
  const isFull = cards.length >= max;
  const countText = zoneType === 'main' 
    ? `${cards.length}/${max}` 
    : `${cards.length}`;

  const containerStyle: React.CSSProperties = {
    border: '1px solid #444',
    borderRadius: '4px',
    padding: '8px',
    backgroundColor: '#2a2a2a',
    marginBottom: '8px',
    minHeight: '120px',
    width: 'fit-content',
    maxWidth: '100%',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: zoneType === 'main' ? '0px' : '8px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
  };

  const cardsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, auto)',
    gap: '2px',
    minHeight: '100px',
    alignItems: 'start',
    justifyItems: 'start',
  };

  const countStyle: React.CSSProperties = {
    color: isFull ? '#ff6b6b' : '#fff',
    fontWeight: 'bold',
    fontSize: '12px',
    backgroundColor: isFull ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.3)',
    padding: '2px 6px',
    borderRadius: '10px',
  };

  return (
    <div style={containerStyle} className={`deck-zone ${zoneType} ${className}`}>
      {zoneType !== 'main' && (
        <div style={headerStyle}>
          <span>{title}</span>
          <span style={countStyle}>
            {countText}
            {max > 0 && ` / ${max}`}
          </span>
        </div>
      )}
      <div style={cardsContainerStyle}>
        {cards.map((card, index) => (
          <div key={`${card.id}-${index}`} style={{ display: 'inline-block', alignSelf: 'start' }}>
            <Card 
              card={card} 
              onClick={() => onCardClick(card)}
              isInDeck={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(DeckZone);