import { motion } from 'framer-motion'
import type { StoryNote } from '../types'
import { RIDI_PLATFORM } from '../lib/ridiTrends'

interface ResultScreenProps {
  note: StoryNote
  onReset: () => void
}

export function ResultScreen({ note, onReset }: ResultScreenProps) {
  return (
    <motion.section
      className="result-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="result-top">
        <button type="button" className="reset-btn" onClick={onReset}>
          ← 새로 쓰기
        </button>
        <p className="result-brand">창작노트</p>
      </header>

      <article className="result-body">
        <motion.header
          className="title-block"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          <p className="meta">
            <span>{note.genre}</span>
            <span aria-hidden="true">·</span>
            <span>{RIDI_PLATFORM.episodes}화 완결</span>
          </p>
          <h1>{note.title}</h1>
          <p className="logline">{note.logline}</p>
          <p className="keyword-cloud">
            {note.keywords.map((k) => (
              <span key={k}>#{k}</span>
            ))}
          </p>
        </motion.header>

        <motion.section
          className="section characters"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <h2>캐릭터 프로필</h2>
          <p className="section-lead">여주 · 남주 · 조력자 · 방해자</p>
          <ul className="character-list">
            {note.characters.map((c, i) => (
              <motion.li
                key={`${c.name}-${c.role}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.5 }}
              >
                <div className="char-head">
                  <strong>{c.name}</strong>
                  <span>
                    {c.role} · {c.age}세
                  </span>
                </div>
                <p>
                  <em>성격</em> {c.personality}
                </p>
                <p>
                  <em>배경</em> {c.background}
                </p>
                <p>
                  <em>목표</em> {c.goal}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          className="section episodes"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
        >
          <h2>회차별 줄거리</h2>
          <p className="section-lead">
            핵심 관통 줄거리 + 기승전결 · 1~{RIDI_PLATFORM.episodes}화
          </p>
          <ol className="episode-list">
            {note.episodes.map((ep, i) => (
              <motion.li
                key={ep.number}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(i * 0.01, 0.2), duration: 0.4 }}
              >
                <h3>{ep.title}</h3>
                <p className="ep-core">
                  <span className="ep-label">핵심</span>
                  {ep.core}
                </p>
                <dl className="ep-arc">
                  <div>
                    <dt>기</dt>
                    <dd>{ep.arc.gi}</dd>
                  </div>
                  <div>
                    <dt>승</dt>
                    <dd>{ep.arc.seung}</dd>
                  </div>
                  <div>
                    <dt>전</dt>
                    <dd>{ep.arc.jeon}</dd>
                  </div>
                  <div>
                    <dt>결</dt>
                    <dd>{ep.arc.gyeol}</dd>
                  </div>
                </dl>
              </motion.li>
            ))}
          </ol>
        </motion.section>
      </article>
    </motion.section>
  )
}
