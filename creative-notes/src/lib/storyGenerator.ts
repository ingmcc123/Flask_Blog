import type { Character, Episode, StoryNote } from '../types'
import { RIDI_PLATFORM } from './ridiTrends'

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

function eul(word: string): string {
  return word + (hasBatchim(word) ? '을' : '를')
}

function iga(word: string): string {
  return word + (hasBatchim(word) ? '이' : '가')
}

function eun(word: string): string {
  return word + (hasBatchim(word) ? '은' : '는')
}

function gwa(word: string): string {
  return word + (hasBatchim(word) ? '과' : '와')
}

function parseKeywords(raw: string): string[] {
  return raw
    .split(/[,，、/\s]+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function has(tags: string[], ...needles: string[]): boolean {
  const joined = tags.join(' ').toLowerCase()
  return needles.some((n) => joined.includes(n.toLowerCase()))
}

const MALE_NAMES = [
  '차서준',
  '한도윤',
  '권태양',
  '강이현',
  '윤재하',
  '백시온',
  '문정우',
  '오세현',
  '진우빈',
  '서하람',
]
const FEMALE_NAMES = [
  '이서연',
  '김하린',
  '박채원',
  '정예나',
  '최수아',
  '윤지안',
  '한소율',
  '강미래',
  '신유나',
  '조다온',
]
const SUPPORT_NAMES = ['민재', '태오', '하은', '시우', '도경', '나래']
const RIVAL_NAMES = ['유진아', '서미래', '강태린', '한소희', '류진']

const SETTINGS = [
  '강남 본사 임원실',
  '한남동 펜트하우스',
  '야근이 일상인 스타트업',
  '호텔 스위트',
  '지방 출장지 리조트',
  '비 오는 심야 주차장',
  '가족 모임이 열린 별장',
  '비밀이 많은 사옥 옥상',
]

interface Cast {
  heroine: Character
  hero: Character
  support: Character
  rival: Character
}

function buildCast(tags: string[], seed: number): Cast {
  const heroTrait = has(tags, '집착')
    ? '소유욕이 강하고 한번 집으면 놓지 않는'
    : has(tags, '존댓말')
      ? '공손한 말투 뒤에 욕망을 숨기는'
      : has(tags, '능글')
        ? '능글맞게 거리를 좁히는'
        : has(tags, '냉정', '오만')
          ? '차갑고 계산적이지만 한 사람에게만 무너지는'
          : '카리스마 있고 통제에 익숙한'

  const heroineTrait = has(tags, '철벽')
    ? '감정을 쉽게 내주지 않는 철벽'
    : has(tags, '상처')
      ? '과거 상처로 사랑을 경계하는'
      : has(tags, '능력')
        ? '일에서는 단단하고 관계에서는 서툰'
        : has(tags, '도도')
          ? '자존심이 세고 쉽게 굽히지 않는'
          : '평범해 보이지만 한번 빠지면 깊은'

  const contract = has(tags, '계약', '선결', '정략')
  const office = has(tags, '사내', '전문직')

  return {
    heroine: {
      name: pick(FEMALE_NAMES, seed),
      role: '여주인공',
      age: pickAlt(['24', '26', '27', '28', '29'], seed, 1),
      personality: `${heroineTrait} 성격. 19금 관계에서도 감정의 주도권을 쉽게 내주지 않는다.`,
      background: office
        ? '같은 업계·회사에서 실무로 살아남은 커리어. 남주의 세계와 겹치며 운명이 꼬인다.'
        : contract
          ? '집안·빚·이미지 관리 때문에 계약 관계에 발을 들인다.'
          : '평범한 일상 속에서 남주와 원나잇·우연·재회로 얽힌다.',
      goal: contract
        ? '계약 기간만 버티고 상처 없이 빠져나오기'
        : '감정에 휘둘리지 않고 나로 남기',
    },
    hero: {
      name: pickAlt(MALE_NAMES, seed, 3),
      role: has(tags, '재벌') ? '남주인공 · 재벌/오너가' : '남주인공',
      age: pickAlt(['29', '31', '33', '34', '36'], seed, 2),
      personality: `${heroTrait} 성격. 더티토크와 집착이 로맨스의 엔진이 된다.`,
      background: has(tags, '재벌')
        ? '그룹 후계·오너가. 원하는 것은 계약과 돈으로 손에 넣는 데 익숙하다.'
        : office
          ? '팀장·임원급. 사내에서는 완벽주의, 둘만 있으면 선을 넘는다.'
          : '성공한 전문직/사업가. 여주를 ‘변수’로 인식했다가 중독된다.',
      goal: '여주를 독점하고, 계약이든 사랑이든 자기 방식으로 붙잡기',
    },
    support: {
      name: pick(SUPPORT_NAMES, seed + 7),
      role: '조력자·친구',
      age: '27',
      personality: '현실적이고 직설적. 위험할 때 말리는 역할.',
      background: '여주의 오랜 친구이거나 남주의 비서/동생.',
      goal: '두 사람이 파멸하지 않게 선을 지키기',
    },
    rival: {
      name: pick(RIVAL_NAMES, seed + 11),
      role: has(tags, '삼각') ? '삼각 관계 인물' : '방해자·전여친/정략 상대',
      age: pickAlt(['28', '30', '32'], seed, 4),
      personality: '세련되고 집요하다. 남주의 세계에 원래 있던 사람.',
      background: '가문·회사·과거 연애로 남주와 연결되어 있다.',
      goal: '여주를 밀어내고 원래의 질서를 회복하기',
    },
  }
}

function buildTitle(tags: string[], cast: Cast, seed: number): string {
  if (has(tags, '계약', '선결', '정략')) {
    return `${pick(['계약', '위장', '임시'], seed)} ${pick(['결혼', '연애', '동거'], seed + 1)}의 ${pick(['온도', '함정', '재계약'], seed + 2)}`
  }
  if (has(tags, '사내')) {
    return `${pick(['팀장님', '대표님', '부장님'], seed)}은 ${pick(['존댓말', '야근', '비밀'], seed + 1)} 중`
  }
  if (has(tags, '원나잇')) {
    return `${pick(['하룻밤', '원나잇'], seed)} 다음의 ${pick(['규칙', '남자', '집착'], seed + 1)}`
  }
  if (has(tags, '집착', '소유욕')) {
    return `${cast.hero.name}의 ${pick(['독점', '집착', '소유'], seed)}`
  }
  const patterns = [
    `${pick(['달빛', '심야', '비밀'], seed)} ${pick(['계약서', '키스', '소유권'], seed + 3)}`,
    `${eul(pick(['당신', '그 남자', cast.hero.name], seed))} ${pick(['놓칠', '버릴', '잊을'], seed + 1)} 수 없는`,
    `${pick(['몸만', '하룻밤만', '잠깐만'], seed)} 하기로 했는데`,
  ]
  return pick(patterns, seed)
}

function buildLogline(tags: string[], cast: Cast, tone: string): string {
  const hook = has(tags, '계약', '선결', '정략')
    ? `${gwa(cast.heroine.name)} ${cast.hero.name}의 계약 관계`
    : has(tags, '원나잇')
      ? `원나잇으로 시작된 ${cast.heroine.name}과 ${cast.hero.name}`
      : has(tags, '사내')
        ? `사내에서 선을 넘은 ${cast.heroine.name}과 ${cast.hero.name}`
        : `${iga(cast.heroine.name)} ${cast.hero.name}에게 붙잡힌 이야기`

  const heat = has(tags, '고수위', '씬중심', '더티토크')
    ? '고수위 스킨십과 더티토크가 감정을 앞질러 흐르고'
    : '수위 높은 밀착이 관계를 빠르게 달구며'

  const turn = has(tags, '집착', '소유욕')
    ? `${cast.hero.name}의 소유욕이 계약을 사랑으로, 사랑을 집착으로 바꾼다`
    : has(tags, '후회', '피폐')
      ? `이별과 오해 끝에 ${iga(cast.hero.name)} 무릎 꿇는 후회남으로 무너진다`
      : `몸정에서 맘정으로 기울며 두 사람은 서로를 ‘나만의 것’으로 확인한다`

  return `리디 ${RIDI_PLATFORM.rating} ${RIDI_PLATFORM.genre} · ${tone}. ${hook}. ${heat}, ${turn}. ${RIDI_PLATFORM.episodes}화 완결.`
}

type Beat = { title: string; summary: string }

function phaseBeats(
  ep: number,
  tags: string[],
  cast: Cast,
  setting: string,
  seed: number,
): Beat {
  const { heroine: f, hero: m, support: s, rival: r } = cast
  const contract = has(tags, '계약', '선결', '정략')
  const office = has(tags, '사내')
  const onenight = has(tags, '원나잇')
  const obsession = has(tags, '집착', '소유욕')
  const heat = has(tags, '고수위', '씬중심', '더티토크', '하드코어')

  // 70화 아크
  // 1-8 만남/계약/첫 수위
  // 9-20 동거·밀착·감정 균열
  // 21-32 질투·공개·중반 고조
  // 33-42 중반 고백/오해/위기
  // 43-52 이별·피폐·추적
  // 53-62 재회·진실·수위 클라이맥스
  // 63-70 화해·확정·해피엔딩

  if (ep === 1) {
    return {
      title: '첫 충돌',
      summary: `${setting}에서 ${iga(f.name)} ${m.name}과 마주친다. ${
        contract ? '계약 제안의 서막' : onenight ? '원나잇으로 이어질 기류' : '거부할 수 없는 첫인상'
      }이 깔린다.`,
    }
  }
  if (ep === 2) {
    return {
      title: contract ? '계약 조건' : '다시 얽히다',
      summary: contract
        ? `${iga(m.name)} 기간·동거·스킨십 범위까지 명시한 계약을 내민다. ${eun(f.name)} 이성적으로 수락한다.`
        : `${office ? '업무' : '우연'}이 두 사람을 다시 같은 공간에 가둔다.`,
    }
  }
  if (ep === 3) {
    return {
      title: '선 위의 긴장',
      summary: `악수·시선·말투만으로도 공기가 달아오른다. ${heat ? '더티한 암시가 대화 사이에 섞인다.' : '금기처럼 느껴지는 끌림이 시작된다.'}`,
    }
  }
  if (ep === 4) {
    return {
      title: heat ? '첫 수위' : '첫 밀착',
      summary: heat
        ? `둘만의 공간에서 첫 고수위 신이 열린다. 감정은 아직 계약/욕망의 언어로만 말한다.`
        : `${iga(m.name)} 거리를 좁히고, ${eun(f.name)} 밀려나면서도 밀어내지 못한다.`,
    }
  }
  if (ep === 5) {
    return {
      title: '아침의 규칙',
      summary: `밤이 지나도 관계는 ‘연애’가 아니다. ${eun(f.name)} 선을 다시 긋고, ${iga(m.name)} 그 선을 재미있어 한다.`,
    }
  }
  if (ep === 6) {
    return {
      title: office ? '사내의 눈' : '주변의 시선',
      summary: `${s.name}이 눈치를 채기 시작한다. ${office ? '사내 소문' : '지인들의 질문'}이 두 사람을 자극한다.`,
    }
  }
  if (ep === 7) {
    return {
      title: '질투의 예고',
      summary: `${r.name}의 등장. ${m.name}의 원래 세계가 ${f.name} 앞에 펼쳐진다.`,
    }
  }
  if (ep === 8) {
    return {
      title: obsession ? '소유 선언' : '나만의 밤',
      summary: obsession
        ? `${iga(m.name)} 처음으로 ‘내 거’라는 말을 꺼낸다. 로맨스보다 소유에 가깝다.`
        : `반복되는 밤. 몸정은 깊어지고 마음은 아직 이름을 붙이지 못한다.`,
    }
  }

  if (ep <= 12) {
    const titles = ['동거의 리듬', '약한 틈', '업무와 침대', '숨긴 과거']
    return {
      title: titles[ep - 9],
      summary: `${eun(f.name)} ${m.name}의 생활권에 끌려 들어간다. ${
        ep === 11 ? '낮의 존댓말/직함과 밤의 반말이 충돌한다.' : `${pick(['키스', '스킨십', '질투'], seed + ep)}가 일상이 된다.`
      }`,
    }
  }
  if (ep <= 16) {
    const titles = ['감정 누수', '친구의 경고', '위험한 달콤함', '계약 밖의 밤']
    return {
      title: titles[ep - 13],
      summary:
        ep === 14
          ? `${iga(s.name)} ${f.name}에게 선을 넘지 말라고 경고한다. 이미 늦었을지도 모른다.`
          : `${heat ? '수위가 한 단계 올라가고' : '밀착이 잦아지며'}, ${eun(f.name)} 자신을 설득하기 어려워진다.`,
    }
  }
  if (ep <= 20) {
    const t = ['어색한 공식 자리', '가문의 그림자', '질투 폭발', '달아오른 화해'][ep - 17]
    return {
      title: t,
      summary:
        ep === 19
          ? `${iga(m.name)} ${r.name} 앞에서 ${eul(f.name)} 노골적으로 표시한다. 소유욕이 수면 위로 오른다.`
          : `외부 압력이 둘을 붙였다 떼었다 한다. 밤의 화해가 낮의 오해를 덮는다.`,
    }
  }

  if (ep <= 24) {
    return {
      title: ['상처의 출처', '약한 남주', '여주의 선', '밀려드는 맘정'][ep - 21],
      summary:
        ep === 22
          ? `${m.name}의 과거 결핍이 드러난다. 집착의 뿌리가 단순 욕정이 아님을 암시한다.`
          : `${eun(f.name)} 몸정 너머의 감정을 인정할 뻔한다. 그러나 바로 부정한다.`,
    }
  }
  if (ep <= 28) {
    return {
      title: ['삼각의 칼', '오해의 씨앗', '침묵의 동거', '폭발 직전'][ep - 25],
      summary:
        ep === 26
          ? `${iga(r.name)} 교묘한 오해를 심는다. ${f.name}의 자존심이 먼저 다친다.`
          : `대화는 줄고 스킨십만 남는다. ${heat ? '고수위일수록 공허함이 커진다.' : '관계가 위태롭다.'}`,
    }
  }
  if (ep <= 32) {
    return {
      title: ['중반 고조', '거의 고백', '타이밍 엇갈림', '감정의 이름'][ep - 29],
      summary:
        ep === 32
          ? `${iga(f.name)} 처음으로 ‘좋아할지도 모른다’고 속마음으로 인정한다.`
          : `고백이 목까지 차오르지만, 계약·체면·상처가 말을 막는다.`,
    }
  }

  if (ep <= 36) {
    return {
      title: ['중반 고백', '미완의 답', '달콤한 착각', '균열'][ep - 33],
      summary:
        ep === 33
          ? `${iga(m.name)} 감정을 토해 낸다. 그러나 ${eun(f.name)} 그 말을 온전히 믿지 못한다.`
          : `잠시 평화. 독자는 곧 무너질 균열을 이미 본다.`,
    }
  }
  if (ep <= 42) {
    const map: Record<number, Beat> = {
      37: {
        title: '결정적 오해',
        summary: `${r.name} 또는 가족·회사 이슈로 ${iga(f.name)} ${m.name}을 ‘원래 세계로 돌아갈 사람’으로 단정한다.`,
      },
      38: {
        title: '차디찬 이성',
        summary: `${eun(f.name)} 먼저 거리를 둔다. ${obsession ? `${iga(m.name)} 집착적으로 붙잡으려 한다.` : `${iga(m.name)} 자존심 때문에 쫓지 않는다.`}`,
      },
      39: {
        title: '마지막 밤',
        summary: heat
          ? `이별 직전의 고수위 신. 욕망과 애정이 뒤섞여 더 잔인하다.`
          : `서로를 놓기 싫은 밤. 말보다 몸이 먼저 솔직하다.`,
      },
      40: {
        title: '이별 통보',
        summary: contract
          ? `${iga(f.name)} 계약 해지·조기 종료를 통보한다.`
          : `${iga(f.name)} 이별을 선언한다. ${m.name}의 표정이 무너진다.`,
      },
      41: {
        title: '빈자리',
        summary: `${eun(m.name)} 여주가 사라진 공간을 견디지 못한다. 후회가 시작된다.`,
      },
      42: {
        title: '여주의 붕괴',
        summary: `${eun(f.name)} 잘한 선택이라 되뇌면서도 무너진다. ${s.name}이 곁을 지킨다.`,
      },
    }
    return map[ep]
  }

  if (ep <= 48) {
    return {
      title: ['추적', '잠입', '자존심 붕괴', '무릎', '공개 해명', '아직 부족'][ep - 43],
      summary:
        ep === 46
          ? `${iga(m.name)} 체면을 버리고 ${f.name} 앞에 선다. 후회남의 본격 구간.`
          : `${obsession ? '집착적 추적과' : '끈질긴 설득과'} 작은 해명이 이어지지만, 신뢰는 아직 돌아오지 않는다.`,
    }
  }
  if (ep <= 52) {
    return {
      title: ['진실의 조각', '배후의 칼', '라이벌 퇴장', '남은 상처'][ep - 49],
      summary:
        ep === 50
          ? `${r.name}의 계략·오해의 전말이 드러난다.`
          : `사실이 밝혀져도 상처는 남는다. 사랑만으로는 부족한 구간.`,
    }
  }

  if (ep <= 58) {
    return {
      title: ['재회의 문', '서툰 다정', '다시 쓰는 규칙', '수위 클라이맥스', '감정의 확정', '둘만의 언어'][ep - 53],
      summary:
        ep === 56
          ? heat
            ? `재회 후 가장 높은 수위의 신. 소유와 애정이 동시에 폭발한다.`
            : `재회 후의 밀착. 이번엔 감정이 몸을 앞선다.`
          : `${gwa(f.name)} ${m.name}이 관계를 다시 정의한다. 계약이 아니라 선택으로.`,
    }
  }
  if (ep <= 64) {
    return {
      title: ['외부 최종 시험', '가문/회사 대치', '여주의 선택', '남주의 약속', '공적 인정', '사적 확인'][ep - 59],
      summary:
        ep === 61
          ? `${iga(f.name)} 도망치지 않기로 한다. 자존심이 아니라 욕망과 애정을 택한다.`
          : `마지막 외부 갈등을 넘기며 두 사람의 관계가 공적으로도 사적으로도 고정된다.`,
    }
  }

  const ending: Record<number, Beat> = {
    65: {
      title: '잔향',
      summary: `큰 갈등은 잦아들고, 일상의 다정과 ${heat ? '여전한 수위' : '밀착'}이 남는다.`,
    },
    66: {
      title: '미래의 말',
      summary: `${iga(m.name)} 결혼·동거·공개 연애 등 ‘다음’을 구체적으로 꺼낸다.`,
    },
    67: {
      title: '친구의 축복',
      summary: `${iga(s.name)} 비로소 두 사람을 인정한다. 가벼운 에피소드로 숨을 고른다.`,
    },
    68: {
      title: '방해자의 끝',
      summary: `${r.name}과의 인연이 정리된다. 더 이상 둘 사이를 흔들지 못한다.`,
    },
    69: {
      title: '마지막 밤',
      summary: heat
        ? `완결 직전 고수위 신. 집착은 남되, 이제는 서로를 믿는 집착이다.`
        : `서로를 확인하는 밤. 몸정과 맘정이 같은 방향을 본다.`,
    },
    70: {
      title: '완결—나만의 사람',
      summary: `리디 ${RIDI_PLATFORM.rating} ${RIDI_PLATFORM.genre} 완결. ${gwa(f.name)} ${m.name}은 계약·오해·이별을 지나 ‘선택’으로 남는다. HEA.`,
    },
  }
  return ending[ep]
}

function buildEpisodes(tags: string[], cast: Cast, seed: number): Episode[] {
  const setting = pick(SETTINGS, seed)
  return Array.from({ length: RIDI_PLATFORM.episodes }, (_, i) => {
    const ep = i + 1
    const beat = phaseBeats(ep, tags, cast, setting, seed)
    return {
      number: ep,
      title: `${ep}화. ${beat.title}`,
      summary: beat.summary,
    }
  })
}

export function generateStoryNote(keywordRaw: string, genreRaw: string): StoryNote {
  const keywords = parseKeywords(keywordRaw)
  const tags = keywords.length ? keywords : ['재벌남', '집착남', '계약연애/결혼', '고수위']
  const tone = (genreRaw.trim() || '고수위·씬중심') as string
  const seed = hash(`${tags.join(',')}|${tone}|${Date.now() % 100000}`)
  const cast = buildCast(tags, seed)
  const characters = [cast.heroine, cast.hero, cast.support, cast.rival]
  const title = buildTitle(tags, cast, seed)
  const logline = buildLogline(tags, cast, tone)
  const episodes = buildEpisodes(tags, cast, seed)

  return {
    title,
    logline,
    genre: `${RIDI_PLATFORM.name} · ${RIDI_PLATFORM.rating} ${RIDI_PLATFORM.genre} · ${tone}`,
    keywords: tags,
    characters,
    episodes,
  }
}
