import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'

interface InputScreenProps {
  onSubmit: (keywords: string, genre: string) => void
  exiting: boolean
}

const GENRE_SUGGESTIONS = [
  '로맨스',
  '판타지',
  '스릴러',
  '미스터리',
  'SF',
  '일상',
  '무협',
  '호러',
  '성장',
  '시대극',
]

export function InputScreen({ onSubmit, exiting }: InputScreenProps) {
  const [keywords, setKeywords] = useState('')
  const [genre, setGenre] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!keywords.trim() || !genre.trim()) return
    onSubmit(keywords.trim(), genre.trim())
  }

  return (
    <motion.section
      className="input-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1, y: exiting ? -24 : 0, filter: exiting ? 'blur(8px)' : 'blur(0px)' }}
      transition={{ duration: exiting ? 0.7 : 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="input-atmosphere" aria-hidden="true" />
      <div className="input-inner">
        <motion.p
          className="brand"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: exiting ? 0 : 1, y: exiting ? -12 : 0 }}
          transition={{ delay: exiting ? 0 : 0.15, duration: 0.7 }}
        >
          창작노트
        </motion.p>
        <motion.p
          className="brand-sub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: exiting ? 0 : 1, y: 0 }}
          transition={{ delay: exiting ? 0 : 0.28, duration: 0.7 }}
        >
          키워드와 장르로, 20화 완결 소설의 뼈대를 그립니다.
        </motion.p>

        <motion.form
          className="note-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: exiting ? 0 : 1, y: exiting ? 16 : 0 }}
          transition={{ delay: exiting ? 0 : 0.4, duration: 0.7 }}
        >
          <label className="field">
            <span>키워드</span>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="예: 기억상실, 바다, 재회"
              autoFocus
              disabled={exiting}
            />
          </label>

          <label className="field">
            <span>장르</span>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="예: 로맨스, 판타지, 스릴러…"
              list="genre-list"
              disabled={exiting}
            />
            <datalist id="genre-list">
              {GENRE_SUGGESTIONS.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
          </label>

          <div className="genre-chips" role="group" aria-label="장르 빠른 선택">
            {GENRE_SUGGESTIONS.map((g) => (
              <button
                key={g}
                type="button"
                className={genre === g ? 'chip active' : 'chip'}
                onClick={() => setGenre(g)}
                disabled={exiting}
              >
                {g}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={exiting || !keywords.trim() || !genre.trim()}
          >
            노트 생성하기
          </button>
        </motion.form>
      </div>
    </motion.section>
  )
}
