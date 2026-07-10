import { useState, useCallback } from 'react';
import { TarotCard } from './components/TarotCard';
import { CardInterpretation } from './components/CardInterpretation';
import { analyzeMoodAndPickCards, getMoodSummary } from './utils/moodAnalyzer';
import type { TarotCardData } from './data/tarotCards';
import './App.css';

function App() {
  const [moodText, setMoodText] = useState('');
  const [cards, setCards] = useState<TarotCardData[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [moodSummary, setMoodSummary] = useState('');
  const [hasDrawn, setHasDrawn] = useState(false);

  const selectedCard = cards.find((c) => c.id === selectedCardId) ?? null;

  const handleDrawCards = useCallback(() => {
    const picked = analyzeMoodAndPickCards(moodText);
    setCards(picked);
    setSelectedCardId(null);
    setMoodSummary(getMoodSummary(moodText));
    setHasDrawn(true);
  }, [moodText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDrawCards();
    }
  };

  return (
    <div className="app">
      <div className="app__stars" aria-hidden="true" />

      <header className="header">
        <p className="header__brand">Mood Tarot</p>
        <h1 className="header__title">지금 내 기분이 어때?</h1>
        <p className="header__desc">
          지금 느끼는 감정을 키워드로 적어주세요.
          <br />
          당신의 마음에 맞는 타로카드 3장을 뽑아드릴게요.
        </p>
      </header>

      <section className="input-section">
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
        <button
          type="button"
          className="input-section__submit"
          onClick={handleDrawCards}
        >
          <span className="input-section__submit-icon" aria-hidden="true">✦</span>
          카드 뽑기
        </button>
      </section>

      {hasDrawn && (
        <section className="cards-section">
          <div className="cards-section__header">
            <h2 className="cards-section__title">당신을 위한 카드</h2>
            <p className="cards-section__summary">{moodSummary}</p>
          </div>

          <div className="cards-section__grid">
            {cards.map((card, index) => (
              <TarotCard
                key={card.id}
                card={card}
                index={index}
                selected={selectedCardId === card.id}
                onSelect={() => setSelectedCardId(card.id)}
              />
            ))}
          </div>

          <p className="cards-section__hint">
            {selectedCard
              ? '아래에서 카드 해석을 확인하세요'
              : '마음에 드는 카드 한 장을 선택해 주세요'}
          </p>
        </section>
      )}

      {selectedCard && <CardInterpretation card={selectedCard} />}

      <footer className="footer">
        <p>감정은 흐르는 것 — 오늘의 카드가 작은 위로가 되길</p>
      </footer>
    </div>
  );
}

export default App;
