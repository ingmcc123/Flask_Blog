import type { CSSProperties } from 'react';
import type { TarotCardData } from '../data/tarotCards';

interface TarotCardProps {
  card: TarotCardData;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

export function TarotCard({ card, index, selected, onSelect }: TarotCardProps) {
  const { palette } = card;

  return (
    <button
      type="button"
      className={`tarot-card ${selected ? 'tarot-card--selected' : ''}`}
      style={
        {
          '--card-bg': palette.bg,
          '--card-accent': palette.accent,
          '--card-glow': palette.glow,
          '--card-delay': `${index * 120}ms`,
        } as CSSProperties
      }
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${card.nameKo} 카드 선택`}
    >
      <div className="tarot-card__frame">
        <div className="tarot-card__inner">
          <svg viewBox="0 0 100 100" className="tarot-card__symbol" aria-hidden="true">
            <defs>
              <radialGradient id={`glow-${card.id}`} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor={palette.glow} stopOpacity="0.35" />
                <stop offset="100%" stopColor={palette.bg} stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill={`url(#glow-${card.id})`} />
            <path
              d={card.symbolPath}
              fill="none"
              stroke={palette.symbol}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="tarot-card__ornament tarot-card__ornament--top" />
          <div className="tarot-card__ornament tarot-card__ornament--bottom" />
        </div>
        <div className="tarot-card__label">
          <span className="tarot-card__name-ko">{card.nameKo}</span>
          <span className="tarot-card__name-en">{card.nameEn}</span>
        </div>
      </div>
      {selected && <span className="tarot-card__badge">선택됨</span>}
    </button>
  );
}
