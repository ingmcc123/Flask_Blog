import { motion } from 'framer-motion'

const LINES = [
  '제목을 고르는 중…',
  '로그라인을 다듬는 중…',
  '인물의 윤곽을 잡는 중…',
  '20화의 물길을 그리는 중…',
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
