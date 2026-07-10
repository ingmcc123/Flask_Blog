import { motion } from 'framer-motion'
import { RIDI_PLATFORM } from '../lib/ridiTrends'

const LINES = [
  '리디형 제목을 고르는 중…',
  '19금 로그라인을 다듬는 중…',
  '남주·여주 프로필을 잡는 중…',
  `${RIDI_PLATFORM.episodes}화 물길을 그리는 중…`,
]

export function LoadingScreen() {
  return (
    <motion.section
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="ink-bloom" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <motion.p
        className="loading-brand"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        창작노트
      </motion.p>
      <p className="loading-meta">
        {RIDI_PLATFORM.name} · {RIDI_PLATFORM.rating} {RIDI_PLATFORM.genre}
      </p>
      <ul className="loading-lines">
        {LINES.map((line, i) => (
          <motion.li
            key={line}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.45, duration: 0.5 }}
          >
            {line}
          </motion.li>
        ))}
      </ul>
    </motion.section>
  )
}
