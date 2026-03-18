'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({ total: 0, panic: 0 })
  const [tipIndex, setTipIndex] = useState(0)

  const messages = {
    ok: ['They\'re definitely not okay', 'Passive-aggressive detected', 'They\'re busy', 'Upset but hiding it', 'Genuine (rare)', 'Barely reading'],
    k: ['Maximum passive-aggression', 'Furious but short', 'You\'re in trouble', '1 letter = 1% caring', 'Conversation over', 'Driving and texting'],
    fine: ['Nothing is fine', 'Holding back a rant', 'Apologize now', 'Testing you', 'Maximum sarcasm', 'Genuine (0.01% chance)'],
    sure: ['Don\'t actually want to', 'Reluctant agreement', 'Internally screaming', 'Forgot and playing along', 'Check for fever', 'Complaining later'],
    lol: ['Didn\'t actually laugh', 'Awkward filler', 'No idea how to respond', 'Pity laugh', 'Ending conversation', 'Genuine (rare)'],
    haha: ['Fake laugh', 'Not amused', 'Life support', 'Already gone', 'Sympathy laugh', 'Maybe smiling'],
    yeah: ['Unenthusiastic', 'Distracted', 'Minimal effort', 'Don\'t care', 'Auto-pilot', 'Casual agreement'],
    whatever: ['Given up', 'Maximum frustration', 'Officially annoyed', 'Done arguing', 'Emotional shutdown', 'Don\'t care anymore'],
    nice: ['Probably sarcastic', 'Won\'t show it', 'Zero enthusiasm', 'Hiding jealousy', 'Check context', 'Filler word'],
    cool: ['Not impressed', 'Bare minimum', 'Doing something else', 'Polite disinterest', 'Forgot already', 'Actually cool (rare)'],
    wow: ['Sarcasm detected', 'Genuinely surprised', 'Passive-aggressive', 'No words (bad)', 'Won\'t admit it', 'Buying time'],
    nothing: ['Definitely something', 'Want you to ask', 'Emotional trap', 'Won\'t say it', 'Testing you', 'Literally nothing (1%)'],
    idk: ['Know but won\'t say', 'Avoiding responsibility', 'Genuinely don\'t know', 'Won\'t decide', 'You decide', 'Escape route'],
    maybe: ['Soft no', 'Keeping options open', 'Commitment-phobic', 'Polite rejection', 'Need more info', 'Genuine uncertainty']
  }

  const levels = [
    { text: 'Calm', emoji: '😌', color: '#4ecdc4' },
    { text: 'Slightly Concerned', emoji: '🤔', color: '#ffd93d' },
    { text: 'Overthinking', emoji: '😬', color: '#ff9a3c' },
    { text: 'Panic Mode', emoji: '😱', color: '#ff6b6b' }
  ]

  const tips = [
    "💡 Short messages aren't always bad!",
    "💡 Context matters more than words",
    "💡 Sometimes 'ok' just means ok",
    "💡 Not everything needs analysis",
    "💡 Trust your gut, not overthinking"
  ]

  useEffect(() => {
    const timer = setInterval(() => setTipIndex(i => (i + 1) % tips.length), 8000)
    return () => clearInterval(timer)
  }, [])

  const generateInterpretations = (msg) => {
    const checks = {
      exclaim: msg.includes('!'),
      question: msg.includes('?'),
      ellipsis: msg.includes('...'),
      caps: msg === msg.toUpperCase() && msg !== msg.toLowerCase(),
      emoji: /[\u{1F300}-\u{1F9FF}]/u.test(msg),
      oneWord: msg.trim().split(/\s+/).length === 1,
      long: msg.trim().split(/\s+/).length > 5,
      noPunct: !/[.,!?;:]/.test(msg) && msg.trim().split(/\s+/).length > 1
    }

    const interps = []
    if (checks.exclaim) interps.push(`"${msg}" could mean excitement... or sarcasm`, `Either happy or angry about "${msg}"`)
    if (checks.question) interps.push(`"${msg}" - genuine or rhetorical?`, `Testing if you're paying attention`)
    if (checks.ellipsis) interps.push(`Dots in "${msg}" mean holding back`, `More they're not saying`)
    if (checks.caps) interps.push(`ALL CAPS "${msg}" = yelling or stuck caps`, `Intensity is concerning`)
    if (checks.emoji) interps.push(`Emoji masking true feelings`, `Softening harsh message?`)
    if (checks.oneWord) interps.push(`One word = minimal effort`, `Couldn't spare more words?`)
    if (checks.long) interps.push(`"${msg}" suspiciously detailed`, `They're overthinking too`)
    if (checks.noPunct) interps.push(`No punctuation = casual or rushed`, `They're distracted`)

    interps.push(`"${msg}" means what it says (unlikely)`, `Timing is suspicious`, `Definitely thinking something else`, `Anyone's guess really`)

    return [...new Set(interps)].sort(() => Math.random() - 0.5).slice(0, 4)
  }

  const analyze = () => {
    if (!message.trim()) return
    setIsAnalyzing(true)

    setTimeout(() => {
      const lower = message.toLowerCase().trim()
      const matched = Object.keys(messages).find(k => lower === k || lower.includes(k))

      let interps, levelIdx
      if (matched) {
        interps = [...messages[matched]].sort(() => Math.random() - 0.5).slice(0, 4)
        levelIdx = matched === 'fine' || matched === 'k' || matched === 'whatever' ? 3 : matched === 'ok' || matched === 'sure' || matched === 'nothing' || matched === 'maybe' ? 2 : 1
      } else {
        interps = generateInterpretations(message)
        const caps = message === message.toUpperCase() && message !== message.toLowerCase()
        const ellipsis = message.includes('...')
        const exclaim = message.includes('!')
        const oneWord = message.trim().split(/\s+/).length === 1
        levelIdx = caps || ellipsis ? 3 : exclaim || oneWord ? 2 : 1
      }

      levelIdx = Math.min(levelIdx + (Math.random() > 0.7 ? 1 : 0), 3)
      const level = levels[levelIdx]

      setResult({ interpretations: interps, level })
      setHistory(prev => [{ message, level: level.text }, ...prev.slice(0, 4)])
      setStats(prev => ({ total: prev.total + 1, panic: prev.panic + (levelIdx === 3 ? 1 : 0) }))
      setIsAnalyzing(false)
    }, 1500)
  }

  const advice = {
    'Panic Mode': 'Take a deep breath. It\'s probably fine. Maybe.',
    'Overthinking': 'You\'re reading too much into this. Or are you?',
    'Slightly Concerned': 'A healthy amount of analysis. Keep it balanced!',
    'Calm': 'You\'re zen. Teach us your ways!'
  }

  return (
    <main>
      <div className="container">
        <div className="header-section">
          <h1>🧠 Overthinking Message Analyzer</h1>
          <p className="description">
            Ever received a short message and spent the next hour analyzing it? 
            You're not alone. Let's scientifically measure your overthinking level!
          </p>
        </div>

        <div className="tip-banner">{tips[tipIndex]}</div>

        {stats.total > 0 && (
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-label">Total Analyses:</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Panic Modes:</span>
              <span className="stat-value panic">{stats.panic}</span>
            </div>
          </div>
        )}

        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder='Type a message like "ok", "fine"...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isAnalyzing && analyze()}  // ✅ FIXED
              disabled={isAnalyzing}
              maxLength={100}
            />
            <span className="char-counter">{message.length}/100</span>
          </div>

          <button 
            onClick={analyze} 
            disabled={isAnalyzing || !message.trim()} 
            className={isAnalyzing ? 'analyzing' : ''}
          >
            {isAnalyzing 
              ? <><span className="spinner"></span> Analyzing...</> 
              : '🔍 Analyze'}
          </button>
        </div>

        {result && (
          <div className="result-card">
            <div className="ai-character-header">
              <div className="character-avatar-large">
                <div className="avatar-circle">
                  <span className="robot-face">🤖</span>
                  <div className="pulse-ring"></div>
                </div>
              </div>
              <div className="character-details">
                <h2>Dr. Overthink AI</h2>
                <p className="character-subtitle">Advanced Message Analysis System</p>
                <span className="status-badge">● Online & Analyzing</span>
              </div>
            </div>

            <div className="ai-message-box">
              <div className="ai-says">
                <span className="ai-label">🤖 AI Analysis:</span>
                <p className="ai-speech">I've analyzed your message <strong>"{message}"</strong> and here's what I found...</p>
              </div>
            </div>

            <div className="interpretations">
              <h3>🧠 My Interpretations:</h3>
              <ul>
                {result.interpretations.map((interp, i) => (
                  <li key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className="ai-bullet">🤖</span>
                    <span className="interp-text">{interp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="level">
              <h3>📊 Overthinking Level Detected:</h3>
              <div className="level-badge" style={{ borderColor: result.level.color }}>
                <span className="level-emoji">{result.level.emoji}</span>
                <span className="level-text" style={{ color: result.level.color }}>{result.level.text}</span>
              </div>
            </div>

            <div className="ai-advice-box">
              <div className="ai-avatar-circle">🤖</div>
              <div className="advice-content">
                <strong>Dr. Overthink's Advice:</strong>
                <p>{advice[result.level.text]}</p>
              </div>
            </div>

            <button 
              onClick={() => { setMessage(''); setResult(null); }} 
              className="reset-btn"
            >
              🔄 Try Another Message
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <div className="history-header">
              <h3>📜 Recent Analyses</h3>
              <button 
                onClick={() => { setHistory([]); setStats({ total: 0, panic: 0 }); }} 
                className="clear-btn"
              >
                Clear
              </button>
            </div>
            <div className="history-list">
              {history.map((item, i) => (
                <div key={i} className="history-item">
                  <span className="history-message">"{item.message}"</span>
                  <span className="history-level">{item.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="footer">
          <p>⚠️ Disclaimer: This is a satirical tool. No actual AI or psychology involved—just pure overthinking simulation!</p>
        </div>
      </div>
    </main>
  )
}