import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { InputScreen } from './components/InputScreen'
import { LoadingScreen } from './components/LoadingScreen'
import { ResultScreen } from './components/ResultScreen'
import { generateStoryNote } from './lib/storyGenerator'
import type { AppPhase, StoryNote } from './types'
import './App.css'

function App() {
  const [phase, setPhase] = useState<AppPhase>('input')
  const [note, setNote] = useState<StoryNote | null>(null)

  function handleSubmit(keywords: string, genre: string) {
    setPhase('exiting')
    window.setTimeout(() => {
      setPhase('generating')
      window.setTimeout(() => {
        const generated = generateStoryNote(keywords, genre)
        setNote(generated)
        setPhase('result')
      }, 2800)
    }, 750)
  }

  function handleReset() {
    setNote(null)
    setPhase('input')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <AnimatePresence mode="wait">
        {(phase === 'input' || phase === 'exiting') && (
          <InputScreen
            key="input"
            onSubmit={handleSubmit}
            exiting={phase === 'exiting'}
          />
        )}
        {phase === 'generating' && <LoadingScreen key="loading" />}
        {phase === 'result' && note && (
          <ResultScreen key="result" note={note} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
