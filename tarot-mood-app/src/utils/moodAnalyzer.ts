import { TAROT_CARDS, type TarotCardData } from '../data/tarotCards';

const MOOD_PATTERNS: Record<string, RegExp[]> = {
  positive: [/기쁨|행복|좋아|설렘|감사|편안|평화|성취|자신|만족|웃|즐거|신나|밝/],
  negative: [/슬픔|우울|힘들|아파|아픔|눈물|울|서러|절망|무기력|공허|허무/],
  stress: [/불안|걱정|두려|긴장|스트레스|압박|짜증|분노|화나|답답|초조|피곤|지침|번아웃/],
  love: [/사랑|연애|그리움|마음|좋아해|설레|이별|헤어|그리워|보고싶/],
  lonely: [/외로|고독|쓸쓸|혼자|외롭|적적|공허/],
  confusion: [/혼란|고민|망설|결정|선택|모르|막막|복잡|갈등|헷갈/],
  change: [/변화|전환|새로|시작|끝|이별|놓아|마무리|재시작/],
  hope: [/희망|기대|꿈|회복|치유|미래|가능|기회/],
};

function detectMoodTags(text: string): string[] {
  const tags = new Set<string>();
  for (const [tag, patterns] of Object.entries(MOOD_PATTERNS)) {
    if (patterns.some((pattern) => pattern.test(text))) {
      tags.add(tag);
    }
  }
  return [...tags];
}

function scoreCard(card: TarotCardData, text: string, moodTags: string[]): number {
  let score = 0;

  for (const keyword of card.keywords) {
    if (text.includes(keyword)) {
      score += 3;
    }
  }

  for (const tag of moodTags) {
    if (card.moodTags.includes(tag)) {
      score += 2;
    }
  }

  return score;
}

function pickRandomCards(count: number, exclude: Set<string> = new Set()): TarotCardData[] {
  const pool = TAROT_CARDS.filter((card) => !exclude.has(card.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function analyzeMoodAndPickCards(input: string): TarotCardData[] {
  const text = input.trim().toLowerCase();

  if (!text) {
    return pickRandomCards(3);
  }

  const moodTags = detectMoodTags(text);

  const scored = TAROT_CARDS.map((card) => ({
    card,
    score: scoreCard(card, text, moodTags),
  }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return pickRandomCards(3);
  }

  const selected: TarotCardData[] = [];
  const usedIds = new Set<string>();

  for (const { card } of scored) {
    if (selected.length >= 3) break;
    if (!usedIds.has(card.id)) {
      selected.push(card);
      usedIds.add(card.id);
    }
  }

  if (selected.length < 3) {
    const fillers = pickRandomCards(3 - selected.length, usedIds);
    selected.push(...fillers);
  }

  return selected;
}

export function getMoodSummary(input: string): string {
  const text = input.trim();
  if (!text) return '마음을 자유롭게 적어주세요';

  const tags = detectMoodTags(text);
  const summaries: Record<string, string> = {
    positive: '밝은 에너지',
    negative: '무거운 감정',
    stress: '불안과 긴장',
    love: '사랑과 관계',
    lonely: '외로움',
    confusion: '고민과 혼란',
    change: '변화의 바람',
    hope: '희망의 기운',
  };

  if (tags.length === 0) {
    return `"${text}"의 감정을 담은 카드`;
  }

  return tags.map((tag) => summaries[tag]).join(' · ');
}
