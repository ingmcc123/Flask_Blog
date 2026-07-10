export interface Character {
  name: string
  role: string
  age: string
  personality: string
  background: string
  goal: string
}

export interface Episode {
  number: number
  title: string
  summary: string
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
