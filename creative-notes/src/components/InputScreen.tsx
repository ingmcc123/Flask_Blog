import { useMemo, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import {
  KEYWORD_GROUPS,
  KEYWORD_PRESETS,
  RIDI_PLATFORM,
  TONE_OPTIONS,
} from '../lib/ridiTrends'

interface InputScreenProps {
  onSubmit: (keywords: string, genre: string) => void
  exiting: boolean
}

export function InputScreen({ onSubmit, exiting }: InputScreenProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [custom, setCustom] = useState('')
  const [tone, setTone] = useState<string>(TONE_OPTIONS[0])
  const [openGroup, setOpenGroup] = useState<string>(KEYWORD_GROUPS[0].id)

  const keywordString = useMemo(() => {
    const fromCustom = custom
      .split(/[,，、/\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    return Array.from(new Set([...selected, ...fromCustom]))
  }, [selected, custom])

  function toggleTag(tag: string) {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  function applyPreset(tags: string[], presetTone: string) {
    setSelected(tags)
    setTone(presetTone)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!keywordString.length || !tone.trim()) return
    onSubmit(keywordString.join(', '), tone.trim())
  }

  return (
    <motion.section
      className="input-screen"
      initial={{ opacity: 0 }}
      animate={{
        opacity: exiting ? 0 : 1,
        y: exiting ? -24 : 0,
        filter: exiting ? 'blur(8px)' : 'blur(0px)',
      }}
      transition={{ duration: exiting ? 0.7 : 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="input-atmosphere" aria-hidden="true" />
      <div className="input-inner input-inner-wide">
        <motion.p
          className="platform-badge"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: exiting ? 0 : 1, y: 0 }}
          transition={{ delay: exiting ? 0 : 0.08, duration: 0.6 }}
        >
          {RIDI_PLATFORM.name} · {RIDI_PLATFORM.rating} {RIDI_PLATFORM.genre}
        </motion.p>
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
          리디 키워드 트렌드를 반영해 제목·로그라인·캐릭터·{RIDI_PLATFORM.episodes}화
          완결 줄거리를 만듭니다.
        </motion.p>

        <motion.form
          className="note-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: exiting ? 0 : 1, y: exiting ? 16 : 0 }}
          transition={{ delay: exiting ? 0 : 0.4, duration: 0.7 }}
        >
          <div className="field">
            <span>트렌드 프리셋</span>
            <div className="preset-row">
              {KEYWORD_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className="preset-btn"
                  disabled={exiting}
                  onClick={() => applyPreset(p.tags, p.tone)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span>추천 키워드</span>
            <p className="field-hint">
              리디 로맨스 키워드파인더·인기작 태그 기준으로 묶었습니다. 눌러서 고르세요.
            </p>
            <div className="group-tabs" role="tablist">
              {KEYWORD_GROUPS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={openGroup === g.id}
                  className={openGroup === g.id ? 'chip active' : 'chip'}
                  disabled={exiting}
                  onClick={() => setOpenGroup(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            {KEYWORD_GROUPS.filter((g) => g.id === openGroup).map((g) => (
              <div key={g.id} className="tag-panel">
                <p className="field-hint">{g.hint}</p>
                <div className="genre-chips">
                  {g.tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={selected.includes(tag) ? 'chip active' : 'chip'}
                      disabled={exiting}
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <label className="field">
            <span>추가 키워드 (직접 입력)</span>
            {selected.length > 0 && (
              <div className="genre-chips selected-preview">
                {selected.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="chip active"
                    disabled={exiting}
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag} ×
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="예: 임신계약, 존댓말 집착, 야근 후…"
              disabled={exiting}
            />
            <p className="selected-count">
              총 {keywordString.length}개 키워드로 생성됩니다
            </p>
          </label>

          <div className="field">
            <span>톤 · 결</span>
            <div className="genre-chips" role="group" aria-label="톤 선택">
              {TONE_OPTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={tone === t ? 'chip active' : 'chip'}
                  disabled={exiting}
                  onClick={() => setTone(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={exiting || keywordString.length === 0 || !tone.trim()}
          >
            {RIDI_PLATFORM.episodes}화 노트 생성하기
          </button>
        </motion.form>
      </div>
    </motion.section>
  )
}
