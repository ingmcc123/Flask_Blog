import { useState, useCallback } from 'react';
import { TarotCard } from './components/TarotCard';
import { TarotCardVisual } from './components/TarotCardVisual';
import { analyzeMoodAndPickCards, getMoodSummary } from './utils/moodAnalyzer';
import type { TarotCardData } from './data/tarotCards';
import type { AppStep } from './types';
import './App.css';

const STEP_TRANSITION_MS = 380;

function App() {
  const [step, setStep] = useState<AppStep>('input');
  const [animating, setAnimating] = useState(false);
  const [moodText, setMoodText] = useState('');
  const [cards, setCards] = useState<TarotCardData[]>([]);
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null);
  const [moodSummary, setMoodSummary] = useState('');

  const goToStep = useCallback((next: AppStep) => {
    setAnimating(true);
    window.setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, STEP_TRANSITION_MS);
  }, []);

  const handleDrawCards = useCallback(() => {
    const picked = analyzeMoodAndPickCards(moodText);
    setCards(picked);
    setSelectedCard(null);
    setMoodSummary(getMoodSummary(moodText));
    goToStep('cards');
  }, [moodText, goToStep]);

  const handleSelectCard = useCallback(
    (card: TarotCardData) => {
      setSelectedCard(card);
      goToStep('interpretation');
    },
    [goToStep],
  );

  const handleShowFood = useCallback(() => {
    goToStep('food');
  }, [goToStep]);

  const handleRestart = useCallback(() => {
    setMoodText('');
    setCards([]);
    setSelectedCard(null);
    setMoodSummary('');
    goToStep('input');
  }, [goToStep]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDrawCards();
    }
  };

  const foodImageSrc = selectedCard ? `/foods/${selectedCard.id}.jpg` : '';

  return (
    <div className="app">
      <div className="app__stars" aria-hidden="true" />

      <div className={`screen-stage ${animating ? 'screen-stage--exit' : 'screen-stage--enter'}`}>
        {step === 'input' && (
          <section className="screen screen--input" key="input">
            <header className="header">
              <p className="header__brand">Mood Tarot</p>
              <h1 className="header__title">지금 내 기분이 어때?</h1>
              <p className="header__desc">
                지금 느끼는 감정을 키워드로 적어주세요.
                <br />
                당신의 마음에 맞는 타로카드 3장을 뽑아드릴게요.
              </p>
            </header>

            <div className="input-section">
              <label htmlFor="mood-input" className="input-section__label">
                기분 키워드
              </label>
              <div className="input-section__field">
                <textarea
                  id="mood-input"
                  className="input-section__textarea"
                  placeholder="예: 오늘 좀 불안하고 외로워. 그래도 희망은 있어."
                  value={moodText}
                  onChange={(e) => setMoodText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={3}
                  maxLength={200}
                />
                <span className="input-section__count">{moodText.length}/200</span>
              </div>
              <button type="button" className="input-section__submit" onClick={handleDrawCards}>
                <span className="input-section__submit-icon" aria-hidden="true">✦</span>
                카드 뽑기
              </button>
            </div>
          </section>
        )}

        {step === 'cards' && (
          <section className="screen screen--cards" key="cards">
            <div className="screen__top">
              <h2 className="screen__title">당신을 위한 카드</h2>
              <p className="screen__subtitle">{moodSummary}</p>
            </div>

            <div className="cards-picker">
              {cards.map((card, index) => (
                <TarotCard
                  key={card.id}
                  card={card}
                  index={index}
                  onSelect={() => handleSelectCard(card)}
                />
              ))}
            </div>

            <p className="screen__hint">마음에 드는 카드 한 장을 선택해 주세요</p>
          </section>
        )}

        {step === 'interpretation' && selectedCard && (
          <section className="screen screen--interpretation" key="interpretation">
            <div className="result-card">
              <TarotCardVisual card={selectedCard} size="lg" />
            </div>

            <div className="result-body">
              <span className="result-body__eyebrow">카드 해석</span>
              <h2 className="result-body__title">{selectedCard.nameKo}</h2>
              <p className="result-body__text">{selectedCard.interpretation}</p>
              <div className="result-body__advice">
                <span className="result-body__advice-label">오늘의 조언</span>
                <p>{selectedCard.advice}</p>
              </div>
            </div>

            <button type="button" className="screen__next-btn" onClick={handleShowFood}>
              추천 음식 보기
            </button>
          </section>
        )}

        {step === 'food' && selectedCard && (
          <section className="screen screen--food" key="food">
            <div className="food-screen">
              <span className="food-screen__eyebrow">추천 음식</span>
              <div className="food-screen__image-wrap">
                <img
                  src={foodImageSrc}
                  alt={selectedCard.recommendedFood.name}
                  className="food-screen__image"
                />
              </div>
              <h2 className="food-screen__name">{selectedCard.recommendedFood.name}</h2>
              <p className="food-screen__reason">{selectedCard.recommendedFood.reason}</p>
            </div>

            <button type="button" className="screen__restart-btn" onClick={handleRestart}>
              처음부터 다시하기
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
