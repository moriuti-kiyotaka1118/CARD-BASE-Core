import React from 'react';
import { Card as CardType, Civilization, DeckCard } from '../types';
import { CSSProperties } from 'react';

interface CardProps {
  card: CardType | DeckCard;
  onClick?: () => void;
  className?: string;
  isInDeck?: boolean;
  size?: 'small' | 'large' | 'custom';
  customWidth?: string;
}

const civilizationColors: Record<Civilization, string> = {
  '火': '#ff6b6b',
  '水': '#4dabf7',
  '自然': '#51cf66',
  '光': '#ffd43b',
  '闇': '#5f3dc4',
  'ゼロ': '#868e96',
};

const Card: React.FC<CardProps> = ({ card, onClick, className = '', isInDeck = false, size = 'small', customWidth }) => {
  let cardWidth, cardHeight;
  
  if (size === 'custom' && customWidth) {
    cardWidth = customWidth;
    cardHeight = 'auto';
  } else {
    const sizeMultiplier = size === 'large' ? 2 : 1;
    cardWidth = isInDeck ? `${69.31 * sizeMultiplier}px` : `${105.61 * sizeMultiplier}px`;
    cardHeight = isInDeck ? `${93.81 * sizeMultiplier}px` : `${150.32 * sizeMultiplier}px`;
  }

  const cardStyle: React.CSSProperties = {
    display: 'inline-block',
    width: cardWidth,
    height: cardHeight,
    position: 'relative',
    cursor: onClick ? 'pointer' : 'default',
    flexShrink: 0,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderRadius: '4px',
    border: `2px solid ${civilizationColors[card.civilization] || '#333'}`,
    padding: 0,
    boxSizing: 'border-box',
  };

  const imageStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
  };

  const placeholderStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4px',
    textAlign: 'center',
    fontSize: '10px',
    wordBreak: 'break-word',
    overflow: 'hidden',
    color: '#fff',
    backgroundColor: civilizationColors[card.civilization] || '#333',
    background: `linear-gradient(135deg, ${civilizationColors[card.civilization] || '#333'} 0%, #1a1a1a 100%)`,
  };

  let costBadgeStyle: CSSProperties, powerBadgeStyle: CSSProperties;
  
  if (size === 'custom' && customWidth) {
    const badgeSize = Math.max(16, parseInt(customWidth) / 20);
    costBadgeStyle = {
      position: 'absolute',
      top: '2px',
      left: '2px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#fff',
      borderRadius: '50%',
      width: `${badgeSize}px`,
      height: `${badgeSize}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${Math.max(10, badgeSize / 2)}px`,
      fontWeight: 'bold',
    };

    powerBadgeStyle = {
      position: 'absolute',
      bottom: '2px',
      right: '2px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#fff',
      borderRadius: '4px',
      padding: '1px 4px',
      fontSize: `${Math.max(10, badgeSize / 2)}px`,
      fontWeight: 'bold',
    };
  } else {
    const sizeMultiplier = size === 'large' ? 2 : 1;
    costBadgeStyle = {
      position: 'absolute',
      top: `${2 * sizeMultiplier}px`,
      left: `${2 * sizeMultiplier}px`,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#fff',
      borderRadius: '50%',
      width: `${16 * sizeMultiplier}px`,
      height: `${16 * sizeMultiplier}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${10 * sizeMultiplier}px`,
      fontWeight: 'bold',
    };

    powerBadgeStyle = {
      position: 'absolute',
      bottom: `${2 * sizeMultiplier}px`,
      right: `${2 * sizeMultiplier}px`,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: '#fff',
      borderRadius: '4px',
      padding: `${1 * sizeMultiplier}px ${4 * sizeMultiplier}px`,
      fontSize: `${10 * sizeMultiplier}px`,
      fontWeight: 'bold',
    };
  }

  return (
    <div 
      style={cardStyle} 
      onClick={onClick}
      className={className}
      title={card.name}
    >
      {card.imageUrl ? (
        <img 
          src={card.imageUrl} 
          alt={card.name}
          style={imageStyle}
        />
      ) : (
        <div style={placeholderStyle}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
            {card.name}
          </div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            {card.type}
          </div>
          {card.cost !== undefined && (
            <div style={{ fontSize: '10px', marginTop: '4px' }}>
              コスト: {card.cost}
            </div>
          )}
          {card.power !== undefined && (
            <div style={{ fontSize: '10px', marginTop: '2px' }}>
              パワー: {card.power}
            </div>
          )}
        </div>
      )}
      {card.cost !== undefined && (
        <div style={costBadgeStyle}>
          {card.cost}
        </div>
      )}
      {card.power !== undefined && (
        <div style={powerBadgeStyle}>
          {card.power.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default React.memo(Card);
