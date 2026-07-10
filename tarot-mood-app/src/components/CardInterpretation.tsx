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
        <div className="interpretation__food">
          <span className="interpretation__food-label">추천 음식</span>
          <p className="interpretation__food-name">{card.recommendedFood.name}</p>
          <p className="interpretation__food-reason">{card.recommendedFood.reason}</p>
        </div>
      </div>
    </section>
  );
}
