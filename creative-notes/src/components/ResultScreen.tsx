import { motion } from 'framer-motion'
import type { StoryNote } from '../types'

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
            <span>{note.keywords.join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span>16화 완결</span>
          </p>
          <h1>{note.title}</h1>
          <p className="logline">{note.logline}</p>
        </motion.header>

        <motion.section
          className="section characters"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <h2>캐릭터 프로필</h2>
          <p className="section-lead">이야기의 축이 되는 네 인물</p>
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
          <p className="section-lead">1화부터 16화까지, 완결을 향한 흐름</p>
          <ol className="episode-list">
            {note.episodes.map((ep, i) => (
              <motion.li
                key={ep.number}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.45 }}
              >
                <h3>{ep.title}</h3>
                <p>{ep.summary}</p>
              </motion.li>
            ))}
          </ol>
        </motion.section>
      </article>
    </motion.section>
  )
}
