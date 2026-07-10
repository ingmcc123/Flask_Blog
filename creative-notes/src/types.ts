export interface Character {
  name: string
  role: string
  age: string
  personality: string
  background: string
  goal: string
}

/** 회차 기승전결 */
export interface EpisodeArc {
  gi: string
  seung: string
  jeon: string
  gyeol: string
}

export interface Episode {
  number: number
  title: string
  /** 회차 전체를 관통하는 핵심 줄거리 */
  core: string
  /** 기승전결 간결 줄거리 */
  arc: EpisodeArc
}

export interface StoryNote {
  title: string
  logline: string
  genre: string
  keywords: string[]
  characters: Character[]
  episodes: Episode[]
}

export type AppPhase = 'input' | 'exiting' | 'generating' | 'result'
