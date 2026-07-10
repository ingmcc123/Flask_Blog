import type { CSSProperties } from 'react';
import type { TarotCardData } from '../data/tarotCards';
import { TarotCardVisual } from './TarotCardVisual';

interface TarotCardProps {
  card: TarotCardData;
  index: number;
  onSelect: () => void;
}

export function TarotCard({ card, index, onSelect }: TarotCardProps) {
  const { palette } = card;

  return (
    <button
      type="button"
      className="tarot-card"
      style={
        {
          '--card-accent': palette.accent,
          '--card-glow': palette.glow,
          '--card-delay': `${index * 120}ms`,
        } as CSSProperties
      }
      onClick={onSelect}
      aria-label={`${card.nameKo} 카드 선택`}
    >
      <TarotCardVisual card={card} size="sm" />
    </button>
  );
}
