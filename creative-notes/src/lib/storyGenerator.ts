import type { Character, Episode, StoryNote } from '../types'

type GenreKey =
  | 'romance'
  | 'fantasy'
  | 'thriller'
  | 'mystery'
  | 'sf'
  | 'slice'
  | 'martial'
  | 'horror'
  | 'growth'
  | 'period'
  | 'default'

interface GenrePack {
  label: string
  titlePatterns: ((kw: string[], seed: number) => string)[]
  logline: (kw: string[], protag: Character, antag: Character) => string
  roles: { role: string; traits: string[]; goals: string[] }[]
  namePool: string[]
  settings: string[]
  episodeBeats: ((ctx: BeatContext) => { title: string; summary: string })[]
}

interface BeatContext {
  kw: string[]
  k: (i: number) => string
  keul: (i: number) => string
  ki: (i: number) => string
  keun: (i: number) => string
  kwa: (i: number) => string
  protag: Character
  rival: Character
  support: Character
  mentor: Character
  setting: string
  genreLabel: string
}

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function pickAlt<T>(arr: T[], seed: number, offset: number): T {
  return arr[(seed + offset) % arr.length]
}


function hasBatchim(word: string): boolean {
  const ch = word[word.length - 1]
  if (!ch) return false
  const code = ch.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return /[0-9]/.test(ch)
  return (code - 0xac00) % 28 !== 0
}

/** 을/를 */
function eul(word: string): string {
  return word + (hasBatchim(word) ? '을' : '를')
}

/** 이/가 */
function iga(word: string): string {
  return word + (hasBatchim(word) ? '이' : '가')
}

/** 은/는 */
function eun(word: string): string {
  return word + (hasBatchim(word) ? '은' : '는')
}

/** 과/와 */
function gwa(word: string): string {
  return word + (hasBatchim(word) ? '과' : '와')
}


function parseKeywords(raw: string): string[] {
  return raw
    .split(/[,，、/\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function detectGenre(genreRaw: string): GenreKey {
  const g = genreRaw.toLowerCase().replace(/\s/g, '')
  if (/로맨스|연애|사랑|romance/.test(g)) return 'romance'
  if (/판타지|마법|이세계|fantasy/.test(g)) return 'fantasy'
  if (/스릴러|서스펜스|thriller/.test(g)) return 'thriller'
  if (/미스터리|추리|mystery|탐정/.test(g)) return 'mystery'
  if (/sf|공상과학|미래|우주|사이보그/.test(g)) return 'sf'
  if (/일상|힐링|슬로우|slice/.test(g)) return 'slice'
  if (/무협|무술|강호|사제/.test(g)) return 'martial'
  if (/호러|공포|귀신|horror/.test(g)) return 'horror'
  if (/성장|청춘|학원|성장물/.test(g)) return 'growth'
  if (/시대|사극|역사|조선|고려/.test(g)) return 'period'
  return 'default'
}

const packs: Record<GenreKey, GenrePack> = {
  romance: {
    label: '로맨스',
    titlePatterns: [
      (kw, s) => `${pick(['그날의', '다시 만난', '숨겨진', '마지막'], s)} ${kw[0] ?? '약속'}`,
      (kw, s) => `${kw[0] ?? '너'}에게 닿는 ${pick(['계절', '편지', '밤', '온기'], s)}`,
      (kw) => `${kw.slice(0, 2).join('·') || '우리'}의 재회`,
    ],
    logline: (kw, p, a) =>
      `${eul(kw[0] ?? '운명')} 사이에 둔 ${gwa(p.name)} ${a.name}. 상처 입은 두 사람이 서로를 알아가며, ${iga(kw[1] ?? '사랑')} 구원이 될지 파멸이 될지 시험받는다.`,
    roles: [
      {
        role: '주인공',
        traits: ['조심스럽지만 단단한', '감정을 숨기는', '한번 믿으면 끝까지 가는'],
        goals: ['과거를 정리하고 진짜 나를 찾기', '다시는 잃지 않을 관계를 맺기'],
      },
      {
        role: '상대역',
        traits: ['차갑게 보이지만 다정한', '자존심이 센', '말보다 행동으로 보여주는'],
        goals: ['감정의 벽을 허물기', '주인공을 자신의 세계에 들이기'],
      },
      {
        role: '조력자',
        traits: ['직설적이고 유쾌한', '관찰력이 뛰어난'],
        goals: ['두 사람의 오해를 풀기', '자신의 자리도 지키기'],
      },
      {
        role: '방해자',
        traits: ['집요하고 매력적인', '과거를 무기 삼는'],
        goals: ['관계를 흔들기', '잃어버린 것을 되찾기'],
      },
    ],
    namePool: ['서연', '지한', '하린', '도윤', '예나', '민재', '수아', '현우', '지우', '세린'],
    settings: ['바닷가 소도시', '오래된 서점 골목', '야근이 일상인 회사', '계절이 뚜렷한 캠퍼스'],
    episodeBeats: makeRomanceBeats(),
  },
  fantasy: {
    label: '판타지',
    titlePatterns: [
      (kw, s) => `${kw[0] ?? '별'}의 ${pick(['계승자', '파편', '속삭임', '왕좌'], s)}`,
      (kw, s) => `${pick(['금단의', '잊힌', '심연의', '새벽의'], s)} ${kw[0] ?? '마법'}`,
      (kw) => `${kw[0] ?? '운명'}을 깨운 자`,
    ],
    logline: (kw, p, a) =>
      `${eul(kw[0] ?? '금지된 힘')} 각성한 ${p.name}. ${iga(a.name)} 이끄는 세력과 맞서며 ${kw[1] ?? '세계'}의 균형을 되찾을 운명에 휘말린다.`,
    roles: [
      {
        role: '주인공',
        traits: ['평범한 척하지만 특별한', '두려움 속에서도 앞으로 가는'],
        goals: ['힘의 진실을 밝히기', '소중한 사람을 지키기'],
      },
      {
        role: '라이벌·적대자',
        traits: ['카리스마 있고 잔혹한', '신념이 확고한'],
        goals: ['세계를 자신의 질서로 재편하기'],
      },
      {
        role: '동료',
        traits: ['유머로 분위기를 바꾸는', '전투에 능한'],
        goals: ['주인공과 함께 살아남기'],
      },
      {
        role: '스승·안내자',
        traits: ['비밀이 많은', '엄격하지만 따뜻한'],
        goals: ['금기를 전수하되 파멸을 막기'],
      },
    ],
    namePool: ['아린', '카엘', '루나', '세이렌', '이안', '노아', '엘라', '드레이크', '미르', '세라'],
    settings: ['안개가 낀 고대 왕국', '떠다니는 마법 도시', '봉인된 숲', '균열이 열린 변경'],
    episodeBeats: makeFantasyBeats(),
  },
  thriller: {
    label: '스릴러',
    titlePatterns: [
      (kw, s) => `${pick(['침묵의', '닫힌', '추적되는', '남은'], s)} ${kw[0] ?? '밤'}`,
      (kw) => `${kw[0] ?? '진실'}은 말하지 않는다`,
      (kw, s) => `${kw[0] ?? '그림자'} ${pick(['속', '너머', '아래'], s)}`,
    ],
    logline: (kw, p, a) =>
      `${kw[0] ?? '사건'}에 휘말린 ${p.name}. ${a.name}의 함정을 피하며 ${kw[1] ?? '진실'}에 다가갈수록, 자신이 이미 판 안에 있었음을 깨닫는다.`,
    roles: [
      {
        role: '주인공',
        traits: ['예민하고 집요한', '불신을 기본값으로 두는'],
        goals: ['생존과 진실 사이에서의 선택'],
      },
      {
        role: '적대자',
        traits: ['항상 한 수 앞선', '일상 속에 숨은'],
        goals: ['주인공을 파멸시키거나 이용하기'],
      },
      {
        role: '동료·정보원',
        traits: ['신뢰할 수 있을지 모를', '위험을 감수하는'],
        goals: ['숨겨진 기록을 전달하기'],
      },
      {
        role: '배후 인물',
        traits: ['온화한 가면 뒤의 냉정함'],
        goals: ['시스템이 드러나지 않게 유지하기'],
      },
    ],
    namePool: ['강현', '유나', '태오', '시은', '재혁', '다온', '윤서', '한결', '채원', '도현'],
    settings: ['비가 끊이지 않는 도시', '폐쇄된 연구소', '심야 방송국', '항구 컨테이너 지구'],
    episodeBeats: makeThrillerBeats(),
  },
  mystery: {
    label: '미스터리',
    titlePatterns: [
      (kw, s) => `${pick(['열세 번째', '빈', '남겨진', '닫힌'], s)} ${kw[0] ?? '방'}`,
      (kw) => `${kw[0] ?? '이름'} 없는 단서`,
      (kw, s) => `${kw[0] ?? '사건'}의 ${pick(['이면', '목격자', '공백'], s)}`,
    ],
    logline: (kw, p, a) =>
      `${eul(kw[0] ?? '알 수 없는 사건')} 추적하는 ${p.name}. 단서마다 ${a.name}의 그림자가 드리우고, ${eun(kw[1] ?? '진실')} 가장 가까운 곳에 숨겨져 있다.`,
    roles: [
      {
        role: '탐정·주인공',
        traits: ['관찰력이 날카로운', '직감을 믿는'],
        goals: ['사건의 공백을 메우기'],
      },
      {
        role: '유력 용의자',
        traits: ['완벽한 알리바이의', '동정심을 유발하는'],
        goals: ['자신의 비밀을 지키기'],
      },
      {
        role: '조수·파트너',
        traits: ['현실적이고 꼼꼼한'],
        goals: ['주인공이 선을 넘지 않게 하기'],
      },
      {
        role: '의뢰인',
        traits: ['절박하고 모순된 진술을 하는'],
        goals: ['원하는 결론을 얻기'],
      },
    ],
    namePool: ['은호', '가영', '준서', '미래', '성민', '하은', '우진', '소희', '정우', '나래'],
    settings: ['눈이 쌓인 산장', '오래된 아파트', '해안 등대 마을', '폐교'],
    episodeBeats: makeMysteryBeats(),
  },
  sf: {
    label: 'SF',
    titlePatterns: [
      (kw, s) => `${pick(['궤도', '잔상', '프로토콜', '신호'], s)}: ${kw[0] ?? '기억'}`,
      (kw) => `${kw[0] ?? '인간'} 이후의 밤`,
      (kw, s) => `${kw[0] ?? '도시'}의 ${pick(['백업', '결함', '각성'], s)}`,
    ],
    logline: (kw, p, a) =>
      `${iga(kw[0] ?? '기술')} 일상이 된 세계에서 ${eun(p.name)} 금지된 ${eul(kw[1] ?? '기억')} 발견한다. ${iga(a.name)} 통제하는 시스템과 충돌하며 ‘인간다움’의 정의를 다시 쓴다.`,
    roles: [
      {
        role: '주인공',
        traits: ['시스템 바깥을 상상하는', '감정 데이터를 믿는'],
        goals: ['삭제된 진실을 복구하기'],
      },
      {
        role: '시스템·적대 세력',
        traits: ['논리로 포장된 폭력의'],
        goals: ['질서를 위해 변수를 제거하기'],
      },
      {
        role: '안드로이드·동료',
        traits: ['인간보다 인간적인'],
        goals: ['자신의 존재 증명'],
      },
      {
        role: '과학자·내부고발자',
        traits: ['죄책감에 잠식된'],
        goals: ['과거 실험을 속죄하기'],
      },
    ],
    namePool: ['리온', '하나', '케이', '솔', '에덴', '진', '마야', '녹스', '아이라', '제로'],
    settings: ['궤도 콜로니', '지하 데이터 금고', '기후 돔 도시', '폐기된 연구 위성'],
    episodeBeats: makeSfBeats(),
  },
  slice: {
    label: '일상·힐링',
    titlePatterns: [
      (kw, s) => `${pick(['오후', '모퉁이', '창가', '골목'], s)}의 ${kw[0] ?? '온기'}`,
      (kw) => `${kw[0] ?? '우리'}가 머무는 계절`,
      (kw, s) => `${kw[0] ?? '작은 가게'} ${pick(['일기', '손님들', '레시피'], s)}`,
    ],
    logline: (kw, p, a) =>
      `${kw[0] ?? '작은 일상'} 속에서 ${eun(p.name)} ${gwa(a.name)} 천천히 유대를 쌓는다. 거창한 사건 대신, ${iga(kw[1] ?? '관계')} 사람을 일으켜 세운다.`,
    roles: [
      {
        role: '주인공',
        traits: ['서툴지만 성실한', '작은 행복을 수집하는'],
        goals: ['자신만의 리듬 찾기'],
      },
      {
        role: '이웃·단골',
        traits: ['무심한 듯 챙기는'],
        goals: ['외로움을 나누기'],
      },
      {
        role: '가족·旧友',
        traits: ['서운함과 애정이 공존하는'],
        goals: ['어긋난 시간 메우기'],
      },
      {
        role: '새로운 사람',
        traits: ['바람을 몰고 온'],
        goals: ['정착할지 떠날지 결정하기'],
      },
    ],
    namePool: ['다정', '온유', '시우', '별', '가을', '바다', '라온', '고은', '찬', '이슬'],
    settings: ['골목 카페', '바닷가 게스트하우스', '동네 서점', '옥상 정원'],
    episodeBeats: makeSliceBeats(),
  },
  martial: {
    label: '무협',
    titlePatterns: [
      (kw, s) => `${pick(['혈흔', '검광', '강호', '암향'], s)}의 ${kw[0] ?? '약속'}`,
      (kw) => `${kw[0] ?? '검'}을 내려놓기 전에`,
      (kw, s) => `${pick(['천하', '사문', '비급'], s)} ${kw[0] ?? '쟁탈'}`,
    ],
    logline: (kw, p, a) =>
      `${eul(kw[0] ?? '비급')} 둘러싼 강호의 소용돌이. ${eun(p.name)} ${gwa(a.name)} 원수로 얽히며, 복수의 끝에서 ${kw[1] ?? '정의'}의 의미를 묻는다.`,
    roles: [
      {
        role: '주인공',
        traits: ['검보다 마음이 앞서는', '원한을 품은'],
        goals: ['사문의 진실을 밝히기'],
      },
      {
        role: '적수',
        traits: ['무공이 압도적인', '명분을 앞세우는'],
        goals: ['천하제일 자리 차지'],
      },
      {
        role: '사제·동료',
        traits: ['의리를 목숨처럼 여기는'],
        goals: ['주인공과 생사를 함께하기'],
      },
      {
        role: '고수·은둔자',
        traits: ['세상을 관조하는'],
        goals: ['후계에게 도를 전하기'],
      },
    ],
    namePool: ['청운', '월하', '묵련', '백호', '소연', '강철', '유성', '단심', '비연', '한설'],
    settings: ['중원 객잔', '절벽 사문', '밤의 시장', '봉인된 고분'],
    episodeBeats: makeMartialBeats(),
  },
  horror: {
    label: '호러',
    titlePatterns: [
      (kw, s) => `${pick(['들리지', '보이지', '열리지'], s)} ${pick(['않는', '말아야 할'], s + 1)} ${kw[0] ?? '문'}`,
      (kw) => `${kw[0] ?? '집'}이 기억하는 것`,
      (kw, s) => `${pick(['네 번째', '자정', '빈자리'], s)} ${kw[0] ?? '속삭임'}`,
    ],
    logline: (kw, p, a) =>
      `${iga(kw[0] ?? '이상한 현상')} 일상을 잠식한다. ${iga(p.name)} 파고들수록 ${a.name}—혹은 그것—의 규칙이 드러나고, ${eun(kw[1] ?? '공포')} 바깥이 아니라 안에서 자란다.`,
    roles: [
      {
        role: '주인공',
        traits: ['합리로 공포를 막으려는', '이미 무언가에 닿아 있는'],
        goals: ['저주의 규칙을 이해하기'],
      },
      {
        role: '존재·적대',
        traits: ['인간의 빈틈을 먹는'],
        goals: ['경계를 허물고 현세로 스며들기'],
      },
      {
        role: '동료',
        traits: ['믿다가 무너지는'],
        goals: ['함께 탈출하기'],
      },
      {
        role: '목격자·기록자',
        traits: ['이미 너무 많이 본'],
        goals: ['경고를 남기기'],
      },
    ],
    namePool: ['해인', '고스트', '수련', '밤', '기태', '유령', '선우', '미르', '창', '희'],
    settings: ['폐병원', '안개 마을', '지하 방공호', '오래된 하숙집'],
    episodeBeats: makeHorrorBeats(),
  },
  growth: {
    label: '성장',
    titlePatterns: [
      (kw, s) => `${pick(['열일곱', '스무 살', '그해 여름', '첫'], s)} ${kw[0] ?? '선택'}`,
      (kw) => `${kw[0] ?? '나'}를 찾는 지도`,
      (kw, s) => `${kw[0] ?? '꿈'} 앞의 ${pick(['용기', '망설임', '약속'], s)}`,
    ],
    logline: (kw, p, a) =>
      `${eul(kw[0] ?? '꿈')} 쫓는 ${p.name}. ${a.name}과의 갈등과 우정을 거쳐, ${kw[1] ?? '성장'}이란 이기는 일이 아니라 남게 되는 일임을 배운다.`,
    roles: [
      {
        role: '주인공',
        traits: ['서툰 열정의', '비교에 익숙한'],
        goals: ['나만의 속도로 나아가기'],
      },
      {
        role: '라이벌·친구',
        traits: ['빛나 보여 미운'],
        goals: ['인정과 우정 사이 균형'],
      },
      {
        role: '멘토',
        traits: ['실패를 먼저 겪은'],
        goals: ['다음 세대에 길 열어주기'],
      },
      {
        role: '가족',
        traits: ['사랑하지만 이해하지 못하는'],
        goals: ['안전을 명분으로 붙잡기'],
      },
    ],
    namePool: ['하늘', '봄', '준', '예린', '도하', '수호', '지민', '아라', '건', '소율'],
    settings: ['지방 소도시 고등학교', '연습실', '첫 자취방', '대회장'],
    episodeBeats: makeGrowthBeats(),
  },
  period: {
    label: '시대극',
    titlePatterns: [
      (kw, s) => `${pick(['궁', '저잣거리', '밤비', '옥새'], s)} ${kw[0] ?? '비밀'}`,
      (kw) => `${kw[0] ?? '조선'}의 그림자`,
      (kw, s) => `${pick(['꽃비', '한양', '서찰'], s)} ${kw[0] ?? '인연'}`,
    ],
    logline: (kw, p, a) =>
      `${kw[0] ?? '권력'}의 틈바구니에서 ${eun(p.name)} ${gwa(a.name)} 운명을 겨룬다. ${kw[1] ?? '충의'}와 생존 사이, 한 사람의 선택이 시대의 물길을 가른다.`,
    roles: [
      {
        role: '주인공',
        traits: ['신분보다 신념이 앞선', '말수를 아끼는'],
        goals: ['억울한 이름을 씻기'],
      },
      {
        role: '대립 세력',
        traits: ['예법으로 칼을 숨기는'],
        goals: ['왕권을 손에 넣기'],
      },
      {
        role: '조력자',
        traits: ['저잣거리를 아는'],
        goals: ['주인공을 살리고 자신도 남기'],
      },
      {
        role: '임금·어른',
        traits: ['고독하고 의심 많은'],
        goals: ['왕조를 지키기'],
      },
    ],
    namePool: ['이현', '홍련', '강무', '소희', '박청', '윤', '정', '혜', '민', '서'],
    settings: ['한양 골목', '궁궐 후원', '유배지', '객주'],
    episodeBeats: makePeriodBeats(),
  },
  default: {
    label: '창작',
    titlePatterns: [
      (kw, s) => `${kw[0] ?? '이야기'}의 ${pick(['시작', '이면', '잔향', '지도'], s)}`,
      (kw) => `${kw.slice(0, 2).join('과 ') || '이름 없는'} 밤`,
      (kw, s) => `${pick(['남겨진', '찾아가는', '깨어나는'], s)} ${kw[0] ?? '나'}`,
    ],
    logline: (kw, p, a) =>
      `${eul(kw[0] ?? '키워드')} 중심으로 펼쳐지는 ${p.name}의 여정. ${a.name}과의 충돌 속에서 ${eul(kw[1] ?? '진실')} 마주하고, 20화 만에 하나의 완결된 세계를 남긴다.`,
    roles: [
      {
        role: '주인공',
        traits: ['흔들리면서도 선택하는', '내면에 비밀이 있는'],
        goals: ['자신의 이야기를 완성하기'],
      },
      {
        role: '대립 인물',
        traits: ['주인공의 거울 같은'],
        goals: ['다른 결말을 강제하기'],
      },
      {
        role: '조력자',
        traits: ['현실의 닻이 되어주는'],
        goals: ['주인공이 혼자 않게 하기'],
      },
      {
        role: '전환 인물',
        traits: ['이야기의 방향을 트는'],
        goals: ['숨겨진 동기를 드러내기'],
      },
    ],
    namePool: ['윤', '서', '하준', '다은', '리안', '코아', '민', '별하', '진우', '아영'],
    settings: ['경계의 도시', '기억의 마을', '밤의 역', '닫힌 방'],
    episodeBeats: makeDefaultBeats(),
  },
}

function makeRomanceBeats() {
  return buildTwenty((ctx) => [
    {
      title: '첫 균열',
      summary: `${ctx.setting}에서 ${eun(ctx.protag.name)} ${ctx.kwa(0)} 얽힌 우연으로 ${gwa(ctx.rival.name)} 마주친다. 첫인상은 최악에 가깝다.`,
    },
    {
      title: '같은 공기',
      summary: `반복되는 조우. ${ctx.support.name}의 중재로 두 사람은 어쩔 수 없이 같은 목표—${ctx.k(1)}—를 공유하게 된다.`,
    },
    {
      title: '숨긴 사연',
      summary: `${ctx.protag.name}의 과거가 조금씩 드러난다. ${eun(ctx.rival.name)} 동정하지 않고, 대신 정확히 질문한다.`,
    },
    {
      title: '가까운 거리',
      summary: `위기 상황에서 서로를 구한다. 감정의 온도가 오르지만, 둘 다 인정하지 않는다.`,
    },
    {
      title: '오해의 씨앗',
      summary: `${ctx.mentor.name}의 등장으로 과거 연결고리가 암시된다. ${ctx.keul(0)} 둘러싼 소문이 관계를 흔든다.`,
    },
    {
      title: '솔직해지는 밤',
      summary: `긴 대화. ${iga(ctx.protag.name)} 처음으로 약점을 보이고, ${ctx.rival.name}도 가면을 조금 벗는다.`,
    },
    {
      title: '질투와 확인',
      summary: `제3자의 접근. 질투가 감정을 선명하게 만들고, 두 사람은 서로의 필요를 확인한다.`,
    },
    {
      title: '약속',
      summary: `작은 약속이 오간다. ${ctx.ki(1)} 두 사람을 묶는 상징이 된다.`,
    },
    {
      title: '균열의 확대',
      summary: `과거의 선택 때문에 ${iga(ctx.protag.name)} 거리를 둔다. ${eun(ctx.rival.name)} 쫓지 않기로 결심한다—잠시.`,
    },
    {
      title: '중간 고백',
      summary: `감정이 폭발한다. 그러나 타이밍이 어긋나 고백은 반만 전달된다.`,
    },
    {
      title: '외부의 압력',
      summary: `${ctx.setting} 밖의 시선, 가족·직장·운명이 ${ctx.keul(0)} 빌미로 둘을 갈라놓으려 한다.`,
    },
    {
      title: '재회를 위한 선택',
      summary: `${ctx.support.name}의 도움으로 ${eun(ctx.protag.name)} 도망치지 않기로 한다.`,
    },
    {
      title: '진실의 조각',
      summary: `${iga(ctx.mentor.name)} 숨긴 사실이 드러난다. 오해의 뿌리가 ${ctx.kwa(1)} 연결된다.`,
    },
    {
      title: '상처의 공유',
      summary: `서로를 탓하지 않는 대화. 사랑이 구원이 되려면 먼저 정직해야 함을 배운다.`,
    },
    {
      title: '위기',
      summary: `관계가 공개적으로 시험받는다. ${iga(ctx.rival.name)} 희생을 감수한다.`,
    },
    {
      title: '놓친 말',
      summary: `이별처럼 보이는 이별. 그러나 독자는 둘의 마음이 아직 끝나지 않았음을 안다.`,
    },
    {
      title: '추적',
      summary: `${iga(ctx.protag.name)} 먼저 손을 내민다. ${ctx.ki(0)} 다시 두 사람을 같은 장소로 이끈다.`,
    },
    {
      title: '완전한 고백',
      summary: `숨김없이. 과거·두려움·바람까지. ${ctx.genreLabel}의 정점에서 감정이 정면으로 충돌한다.`,
    },
    {
      title: '선택',
      summary: `안락한 후퇴와 불확실한 동행 사이. 두 사람은 함께 남기로 한다.`,
    },
    {
      title: '완결—같은 계절',
      summary: `${ctx.setting}에 ${ctx.k(0)}의 흔적이 남는다. ${gwa(ctx.protag.name)} ${ctx.rival.name}의 이야기는 닫히되, 일상 속에서 계속된다.`,
    },
  ])
}

function makeFantasyBeats() {
  return buildTwenty((ctx) => [
    {
      title: '각성의 징조',
      summary: `${ctx.setting}에서 ${ctx.protag.name}에게 ${ctx.k(0)}의 힘이 눈을 뜬다. 평범한 하루가 끝난다.`,
    },
    {
      title: '추격자',
      summary: `${ctx.rival.name}의 부하들이 나타난다. ${gwa(ctx.support.name)} 도망치며 첫 전투를 치른다.`,
    },
    {
      title: '안내자',
      summary: `${iga(ctx.mentor.name)} 힘의 기원과 ${ctx.k(1)}의 전설을 알려준다. 신뢰는 아직 불완전하다.`,
    },
    {
      title: '수련',
      summary: `통제되지 않는 능력. 실패와 작은 성공이 반복되며 동료 의식이 싹튼다.`,
    },
    {
      title: '마을의 대가',
      summary: `힘을 쓴 대가로 무고한 피해가 생긴다. ${ctx.protag.name}의 죄책감이 깊어진다.`,
    },
    {
      title: '적대의 논리',
      summary: `${ctx.rival.name}의 이념이 드러난다. 단순한 악이 아니라 ‘다른 정의’다.`,
    },
    {
      title: '유물',
      summary: `${ctx.kwa(0)} 연결된 유물을 확보한다. 동시에 배신이 암시된다.`,
    },
    {
      title: '균열',
      summary: `세계 곳곳에 균열이 열린다. ${ctx.setting}이 위험 지역으로 선포된다.`,
    },
    {
      title: '동료의 비밀',
      summary: `${ctx.support.name}의 과거가 밝혀진다. 팀의 신뢰가 흔들린다.`,
    },
    {
      title: '중간 결전',
      summary: `${gwa(ctx.rival.name)}의 첫 정면 대결. 패배하지만 적의 약점을 하나 본다.`,
    },
    {
      title: '재편성',
      summary: `패배 후 재정비. ${iga(ctx.mentor.name)} 금기 기술을 전수할지 고민한다.`,
    },
    {
      title: '금기의 문',
      summary: `${ctx.k(1)}의 봉인 앞에 선다. 열면 이길 수 있고, 닫으면 안전하다.`,
    },
    {
      title: '희생',
      summary: `누군가를 지키기 위한 희생. 전쟁의 얼굴이 개인에게 닿는다.`,
    },
    {
      title: '배후의 설계',
      summary: `갈등의 배후에 더 큰 구조가 있음이 드러난다. ${ctx.rival.name}도 장기말일 수 있다.`,
    },
    {
      title: '각성의 완성',
      summary: `${iga(ctx.protag.name)} ${ctx.keul(0)} 자신의 의지로 다스린다. 힘이 목적이 아님을 선언한다.`,
    },
    {
      title: '동맹',
      summary: `예상치 못한 세력과 손을 잡는다. 최종전을 위한 판이 짜인다.`,
    },
    {
      title: '함정',
      summary: `동맹 속 배신. ${ctx.setting}이 전장으로 변한다.`,
    },
    {
      title: '결전',
      summary: `${gwa(ctx.rival.name)}의 최후 대결. 이념과 힘이 충돌한다.`,
    },
    {
      title: '대가',
      summary: `승리의 대가. ${ctx.k(1)}의 균형이 회복되지만 되돌릴 수 없는 손실이 남는다.`,
    },
    {
      title: '완결—새로운 지도',
      summary: `세계는 이전으로 돌아가지 않는다. ${eun(ctx.protag.name)} 남은 이들과 다음 시대의 문을 연다.`,
    },
  ])
}

function makeThrillerBeats() {
  return buildTwenty((ctx) => [
    {
      title: '일상 속의 균열',
      summary: `${ctx.protag.name}의 일상에 ${ctx.k(0)} 관련 이상 징후가 끼어든다.`,
    },
    {
      title: '첫 위협',
      summary: `경고. 무시하면 대가가 따른다는 메시지. ${iga(ctx.support.name)} 처음 조력한다.`,
    },
    {
      title: '조사 개시',
      summary: `공식 경로가 막혀 있다. 비공식으로 ${ctx.keul(1)} 추적하기 시작한다.`,
    },
    {
      title: '가짜 단서',
      summary: `${iga(ctx.rival.name)} 깔아둔 미끼. 주인공은 함정에 한 발 빠진다.`,
    },
    {
      title: '배신 감각',
      summary: `가까운 인물을 의심한다. 불신이 생존 전략이 된다.`,
    },
    {
      title: '은신',
      summary: `${ctx.setting}의 음지로 숨는다. 규칙이 다른 세계가 펼쳐진다.`,
    },
    {
      title: '거래',
      summary: `정보를 얻기 위한 위험한 거래. 도덕적 선이 흐려진다.`,
    },
    {
      title: '목격자',
      summary: `${iga(ctx.mentor.name)} 핵심 증언을 남긴다—그리고 사라진다.`,
    },
    {
      title: '추적자',
      summary: `쫓는 자와 쫓기는 자가 뒤바뀐다. ${iga(ctx.protag.name)} 역으로 파고든다.`,
    },
    {
      title: '중간 폭로',
      summary: `${ctx.k(0)}의 실체가 조직·시스템임이 드러난다. 개인 원한 이상이 된다.`,
    },
    {
      title: '인질',
      summary: `소중한 사람이 압박 카드가 된다. 선택이 강요된다.`,
    },
    {
      title: '위장',
      summary: `적으로 위장하거나 내부에 침투한다. 정체성의 경계가 무너진다.`,
    },
    {
      title: '진실의 층',
      summary: `밝혀진 진실 아래 또 다른 층. ${ctx.rival.name}의 동기가 뒤집힌다.`,
    },
    {
      title: '붕괴',
      summary: `계획이 실패한다. ${gwa(ctx.support.name)}의 연락이 끊긴다.`,
    },
    {
      title: '재기',
      summary: `남은 단서 하나로 재구성. ${ctx.ki(1)} 열쇠였음이 판명된다.`,
    },
    {
      title: '대치',
      summary: `${gwa(ctx.rival.name)} 협상 테이블. 말의 칼이 오간다.`,
    },
    {
      title: '폭주',
      summary: `시스템이 주인공을 공개적으로 매장하려 한다. 시간이 없다.`,
    },
    {
      title: '결정적 증거',
      summary: `증거가 확보된다. 그러나 공개하면 자신 또한 무너질 수 있다.`,
    },
    {
      title: '결판',
      summary: `함정과 반함정. ${iga(ctx.protag.name)} 판을 뒤집는다.`,
    },
    {
      title: '완결—남은 침묵',
      summary: `사건은 닫히지만 모든 이름이 밝혀지지는 않는다. ${eun(ctx.protag.name)} 살아남았고, 세상은 조금 더 정직해졌다.`,
    },
  ])
}

function makeMysteryBeats() {
  return buildTwenty((ctx) => [
    {
      title: '의뢰',
      summary: `${iga(ctx.mentor.name)} ${ctx.k(0)} 사건을 ${ctx.protag.name}에게 맡긴다. 현장은 ${ctx.setting}.`,
    },
    {
      title: '현장',
      summary: `어긋난 디테일들. ${gwa(ctx.support.name)} 함께 초동 수사를 정리한다.`,
    },
    {
      title: '인물 지도',
      summary: `관계도를 그린다. ${iga(ctx.rival.name)} 유력하게 떠오른다.`,
    },
    {
      title: '알리바이',
      summary: `완벽한 알리바이가 오히려 수상하다. 시간의 공백을 찾는다.`,
    },
    {
      title: '두 번째 사건',
      summary: `유사 사건이 발생. 연쇄의 패턴이 ${ctx.kwa(1)} 연결된다.`,
    },
    {
      title: '거짓 진술',
      summary: `목격자들이 같은 방향으로 거짓말한다. 압력이 감지된다.`,
    },
    {
      title: '개인적 연루',
      summary: `${ctx.protag.name}의 과거가 사건과 겹친다. 객관성이 흔들린다.`,
    },
    {
      title: '숨겨진 방',
      summary: `물리적·심리적 ‘닫힌 방’의 구조가 드러난다.`,
    },
    {
      title: '용의자 심문',
      summary: `${gwa(ctx.rival.name)}의 대면. 논리 싸움에서 한 치도 양보하지 않는다.`,
    },
    {
      title: '중간 가설',
      summary: `가설을 발표하지만 반증이 나온다. 수사가 원점으로 돌아간다.`,
    },
    {
      title: '죽은 단서',
      summary: `결정적 증거가 소실된다. ${iga(ctx.support.name)} 위험을 감수한다.`,
    },
    {
      title: '다른 동기',
      summary: `범행 동기가 복수·돈이 아닐 수 있음이 암시된다.`,
    },
    {
      title: '재구성',
      summary: `타임라인을 다시 짠다. ${ctx.k(0)}의 의미가 뒤집힌다.`,
    },
    {
      title: '함정 수사',
      summary: `범인을 유인하는 미끼를 놓는다. 위험이 커진다.`,
    },
    {
      title: '배후',
      summary: `실행범 뒤에 설계자가 있다. ${ctx.mentor.name}의 역할이 재조명된다.`,
    },
    {
      title: '고백과 거짓',
      summary: `자백이 나오지만 부분만 진실이다.`,
    },
    {
      title: '결정적 모순',
      summary: `작은 모순 하나가 전체를 무너뜨린다.`,
    },
    {
      title: '해명',
      summary: `${iga(ctx.protag.name)} 사건 전체를 재구성해 공개한다.`,
    },
    {
      title: '체포—그리고',
      summary: `범인은 잡히지만, ${ctx.k(1)}에 관한 질문은 남는다.`,
    },
    {
      title: '완결—빈자리',
      summary: `사건은 완결된다. ${ctx.setting}에는 설명이 끝난 뒤에도 남는 공백이 있다.`,
    },
  ])
}

function makeSfBeats() {
  return buildTwenty((ctx) => [
    {
      title: '결함 로그',
      summary: `${iga(ctx.protag.name)} ${ctx.k(0)} 시스템에서 삭제된 기록을 발견한다.`,
    },
    {
      title: '감시',
      summary: `조회 기록이 추적된다. ${ctx.rival.name}의 보안망이 움직인다.`,
    },
    {
      title: '비공식 조력',
      summary: `${ctx.support.name}—기계이거나 반쯤 인간—이 접촉해 온다.`,
    },
    {
      title: '기억 조각',
      summary: `${ctx.kwa(1)} 관련된 개인 기억이 복원된다. 정체성이 흔들린다.`,
    },
    {
      title: '도시 규칙',
      summary: `${ctx.setting}의 시민 등급·감정 규제 규칙이 폭로된다.`,
    },
    {
      title: '실험체',
      summary: `과거 실험의 생존자 목록. ${ctx.protag.name}의 이름이 있다.`,
    },
    {
      title: '내부고발',
      summary: `${iga(ctx.mentor.name)} 양심 선언을 준비한다. 암살이 시도된다.`,
    },
    {
      title: '지하 네트워크',
      summary: `저항 세력과 만난다. 목적의 순수함을 의한다.`,
    },
    {
      title: '시뮬레이션',
      summary: `현실이 시뮬레이션일 가능성이 제기된다. 증거를 검증한다.`,
    },
    {
      title: '중간 붕괴',
      summary: `돔/궤도/서버 일부 붕괴. 민간 피해가 발생한다.`,
    },
    {
      title: '선택의 알고리즘',
      summary: `${iga(ctx.rival.name)} ‘최대 행복’ 논리를 제시한다. 유혹적이다.`,
    },
    {
      title: '인간성 테스트',
      summary: `${ctx.support.name}의 존재 권리가 재판된다. 주인공이 편을 든다.`,
    },
    {
      title: '백업',
      summary: `의식을 백업할 기회. 불멸과 소멸 사이 선택.`,
    },
    {
      title: '침투',
      summary: `코어 시스템 침투. ${ctx.k(0)}의 원본 코드에 접근한다.`,
    },
    {
      title: '배신 프로토콜',
      summary: `동지 중 하나가 업데이트된 충성을 따른다.`,
    },
    {
      title: '공개',
      summary: `진실이 네트워크에 유출된다. 사회가 흔들린다.`,
    },
    {
      title: '최종 대치',
      summary: `${gwa(ctx.rival.name)} 시스템 권한 쟁탈전.`,
    },
    {
      title: '리셋 거부',
      summary: `세계를 리셋하는 대신, 불완전한 자유를 택한다.`,
    },
    {
      title: '잔상',
      summary: `승리 후에도 남는 데이터 잔상. 누군가는 돌아오지 못한다.`,
    },
    {
      title: '완결—새 프로토콜',
      summary: `${ctx.keul(1)} 포함한 새 규칙이 쓰인다. ${eun(ctx.protag.name)} 감시받지 않는 아침을 맞는다.`,
    },
  ])
}

function makeSliceBeats() {
  return buildTwenty((ctx) => [
    {
      title: '문을 열다',
      summary: `${iga(ctx.protag.name)} ${ctx.setting}에서 하루를 시작한다. ${ctx.ki(0)} 일상의 중심이다.`,
    },
    {
      title: '단골',
      summary: `${iga(ctx.rival.name)} 어색한 단골로 나타난다. 대화는 짧지만 남는다.`,
    },
    {
      title: '작은 사고',
      summary: `사소한 실수가 사람을 연결한다. ${iga(ctx.support.name)} 웃음을 만든다.`,
    },
    {
      title: '계절의 편지',
      summary: `날씨가 바뀌며 감정도 바뀐다. ${ctx.k(1)}에 대한 그리움이 스민다.`,
    },
    {
      title: '가족의 전화',
      summary: `${gwa(ctx.mentor.name)}의 통화. 이해받지 못함이 상처가 된다.`,
    },
    {
      title: '함께하는 일',
      summary: `공동 작업·행사. 서로의 리듬을 배운다.`,
    },
    {
      title: '비 오는 휴일',
      summary: `계획 없는 하루. 침묵이 편안해진다.`,
    },
    {
      title: '오해',
      summary: `작은 말이 크게 와닿는다. 잠시 거리가 생긴다.`,
    },
    {
      title: '화해의 맛',
      summary: `음식으로, 혹은 심부름으로 화해한다. ${ctx.ki(0)} 매개가 된다.`,
    },
    {
      title: '중간—머무름',
      summary: `떠나려던 마음이 머문다. 이유가 생긴다.`,
    },
    {
      title: '손님의 사연',
      summary: `스쳐 가는 인물의 이야기가 주인공을 비춘다.`,
    },
    {
      title: '축제의 밤',
      summary: `${ctx.setting}의 작은 축제. 관계가 한 단계 깊어진다.`,
    },
    {
      title: '흔들림',
      summary: `외부 제안—도시, 이직, 이별. 안정의 가치가 시험된다.`,
    },
    {
      title: '솔직한 오후',
      summary: `그동안 미룬 말을 한다. 드라마 없이도 진심이 닿는다.`,
    },
    {
      title: '도움의 방향',
      summary: `${iga(ctx.support.name)} 위기에 처하고, 주인공이 먼저 손을 쓴다.`,
    },
    {
      title: '계절이 바뀌다',
      summary: `시간이 흘렀음을 실감한다. ${ctx.ki(1)} 다른 의미가 된다.`,
    },
    {
      title: '선택의 아침',
      summary: `남을지 떠날지. 거창하지 않은 결단.`,
    },
    {
      title: '함께의 정의',
      summary: `연인·친구·이웃—이름보다 태도를 고른다.`,
    },
    {
      title: '일상으로',
      summary: `사건 없이, 그러나 이전과 다른 일상으로 돌아온다.`,
    },
    {
      title: '완결—열린 문',
      summary: `${ctx.setting}의 문이 다시 열린다. ${ctx.protag.name}의 이야기는 ‘계속되는 완결’이다.`,
    },
  ])
}

function makeMartialBeats() {
  return buildTwenty((ctx) => [
    {
      title: '피의 밤',
      summary: `${ctx.protag.name}의 사문이 ${ctx.k(0)} 때문에 습격당한다.`,
    },
    {
      title: '도망',
      summary: `${gwa(ctx.support.name)} 함께 강호로 나선다. 첫 결투에서 패한다.`,
    },
    {
      title: '은둔 고수',
      summary: `${eul(ctx.mentor.name)} 만나 기초를 다시 배운다.`,
    },
    {
      title: '비급의 소문',
      summary: `${ctx.k(1)} 비급을 둘러싼 세력 다툼이 가시화된다.`,
    },
    {
      title: '객잔 결투',
      summary: `명성을 얻기 위한 결투. 승리보다 방식이 남는다.`,
    },
    {
      title: '적의 얼굴',
      summary: `${iga(ctx.rival.name)} 직접 모습을 드러낸다. 압도적이다.`,
    },
    {
      title: '동문',
      summary: `살아 있던 동문을 만난다. 기쁨과 의심이 공존한다.`,
    },
    {
      title: '암향',
      summary: `암살 조직의 개입. 강호의 규칙이 무너진다.`,
    },
    {
      title: '수련의 벽',
      summary: `경지를 돌파하지 못한다. 분노가 독이 된다.`,
    },
    {
      title: '중간 대결',
      summary: `${ctx.rival.name}의 부하 수장을 쓰러뜨린다. 본진이 움직인다.`,
    },
    {
      title: '배신',
      summary: `믿었던 이가 적을 돕는다. 이유가 있다.`,
    },
    {
      title: '폐관',
      summary: `짧은 폐관 수련. ${ctx.k(0)}의 심법을 체화한다.`,
    },
    {
      title: '동맹',
      summary: `원수 가문과도 손을 잡는다. 대의 앞에 사사로움을 내려놓는다.`,
    },
    {
      title: '함정 연회',
      summary: `연회가 학살로 변한다. 생존자들이 결속한다.`,
    },
    {
      title: '진실',
      summary: `사문 몰락의 진상이 밝혀진다. 복수가 단순하지 않아진다.`,
    },
    {
      title: '결의',
      summary: `${iga(ctx.protag.name)} 검의 길을 재정의한다.`,
    },
    {
      title: '천하풍운',
      summary: `세력 결전. ${ctx.setting}이 전장이다.`,
    },
    {
      title: '최후 일합',
      summary: `${gwa(ctx.rival.name)}의 최후 일합. 이념과 무공이 동시에 겨룬다.`,
    },
    {
      title: '강호의 새벽',
      summary: `승패 이후의 질서. 남은 자들이 규칙을 다시 쓴다.`,
    },
    {
      title: '완결—검을 꽂다',
      summary: `${eun(ctx.protag.name)} 복수 대신 다음 세대를 택한다. ${ctx.keun(1)} 봉인되거나 공유된다.`,
    },
  ])
}

function makeHorrorBeats() {
  return buildTwenty((ctx) => [
    {
      title: '이상 징후',
      summary: `${ctx.setting}에서 ${ctx.ki(0)} 일상을 어긋나게 한다.`,
    },
    {
      title: '규칙',
      summary: `살아남기 위한 규칙이 전해진다. 지키지 않은 사람이 사라진다.`,
    },
    {
      title: '기록',
      summary: `${ctx.mentor.name}의 오래된 기록. ${ctx.k(1)}의 이름이 반복된다.`,
    },
    {
      title: '동료',
      summary: `${gwa(ctx.support.name)} 합류. 공포를 나눠도 줄지 않는다.`,
    },
    {
      title: '모방',
      summary: `존재가 사람의 목소리를 흉내 낸다.`,
    },
    {
      title: '닫힌 공간',
      summary: `탈출구가 하나씩 사라진다.`,
    },
    {
      title: '의심',
      summary: `누가 이미 ‘그것’인지 알 수 없다.`,
    },
    {
      title: '제물',
      summary: `규칙이 제물을 요구한다. 윤리가 무너진다.`,
    },
    {
      title: '과거',
      summary: `${iga(ctx.protag.name)} 이미 이 공포와 연결된 적 있음이 드러난다.`,
    },
    {
      title: '중간—눈맞춤',
      summary: `${ctx.rival.name}(존재)과 직접 대면. 이성이 미끄러진다.`,
    },
    {
      title: '배신',
      summary: `산 자가 산 자를 판다.`,
    },
    {
      title: '금서',
      summary: `금지된 지식을 열어 ${ctx.k(0)}의 기원을 본다.`,
    },
    {
      title: '역이용',
      summary: `규칙의 허점을 찾아 역으로 가둔다—잠시.`,
    },
    {
      title: '대가',
      summary: `봉인의 대가로 기억·감각·관계가 깎인다.`,
    },
    {
      title: '재침입',
      summary: `봉인이 다시 열린다. 이번엔 더 영리하다.`,
    },
    {
      title: '최후의 규칙',
      summary: `살아남기 위한 마지막 금기. 지키면 사람이 덜 남는다.`,
    },
    {
      title: '대면',
      summary: `${iga(ctx.protag.name)} 공포의 이름을 부른다.`,
    },
    {
      title: '희생적 봉인',
      summary: `누군가가 남고, 누군가가 문을 닫는다.`,
    },
    {
      title: '여진',
      summary: `세계는 조용해진다. 너무 조용하다.`,
    },
    {
      title: '완결—남는 소리',
      summary: `이야기는 끝나지만 ${ctx.k(1)}의 속삭임은 독자의 바깥에서 이어질 듯하다.`,
    },
  ])
}

function makeGrowthBeats() {
  return buildTwenty((ctx) => [
    {
      title: '시작선',
      summary: `${iga(ctx.protag.name)} ${ctx.keul(0)} 향해 첫발을 내딛는다. ${ctx.setting}.`,
    },
    {
      title: '비교',
      summary: `${ctx.rival.name}의 재능 앞에서 작아진다.`,
    },
    {
      title: '멘토',
      summary: `${iga(ctx.mentor.name)} 가혹하지만 정확한 조언을 준다.`,
    },
    {
      title: '실패',
      summary: `첫 평가·대회·시험에서 무너진다.`,
    },
    {
      title: '친구',
      summary: `${gwa(ctx.support.name)}의 우정이 버팀목이 된다.`,
    },
    {
      title: '가족의 시선',
      summary: `기대와 걱정이 충돌한다. ${ctx.ki(1)} 갈등의 핵이 된다.`,
    },
    {
      title: '야심',
      summary: `이기고 싶다는 욕망이 관계를 잠식한다.`,
    },
    {
      title: '화해의 연습',
      summary: `자존심을 조금 내려놓는다.`,
    },
    {
      title: '슬럼프',
      summary: `노력이 배신하는 구간. 의미가 흐려진다.`,
    },
    {
      title: '중간—왜',
      summary: `‘왜 이 길을 택했는가’를 다시 묻는다.`,
    },
    {
      title: '라이벌의 약점',
      summary: `${ctx.rival.name}도 흔들리고 있었음을 본다. 적이 사람이 된다.`,
    },
    {
      title: '팀',
      summary: `혼자보다 함께일 때의 힘을 배운다.`,
    },
    {
      title: '큰 무대',
      summary: `본선·발표·공연. 긴장과 몰입.`,
    },
    {
      title: '좌절 후의 선택',
      summary: `결과가 기대에 못 미친다. 포기와 재도전 사이.`,
    },
    {
      title: '정직한 대화',
      summary: `가족·스승·친구에게 진짜 마음을 말한다.`,
    },
    {
      title: '나만의 방식',
      summary: `모방이 아닌 자기 스타일을 찾는다. ${ctx.ki(0)} 재정의된다.`,
    },
    {
      title: '재대결',
      summary: `${gwa(ctx.rival.name)} 다시 만난다. 승패보다 태도가 다르다.`,
    },
    {
      title: '인정',
      summary: `외부의 인정과 내부의 만족이 어긋남을 수용한다.`,
    },
    {
      title: '다음 문',
      summary: `하나의 목표가 끝나고 다음 문이 보인다.`,
    },
    {
      title: '완결—성장의 형태',
      summary: `${eun(ctx.protag.name)} 더 강해졌다기보다, 더 자신다워졌다. ${ctx.keun(1)} 계속된다.`,
    },
  ])
}

function makePeriodBeats() {
  return buildTwenty((ctx) => [
    {
      title: '입궁·입성',
      summary: `${iga(ctx.protag.name)} ${ctx.setting}에 발을 들인다. ${ctx.ki(0)} 운명을 부른다.`,
    },
    {
      title: '예법의 칼',
      summary: `말과 예법이 무기다. ${iga(ctx.rival.name)} 압박을 가한다.`,
    },
    {
      title: '저잣거리',
      summary: `${gwa(ctx.support.name)} 민심을 읽는다.`,
    },
    {
      title: '서찰',
      summary: `비밀 서찰이 ${ctx.k(1)}의 단서를 남긴다.`,
    },
    {
      title: '모함',
      summary: `누명이 씌워진다. 생존이 우선이 된다.`,
    },
    {
      title: '밤의 회동',
      summary: `동맹을 모은다. 신뢰는 조건부다.`,
    },
    {
      title: '어전',
      summary: `${ctx.mentor.name}(윗사람) 앞에서 진언한다. 위험이 커진다.`,
    },
    {
      title: '암살',
      summary: `암살 미수. 궁·거리의 긴장이 고조된다.`,
    },
    {
      title: '신분',
      summary: `숨긴 신분이 흔들린다.`,
    },
    {
      title: '중간—역풍',
      summary: `세력이 역전된다. ${iga(ctx.protag.name)} 궁지에 몰린다.`,
    },
    {
      title: '민란의 불씨',
      summary: `백성의 분노가 ${ctx.kwa(0)} 연결된다.`,
    },
    {
      title: '밀약',
      summary: `적과도 밀약을 맺는다. 대의와 생존의 교차.`,
    },
    {
      title: '배신',
      summary: `가까운 이의 배신. 대가와 이유가 아프다.`,
    },
    {
      title: '재기',
      summary: `유배·추방에서 돌아와 판을 다시 짠다.`,
    },
    {
      title: '증거',
      summary: `${ctx.keul(1)} 입증할 결정적 물증.`,
    },
    {
      title: '공개',
      summary: `조정·저자에서 진실이 공개된다.`,
    },
    {
      title: '결전',
      summary: `${gwa(ctx.rival.name)}의 정치·무력 결전.`,
    },
    {
      title: '새 질서',
      summary: `승자의 질서가 선포된다. 피의 대가가 남는다.`,
    },
    {
      title: '사사로움',
      summary: `역사의 뒤안길에서 개인의 작별을 고한다.`,
    },
    {
      title: '완결—시대의 여백',
      summary: `기록에 남지 않은 이름들. ${ctx.protag.name}의 선택은 시대의 물길을 조금 바꿨다.`,
    },
  ])
}

function makeDefaultBeats() {
  return buildTwenty((ctx) => [
    {
      title: '입구',
      summary: `${ctx.protag.name}의 세계에 ${ctx.ki(0)} 들어온다.`,
    },
    {
      title: '충돌',
      summary: `${gwa(ctx.rival.name)}의 첫 충돌. 가치관이 부딪친다.`,
    },
    {
      title: '동행',
      summary: `${iga(ctx.support.name)} 합류한다. 여정이 형태를 갖춘다.`,
    },
    {
      title: '단서',
      summary: `${ctx.k(1)}에 관한 단서. ${ctx.setting}이 중요해진다.`,
    },
    {
      title: '과거',
      summary: `주인공의 과거가 현재를 설명한다.`,
    },
    {
      title: '시험',
      summary: `능력·신념·관계가 시험받는다.`,
    },
    {
      title: '유혹',
      summary: `쉬운 길이 제시된다. 대가가 있다.`,
    },
    {
      title: '균열',
      summary: `팀 내부 균열. 솔직함이 부족했다.`,
    },
    {
      title: '재규합',
      summary: `다시 손을 잡는다. 조건이 달라진다.`,
    },
    {
      title: '중간 전환',
      summary: `이야기의 질문이 바뀐다. ‘누가’에서 ‘왜’로.`,
    },
    {
      title: '배후',
      summary: `${gwa(ctx.mentor.name)} 관련된 배후가 드러난다.`,
    },
    {
      title: '상실',
      summary: `되돌릴 수 없는 상실. 톤이 짙어진다.`,
    },
    {
      title: '각성',
      summary: `${iga(ctx.protag.name)} 자신의 욕망을 인정한다.`,
    },
    {
      title: '전략',
      summary: `최종 국면을 위한 계획. ${ctx.ki(0)} 열쇠다.`,
    },
    {
      title: '함정',
      summary: `계획이 어긋난다. 즉흥이 필요하다.`,
    },
    {
      title: '대면',
      summary: `${gwa(ctx.rival.name)}의 본심 대면.`,
    },
    {
      title: '결단',
      summary: `돌이킬 수 없는 선택.`,
    },
    {
      title: '여파',
      summary: `선택의 결과가 세계에 퍼진다.`,
    },
    {
      title: '정리',
      summary: `남은 관계를 정리하고 의미를 부여한다.`,
    },
    {
      title: '완결—닫히는 원',
      summary: `${ctx.kwa(1)} 함께 이야기가 원점을 지나 닫힌다. ${eun(ctx.protag.name)} 다른 사람이 되어 있다.`,
    },
  ])
}

function buildTwenty(
  factory: (ctx: BeatContext) => { title: string; summary: string }[],
): GenrePack['episodeBeats'] {
  return Array.from({ length: 20 }, (_, i) => (ctx: BeatContext) => {
    const beats = factory(ctx)
    return beats[i]
  })
}

function buildCharacters(
  pack: GenrePack,
  seed: number,
  keywords: string[],
): Character[] {
  const ages = ['24', '27', '31', '19', '22', '35', '28', '26']
  return pack.roles.map((roleDef, i) => {
    const name = pickAlt(pack.namePool, seed, i * 3 + 1)
    const trait = pickAlt(roleDef.traits, seed, i * 5)
    const goal = pickAlt(roleDef.goals, seed, i * 7)
    const kw = keywords[i % Math.max(keywords.length, 1)] ?? '운명'
    return {
      name,
      role: roleDef.role,
      age: pickAlt(ages, seed, i * 2),
      personality: `${trait} 성격. ${kw}에 유독 민감하다.`,
      background: `${pickAlt(pack.settings, seed, i + 2)}에서 자랐거나 오래 머물렀다. ${keywords[0] ?? '사건'}과 직·간접적으로 연결되어 있다.`,
      goal,
    }
  })
}

function buildEpisodes(
  pack: GenrePack,
  chars: Character[],
  keywords: string[],
  setting: string,
  genreLabel: string,
): Episode[] {
  const [protag, rival, support, mentor] = chars
  const kw = keywords.length ? keywords : ['운명', '진실']
  const k = (i: number) => kw[i % kw.length]
  const ctx: BeatContext = {
    kw,
    k,
    keul: (i) => eul(k(i)),
    ki: (i) => iga(k(i)),
    keun: (i) => eun(k(i)),
    kwa: (i) => gwa(k(i)),
    protag,
    rival,
    support,
    mentor,
    setting,
    genreLabel,
  }
  return pack.episodeBeats.map((fn, i) => {
    const beat = fn(ctx)
    return {
      number: i + 1,
      title: `${i + 1}화. ${beat.title}`,
      summary: beat.summary,
    }
  })
}

export function generateStoryNote(keywordRaw: string, genreRaw: string): StoryNote {
  const keywords = parseKeywords(keywordRaw)
  const genreKey = detectGenre(genreRaw)
  const pack = packs[genreKey]
  const seed = hash(`${keywordRaw}|${genreRaw}|${Date.now() % 100000}`)
  const setting = pick(pack.settings, seed)
  const characters = buildCharacters(pack, seed, keywords)
  const titleFn = pick(pack.titlePatterns, seed)
  const title = titleFn(keywords.length ? keywords : ['이야기'], seed)
  const logline = pack.logline(
    keywords.length ? keywords : ['운명', '진실'],
    characters[0],
    characters[1],
  )
  const genreLabel = genreRaw.trim() || pack.label
  const episodes = buildEpisodes(pack, characters, keywords, setting, genreLabel)

  return {
    title,
    logline,
    genre: genreLabel,
    keywords: keywords.length ? keywords : ['자유 창작'],
    characters,
    episodes,
  }
}
