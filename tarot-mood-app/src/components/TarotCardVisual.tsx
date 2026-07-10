import type { CSSProperties } from 'react';
import type { TarotCardData } from '../data/tarotCards';

interface TarotCardVisualProps {
  card: TarotCardData;
  size?: 'sm' | 'lg';
}

export function TarotCardVisual({ card, size = 'sm' }: TarotCardVisualProps) {
  const { palette } = card;

  return (
    <div
      className={`tarot-card-visual tarot-card-visual--${size}`}
      style={
        {
          '--card-bg': palette.bg,
          '--card-accent': palette.accent,
          '--card-glow': palette.glow,
        } as CSSProperties
      }
    >
      <div className="tarot-card-visual__frame">
        <div className="tarot-card-visual__inner">
          <svg viewBox="0 0 100 100" className="tarot-card-visual__symbol" aria-hidden="true">
            <defs>
              <radialGradient id={`glow-display-${card.id}`} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor={palette.glow} stopOpacity="0.35" />
                <stop offset="100%" stopColor={palette.bg} stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100" height="100" fill={`url(#glow-display-${card.id})`} />
            <path
              d={card.symbolPath}
              fill="none"
              stroke={palette.symbol}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="tarot-card-visual__ornament tarot-card-visual__ornament--top" />
          <div className="tarot-card-visual__ornament tarot-card-visual__ornament--bottom" />
        </div>
        <div className="tarot-card-visual__label">
          <span className="tarot-card-visual__name-ko">{card.nameKo}</span>
          <span className="tarot-card-visual__name-en">{card.nameEn}</span>
        </div>
      </div>
    </div>
  );
}
