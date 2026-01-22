import React from 'react';
import { DeckCard, ZoneType } from '../types';
import DeckZone from './DeckZone';

type ZoneKey = ZoneType | string;

interface DeckAreaProps {
  deck: DeckCard[];
  onCardClick: (card: DeckCard) => void;
  className?: string;
  selectedZone?: ZoneType;
}

const zoneTitles: Record<ZoneType, string> = {
  main: 'メインデッキ',
  chojigen: '超次元ゾーン',
  gr: 'GRゾーン',
  dolmageidon: 'ドルマゲドン',
  zeroryu: '零龍',
};

const zoneMaxCards: Record<ZoneType, number> = {
  main: 60,
  chojigen: 8,
  gr: 12,
  dolmageidon: 1,
  zeroryu: 1,
};

const zoneOrder: ZoneType[] = [
  'main',
  'chojigen',
  'gr',
  'dolmageidon',
  'zeroryu'
];

const DeckArea: React.FC<DeckAreaProps> = ({
  deck,
  onCardClick,
  className = '',
  selectedZone
}) => {
  const containerStyle: React.CSSProperties = {
    width: 'fit-content',
    height: '490.06px',
    padding: '5px',
    backgroundColor: '#1a1a1a',
    overflowY: 'auto',
    boxSizing: 'border-box',
  };

  // Group cards by zone with proper typing
  const cardsByZone = React.useMemo(() => {
    return deck.reduce<Record<ZoneType, DeckCard[]>>((acc, card) => {
      if (!acc[card.zone]) {
        acc[card.zone] = [];
      }
      acc[card.zone].push(card);
      return acc;
    }, {} as Record<ZoneType, DeckCard[]>);
  }, [deck]);

  // Filter to only include zones that have cards or are special zones
  // Show only the selected special zone when dolmageidon or zeroryu is selected
  // Hide dolmageidon and zeroryu when main deck is selected
  const zonesToShow = React.useMemo(() => {
    return zoneOrder.filter(zone => {
      const hasCards = (cardsByZone[zone]?.length ?? 0) > 0;
      const isDolmageidon = zone === 'dolmageidon';
      const isZeroryu = zone === 'zeroryu';
      const isSpecialZone = isDolmageidon || isZeroryu;
      const isMainDeckSelected = selectedZone === 'main';
      const isDolmageidonSelected = selectedZone === 'dolmageidon';
      const isZeroryuSelected = selectedZone === 'zeroryu';
      
      // Always show zones with cards
      if (hasCards) {
        return true;
      }
      
      // For special zones, only show the selected one
      if (isSpecialZone) {
        if (isMainDeckSelected) {
          return false; // Hide both when main deck is selected
        }
        if (isDolmageidonSelected && isDolmageidon) {
          return true; // Show dolmageidon only when dolmageidon tab is selected
        }
        if (isZeroryuSelected && isZeroryu) {
          return true; // Show zeroryu only when zeroryu tab is selected
        }
        return false; // Hide unselected special zone
      }
      
      // For other zones (main, chojigen, gr), show if they have cards
      return hasCards;
    });
  }, [cardsByZone, selectedZone]);

  return (
    <div style={containerStyle} className={`deck-area ${className}`}>
      {zonesToShow.length === 0 ? (
        <EmptyDeckMessage />
      ) : (
        zonesToShow.map((zone) => {
          const zoneCards = cardsByZone[zone] || [];
          return (
            <DeckZone
              key={zone}
              title={zoneTitles[zone]}
              cards={zoneCards}
              onCardClick={onCardClick}
              zoneType={zone}
              maxCards={zoneMaxCards[zone]}
            />
          );
        })
      )}
    </div>
  );
};

const EmptyDeckMessage: React.FC = () => (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    fontSize: '16px',
  }}>
    デッキにカードを追加してください
  </div>
);

export default React.memo(DeckArea);
