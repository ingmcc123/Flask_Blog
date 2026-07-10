import type { TarotCardData } from '../data/tarotCards';

interface CardInterpretationProps {
  card: TarotCardData;
}

export function CardInterpretation({ card }: CardInterpretationProps) {
  return (
    <section className="interpretation" aria-live="polite">
      <div className="interpretation__header">
        <span className="interpretation__eyebrow">카드 해석</span>
        <h2 className="interpretation__title">
          {card.nameKo}
          <span className="interpretation__subtitle">{card.nameEn}</span>
        </h2>
      </div>

      <div className="interpretation__body">
        <p className="interpretation__text">{card.interpretation}</p>
        <div className="interpretation__advice">
          <span className="interpretation__advice-label">오늘의 조언</span>
          <p>{card.advice}</p>
        </div>
      </div>
    </section>
  );
}
