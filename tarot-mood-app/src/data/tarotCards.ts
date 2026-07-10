export interface TarotCardData {
  id: string;
  nameKo: string;
  nameEn: string;
  keywords: string[];
  moodTags: string[];
  interpretation: string;
  advice: string;
  palette: {
    bg: string;
    accent: string;
    glow: string;
    symbol: string;
  };
  symbolPath: string;
}

export const TAROT_CARDS: TarotCardData[] = [
  {
    id: 'fool',
    nameKo: '바보',
    nameEn: 'The Fool',
    keywords: ['새로운', '시작', '모험', '자유', '설렘', '기대', '가벼운', '첫걸음'],
    moodTags: ['hope', 'change', 'positive'],
    interpretation:
      '지금 당신의 마음은 새로운 가능성을 향해 열려 있습니다. 두려움보다 호기심이 앞서는 순간이에요. 완벽하지 않아도 괜찮다는 메시지가 카드에 담겨 있습니다.',
    advice: '오늘은 작은 시도 하나를 해보세요. 첫걸음이 가장 중요합니다.',
    palette: { bg: '#1a1530', accent: '#f4d35e', glow: '#ffd166', symbol: '#fff3c4' },
    symbolPath: 'M50 18 C38 30 34 48 40 62 C46 76 58 78 62 66 C66 54 60 36 50 18 Z M44 70 L56 70 L54 88 L46 88 Z',
  },
  {
    id: 'magician',
    nameKo: '마법사',
    nameEn: 'The Magician',
    keywords: ['의지', '능력', '자신감', '실행', '창조', '집중', '할 수', '가능'],
    moodTags: ['positive', 'stress'],
    interpretation:
      '당신 안에 이미 필요한 힘이 모두 있습니다. 지금 느끼는 감정은 에너지의 방향을 정하는 신호예요. 생각을 행동으로 옮길 때입니다.',
    advice: '말로만 고민하지 말고, 오늘 할 수 있는 한 가지를 바로 실행해 보세요.',
    palette: { bg: '#0f1f2e', accent: '#e63946', glow: '#ff6b6b', symbol: '#ffd6d6' },
    symbolPath: 'M50 20 L50 80 M35 35 L65 35 M30 50 L70 50 M35 65 L65 65 M42 28 L58 72 M58 28 L42 72',
  },
  {
    id: 'high-priestess',
    nameKo: '여사제',
    nameEn: 'The High Priestess',
    keywords: ['직관', '내면', '신비', '고요', '침묵', '무의식', '감', '느낌'],
    moodTags: ['confusion', 'lonely'],
    interpretation:
      '겉으로 드러나지 않는 깊은 감정이 움직이고 있습니다. 모든 답을 밖에서 찾으려 하지 마세요. 당신의 직관이 이미 알고 있습니다.',
    advice: '혼자만의 시간을 가지며 마음의 소리에 귀 기울여 보세요.',
    palette: { bg: '#12182b', accent: '#7b9acc', glow: '#a8c0e0', symbol: '#e8f0ff' },
    symbolPath: 'M50 22 C38 22 32 34 32 46 C32 58 38 70 50 78 C62 70 68 58 68 46 C68 34 62 22 50 22 Z M50 32 L50 68',
  },
  {
    id: 'lovers',
    nameKo: '연인',
    nameEn: 'The Lovers',
    keywords: ['사랑', '연애', '관계', '마음', '그리움', '설렘', '이별', '감정'],
    moodTags: ['love', 'confusion'],
    interpretation:
      '마음이 누군가 또는 무언가를 향해 강하게 반응하고 있습니다. 사랑, 그리움, 선택의 갈림길이 함께 느껴지는 시기예요.',
    advice: '진심을 솔직하게 표현하는 것이 관계를 더 깊게 만듭니다.',
    palette: { bg: '#2a1528', accent: '#ff6b9d', glow: '#ff8fab', symbol: '#ffe0ec' },
    symbolPath: 'M38 30 C30 38 28 52 36 62 C42 68 50 72 50 72 C50 72 58 68 64 62 C72 52 70 38 62 30 C56 24 50 28 50 28 C50 28 44 24 38 30 Z',
  },
  {
    id: 'chariot',
    nameKo: '전차',
    nameEn: 'The Chariot',
    keywords: ['전진', '의지', '승리', '도전', '극복', '밀어붙', '집중', '목표'],
    moodTags: ['stress', 'positive'],
    interpretation:
      '갈등하는 감정 속에서도 앞으로 나아가려는 힘이 있습니다. 혼란스러워도 멈추지 않는 것이 지금의 당신을 보여줍니다.',
    advice: '감정을 억누르기보다 방향을 정하고 한 걸음씩 나아가세요.',
    palette: { bg: '#141e2e', accent: '#4cc9f0', glow: '#72efdd', symbol: '#caf0f8' },
    symbolPath: 'M22 58 L78 58 M28 48 L72 48 M32 38 L68 38 M50 38 L50 58 M35 58 L35 72 M65 58 L65 72',
  },
  {
    id: 'strength',
    nameKo: '힘',
    nameEn: 'Strength',
    keywords: ['용기', '인내', '견딤', '힘들', '버팀', '극복', '부드러', '자제'],
    moodTags: ['negative', 'stress'],
    interpretation:
      '힘든 감정을 견디고 있는 당신에게 이 카드는 부드러운 용기를 말합니다. 억지로 강해지기보다 인내로 마음을 다스릴 때입니다.',
    advice: '스스로에게 "잘하고 있다"고 말해 주세요. 작은 칭찬이 큰 힘이 됩니다.',
    palette: { bg: '#2a1f14', accent: '#f4a261', glow: '#e9c46a', symbol: '#ffe8cc' },
    symbolPath: 'M30 62 C34 48 42 38 50 36 C58 38 66 48 70 62 C66 72 58 78 50 78 C42 78 34 72 30 62 Z M44 52 L56 52',
  },
  {
    id: 'hermit',
    nameKo: '은둔자',
    nameEn: 'The Hermit',
    keywords: ['외로', '고독', '혼자', '쓸쓸', '성찰', '고요', '내면', '조용'],
    moodTags: ['lonely', 'confusion'],
    interpretation:
      '외로움은 결핍이 아니라 자신을 돌아보는 시간일 수 있습니다. 지금의 고요함 속에서 진짜 필요한 것이 무엇인지 드러나고 있어요.',
    advice: '혼자 있는 시간을 두려워하지 말고, 자신을 이해하는 기회로 삼아보세요.',
    palette: { bg: '#1a1a24', accent: '#c9b1ff', glow: '#e0d4ff', symbol: '#f5f0ff' },
    symbolPath: 'M50 24 C46 24 44 30 46 36 L48 70 L52 70 L54 36 C56 30 54 24 50 24 Z M42 76 L58 76 L56 84 L44 84 Z',
  },
  {
    id: 'wheel',
    nameKo: '운명의 수레바퀴',
    nameEn: 'Wheel of Fortune',
    keywords: ['변화', '운명', '전환', '기회', '순환', '뜻밖', '타이밍', '흐름'],
    moodTags: ['change', 'confusion'],
    interpretation:
      '지금의 감정도 곧 바뀔 수 있습니다. 고정된 것처럼 느껴지는 상황에도 흐름이 있고, 전환점이 가까이에 있어요.',
    advice: '통제할 수 없는 것은 내려놓고, 변화의 기회를 열린 마음으로 받아들이세요.',
    palette: { bg: '#1e1830', accent: '#b388ff', glow: '#d4b5ff', symbol: '#f0e6ff' },
    symbolPath: 'M50 28 A22 22 0 1 1 50 72 A22 22 0 1 1 50 28 M50 38 A12 12 0 1 0 50 62 A12 12 0 1 0 50 38',
  },
  {
    id: 'hanged-man',
    nameKo: '매달린 사람',
    nameEn: 'The Hanged Man',
    keywords: ['기다림', '멈춤', '고민', '망설', '관점', '포기', '수용', '정체'],
    moodTags: ['confusion', 'stress'],
    interpretation:
      '답을 서두르기보다 잠시 멈춰 서야 할 때입니다. 지금의 막막함은 새로운 시각을 얻기 위한 과정일 수 있어요.',
    advice: '억지로 결론 내리지 말고, 다른 각도에서 상황을 바라보세요.',
    palette: { bg: '#1c2420', accent: '#80ed99', glow: '#a8f0b8', symbol: '#e0ffe8' },
    symbolPath: 'M50 26 L50 54 M42 38 L58 38 M38 54 C34 62 36 72 44 76 L56 76 C64 72 66 62 62 54',
  },
  {
    id: 'death',
    nameKo: '죽음',
    nameEn: 'Death',
    keywords: ['끝', '이별', '변화', '놓아', '마무리', '전환', '새로운', '재시작'],
    moodTags: ['change', 'negative', 'love'],
    interpretation:
      '무언가가 끝나가고 있다는 감정이 느껴집니다. 하지만 이 카드는 파괴가 아닌 변환을 의미해요. 낡은 것을 내려놓을 때입니다.',
    advice: '더 이상 맞지 않는 감정이나 관계를 붙잡지 말고, 비워낸 자리에 새것이 들어올 공간을 만드세요.',
    palette: { bg: '#181820', accent: '#adb5bd', glow: '#ced4da', symbol: '#f8f9fa' },
    symbolPath: 'M44 30 L56 30 L54 46 L60 46 L48 78 L36 46 L42 46 Z',
  },
  {
    id: 'temperance',
    nameKo: '절제',
    nameEn: 'Temperance',
    keywords: ['균형', '조화', '중간', '인내', '조절', '평화', '안정', '차분'],
    moodTags: ['stress', 'positive'],
    interpretation:
      '극단적인 감정 사이에서 균형을 찾으려는 마음이 보입니다. 서두르지 않고 조화롭게 마음을 다스릴 때입니다.',
    advice: '감정의 파도가 잔잔해질 때까지 천천히 호흡하며 균형을 되찾으세요.',
    palette: { bg: '#142028', accent: '#48cae4', glow: '#90e0ef', symbol: '#caf0f8' },
    symbolPath: 'M38 32 L62 68 M62 32 L38 68 M44 50 L56 50',
  },
  {
    id: 'devil',
    nameKo: '악마',
    nameEn: 'The Devil',
    keywords: ['집착', '속박', '유혹', '중독', '분노', '짜증', '욕망', '벗어나'],
    moodTags: ['negative', 'stress'],
    interpretation:
      '마음을 묶고 있는 생각이나 습관이 있습니다. 불편한 감정은 사실 당신이 무엇에 얽매여 있는지 알려주는 거울이에요.',
    advice: '나를 괴롭히는 패턴을 인식하는 것만으로도 벗어날 첫걸음이 됩니다.',
    palette: { bg: '#2a1218', accent: '#c9184a', glow: '#ff4d6d', symbol: '#ffb3c1' },
    symbolPath: 'M34 34 C30 44 30 58 36 68 C42 76 50 78 50 78 C50 78 58 76 64 68 C70 58 70 44 66 34 M42 30 L44 24 M58 30 L56 24',
  },
  {
    id: 'tower',
    nameKo: '탑',
    nameEn: 'The Tower',
    keywords: ['붕괴', '충격', '혼란', '불안', '급변', '깨달음', '위기', '파괴'],
    moodTags: ['negative', 'stress', 'change'],
    interpretation:
      '갑작스러운 불안이나 혼란이 마음을 흔들고 있습니다. 견고하던 믿음이 흔들리는 것처럼 느껴질 수 있어요. 하지만 진실이 드러나는 과정입니다.',
    advice: '무너진 것에 집착하기보다, 새롭게 세울 수 있는 것에 집중하세요.',
    palette: { bg: '#2a1810', accent: '#ff5400', glow: '#ff7b00', symbol: '#ffd6a5' },
    symbolPath: 'M40 72 L60 72 L56 36 L44 36 Z M46 36 L54 36 L52 28 L48 28 Z M38 44 L62 52 M36 56 L64 64',
  },
  {
    id: 'star',
    nameKo: '별',
    nameEn: 'The Star',
    keywords: ['희망', '치유', '영감', '꿈', '회복', '밝음', '미래', '긍정'],
    moodTags: ['hope', 'positive', 'lonely'],
    interpretation:
      '어두운 감정 속에서도 희망의 빛이 보입니다. 지금의 상처나 불안도 곧 치유될 수 있다는 메시지예요.',
    advice: '작은 희망이라도 꼭 붙잡으세요. 밤이 깊을수록 별은 더 밝게 빛납니다.',
    palette: { bg: '#0f1a2e', accent: '#4ea8de', glow: '#89c2f8', symbol: '#e7f5ff' },
    symbolPath: 'M50 24 L54 42 L72 42 L58 52 L64 70 L50 58 L36 70 L42 52 L28 42 L46 42 Z',
  },
  {
    id: 'moon',
    nameKo: '달',
    nameEn: 'The Moon',
    keywords: ['불안', '두려', '환상', '모호', '꿈', '혼란', '불확실', '감정기복'],
    moodTags: ['negative', 'confusion'],
    interpretation:
      '명확하지 않은 감정이 출렁이고 있습니다. 불안은 상상과 현실이 겹칠 때 커지곤 해요. 모든 것이 보이는 대로는 아닙니다.',
    advice: '불안한 밤에는 중요한 결정을 미루고, 마음이 가라앉을 때까지 기다려 보세요.',
    palette: { bg: '#12182e', accent: '#90a4c4', glow: '#b8c9e8', symbol: '#e8eeff' },
    symbolPath: 'M58 30 A18 18 0 1 1 42 62 A14 14 0 1 0 58 30 Z',
  },
  {
    id: 'sun',
    nameKo: '태양',
    nameEn: 'The Sun',
    keywords: ['기쁨', '행복', '활력', '성공', '밝음', '웃음', '축하', '만족'],
    moodTags: ['positive', 'hope'],
    interpretation:
      '마음속에 따뜻한 에너지가 넘칩니다. 기쁨과 성취감이 당신을 감싸고 있어요. 이 긍정의 흐름을 믿으세요.',
    advice: '좋은 기분을 주변과 나누면 그 에너지가 더 커집니다.',
    palette: { bg: '#2a2010', accent: '#ffc300', glow: '#ffdd57', symbol: '#fff8dc' },
    symbolPath: 'M50 34 A16 16 0 1 1 50 66 A16 16 0 1 1 50 34 M50 20 L50 28 M50 72 L50 80 M26 50 L34 50 M66 50 L74 50 M32 32 L38 38 M62 62 L68 68 M68 32 L62 38 M38 68 L32 62',
  },
  {
    id: 'judgement',
    nameKo: '심판',
    nameEn: 'Judgement',
    keywords: ['각성', '깨달음', '평가', '반성', '결정', '소명', '부활', '새출발'],
    moodTags: ['change', 'confusion'],
    interpretation:
      '과거를 돌아보며 새로운 결심을 내리려는 시기입니다. 스스로에게 솔직해질 때, 마음이 한층 가벼워집니다.',
    advice: '자신을 너무 가혹하게 판단하지 말고, 배운 것을 바탕으로 앞으로 나아가세요.',
    palette: { bg: '#1e1a28', accent: '#cdb4db', glow: '#e2cfea', symbol: '#f8f0ff' },
    symbolPath: 'M50 26 L58 42 L74 44 L62 56 L66 72 L50 64 L34 72 L38 56 L26 44 L42 42 Z',
  },
  {
    id: 'world',
    nameKo: '세계',
    nameEn: 'The World',
    keywords: ['완성', '성취', '통합', '만족', '여정', '끝과', '조화', '전체'],
    moodTags: ['positive', 'hope', 'change'],
    interpretation:
      '한 사이클이 완성되어 가고 있습니다. 지금 느끼는 감정들이 모여 하나의 큰 그림을 만들고 있어요. 충분히 잘 해왔습니다.',
    advice: '지금까지의 여정을 인정하고, 다음 장을 열 준비를 하세요.',
    palette: { bg: '#142820', accent: '#52b788', glow: '#95d5b2', symbol: '#d8f3dc' },
    symbolPath: 'M50 28 A22 22 0 1 1 50 72 A22 22 0 1 1 50 28 M38 50 L62 50 M50 38 L50 62',
  },
];
