import React from 'react';
import { Card as CardType } from '../types';
import Card from './Card';

interface CardDetailProps {
  card: CardType | null;
  onClose: () => void;
  onAddToDeck?: (card: CardType) => void;
  onRemoveFromDeck?: (card: CardType) => void;
  isInDeck?: boolean;
}

const CardDetail: React.FC<CardDetailProps> = ({ card, onClose, onAddToDeck, onRemoveFromDeck, isInDeck = false }) => {
  // Force re-render
  console.log('CardDetail re-rendered with image width: 1200px');

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (card) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [card]);

  if (!card) return null;

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#333',
    borderRadius: '10px',
    padding: '20px',
    maxWidth: '1200px',
    width: '90%',
    maxHeight: '90%',
    overflowY: 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    gap: '30px',
    color: 'white',
  };

  const imageContainerStyle: React.CSSProperties = {
    flexShrink: 0,
    width: '400px',
    height: 'auto',
  };

  const cardImageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
  };

  const detailsStyle: React.CSSProperties = {
    flex: 1,
    color: '#fff',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#fff',
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    marginBottom: '8px',
    gap: '12px',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    minWidth: '80px',
    color: '#ccc',
  };

  const valueStyle: React.CSSProperties = {
    flex: 1,
    color: '#fff',
  };

  const effectTextStyle: React.CSSProperties = {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '4px',
    whiteSpace: 'pre-line',
    lineHeight: '1.4',
    fontSize: '14px',
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const addButtonStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    right: '80px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const removeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={containerStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeButtonStyle} onClick={onClose}>
          閉じる
        </button>
        
        <div style={contentStyle}>
          <div style={imageContainerStyle}>
            <Card card={card} size="custom" customWidth="400px" />
          </div>
          
          <div style={detailsStyle}>
            <h3 style={titleStyle}>{card.name}</h3>
            
            <div style={rowStyle}>
              <span style={labelStyle}>タイプ:</span>
              <span style={valueStyle}>{card.type}</span>
            </div>
            
            <div style={rowStyle}>
              <span style={labelStyle}>文明:</span>
              <span style={valueStyle}>{card.civilization}</span>
            </div>
            
            <div style={rowStyle}>
              <span style={labelStyle}>コスト:</span>
              <span style={valueStyle}>{card.cost}</span>
            </div>
            
            {card.power !== undefined && (
              <div style={rowStyle}>
                <span style={labelStyle}>パワー:</span>
                <span style={valueStyle}>{card.power.toLocaleString()}</span>
              </div>
            )}
            
            {card.race && (
              <div style={rowStyle}>
                <span style={labelStyle}>種族:</span>
                <span style={valueStyle}>{card.race}</span>
              </div>
            )}
            
            {card.rarity && (
              <div style={rowStyle}>
                <span style={labelStyle}>レアリティ:</span>
                <span style={valueStyle}>{card.rarity}</span>
              </div>
            )}
            
            {card.effectText && (
              <div style={effectTextStyle}>
                {card.effectText}
              </div>
            )}
          </div>
        </div>
        
        {(onAddToDeck || onRemoveFromDeck) && (
          <>
            {onAddToDeck && (
              <button 
                style={addButtonStyle}
                onClick={() => onAddToDeck(card)}
                title="デッキに追加"
              >
                +
              </button>
            )}
            {onRemoveFromDeck && isInDeck && (
              <button 
                style={removeButtonStyle}
                onClick={() => onRemoveFromDeck(card)}
                title="デッキから削除"
              >
                −
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CardDetail;
