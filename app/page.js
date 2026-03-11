'use client'
import { useState } from 'react'

export default function Home() {
  // State management for user input and results
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [history, setHistory] = useState([])

  // Database of real messages with their interpretations
  // Each message has unique interpretations based on how people actually use them
  const messageDatabase = {
    'ok': {
      interpretations: [
        'They\'re definitely not okay with this',
        'Passive-aggressive agreement detected',
        'They\'re busy and can\'t talk right now',
        'They\'re upset but don\'t want to argue',
        'Genuine agreement (rare case)',
        'They\'re multitasking and barely reading'
      ],
      defaultLevel: 2
    },
    'k': {
      interpretations: [
        'Maximum passive-aggressiveness achieved',
        'They\'re furious but keeping it short',
        'You\'re in trouble and don\'t even know it',
        'They saved 1 letter = they saved 1% of caring',
        'Conversation officially over',
        'They\'re driving and shouldn\'t be texting'
      ],
      defaultLevel: 3
    },
    'fine': {
      interpretations: [
        'Nothing is fine. Everything is on fire.',
        'They\'re holding back a 10-paragraph rant',
        'You should probably apologize (for something)',
        'They\'re testing if you\'ll dig deeper',
        'Sarcasm level: Maximum',
        'They genuinely mean it (0.01% chance)'
      ],
      defaultLevel: 3
    },
    'sure': {
      interpretations: [
        'They don\'t actually want to do this',
        'Reluctant agreement with hidden resentment',
        'They\'re being polite but internally screaming',
        'They forgot what you asked and are playing along',
        'Genuine enthusiasm (check for fever)',
        'They\'re saying yes now, complaining later'
      ],
      defaultLevel: 2
    },
    'lol': {
      interpretations: [
        'They didn\'t actually laugh',
        'Awkward conversation filler',
        'They have no idea how to respond',
        'Pity laugh in text form',
        'They\'re ending this conversation politely',
        'Genuine amusement (rare specimen)'
      ],
      defaultLevel: 1
    },
    'haha': {
      interpretations: [
        'Fake laugh, real awkwardness',
        'They\'re being polite but not amused',
        'Conversation life support activated',
        'They laughed 0.2 seconds ago, now it\'s gone',
        'Sympathy laugh detected',
        'They\'re actually smiling (maybe)'
      ],
      defaultLevel: 1
    },
    'yeah': {
      interpretations: [
        'Unenthusiastic agreement',
        'They\'re distracted by something better',
        'Minimal effort response unlocked',
        'They agree but don\'t care',
        'Auto-pilot mode engaged',
        'Genuine casual agreement'
      ],
      defaultLevel: 1
    },
    'whatever': {
      interpretations: [
        'They\'ve given up on this conversation',
        'Maximum frustration in one word',
        'You\'ve officially annoyed them',
        'They\'re done arguing (you didn\'t win)',
        'Emotional shutdown initiated',
        'They literally don\'t care anymore'
      ],
      defaultLevel: 3
    },
    'nice': {
      interpretations: [
        'Could be sarcastic, probably is',
        'They\'re impressed but won\'t show it',
        'Polite acknowledgment, zero enthusiasm',
        'They\'re jealous and hiding it',
        'Genuine compliment (check context)',
        'Conversation filler word'
      ],
      defaultLevel: 1
    },
    'cool': {
      interpretations: [
        'They\'re not impressed at all',
        'Bare minimum acknowledgment',
        'They\'re doing something else',
        'Polite disinterest',
        'They forgot what you said',
        'Actually thinks it\'s cool (rare)'
      ],
      defaultLevel: 1
    },
    'wow': {
      interpretations: [
        'Sarcasm detected',
        'They\'re genuinely surprised',
        'Passive-aggressive amazement',
        'They have no words (bad sign)',
        'Impressed but won\'t admit it',
        'Buying time to think of a response'
      ],
      defaultLevel: 1
    },
    'nothing': {
      interpretations: [
        'Definitely something, probably big',
        'They want you to ask again',
        'Emotional trap activated',
        'Everything is wrong but they won\'t say',
        'Testing if you actually care',
        'Literally nothing (1% chance)'
      ],
      defaultLevel: 2
    },
    'idk': {
      interpretations: [
        'They know, but don\'t want to say',
        'Avoiding responsibility',
        'They genuinely don\'t know',
        'Don\'t want to make the decision',
        'Passive way of saying "you decide"',
        'Conversation escape route'
      ],
      defaultLevel: 1
    },
    'maybe': {
      interpretations: [
        'Soft no disguised as possibility',
        'They\'re keeping options open (not you)',
        'Commitment-phobic response',
        'Polite rejection incoming',
        'They need more information',
        'Genuine uncertainty'
      ],
      defaultLevel: 2
    }
  }

  // Overthinking levels with emojis
  // Level 0 = Calm, Level 3 = Panic Mode
  const levels = [
    { text: 'Calm', emoji: '😌' },
    { text: 'Slightly Concerned', emoji: '🤔' },
    { text: 'Overthinking', emoji: '😬' },
    { text: 'Panic Mode', emoji: '😱' }
  ]

  // Main analysis function - triggered when user clicks analyze
  const analyze = () => {
    // Don't analyze empty messages
    if (!message.trim()) return
    
    // Show loading state
    setIsAnalyzing(true)
    
    // Simulate analysis delay for dramatic effect (1.5 seconds)
    setTimeout(() => {
      const lowerMessage = message.toLowerCase().trim()
      let selectedInterpretations = []
      let levelIndex = 0

      // Check if the message matches any known patterns
      const matchedPattern = Object.keys(messageDatabase).find(key => 
        lowerMessage === key || lowerMessage.includes(key)
      )

      if (matchedPattern) {
        // Message found in database - use specific interpretations
        const data = messageDatabase[matchedPattern]
        // Shuffle interpretations and pick 4 random ones
        const shuffled = [...data.interpretations].sort(() => Math.random() - 0.5)
        selectedInterpretations = shuffled.slice(0, 4)
        levelIndex = data.defaultLevel
      } else {
        // Unknown message - use generic interpretations
        const genericInterpretations = [
          'They\'re being cryptic on purpose',
          'Hidden meaning detected',
          'They expect you to read between the lines',
          'Tone is impossible to determine',
          'Could mean literally anything',
          'Context is everything (and you have none)',
          'They\'re testing your interpretation skills',
          'Ambiguity level: Maximum'
        ]
        const shuffled = [...genericInterpretations].sort(() => Math.random() - 0.5)
        selectedInterpretations = shuffled.slice(0, 4)
        levelIndex = Math.floor(Math.random() * levels.length)
      }

      // Add some randomness to the level (30% chance to increase by 1)
      levelIndex = Math.min(Math.max(levelIndex + (Math.random() > 0.7 ? 1 : 0), 0), 3)
      
      const level = levels[levelIndex]
      
      // Store the result
      setResult({ 
        interpretations: selectedInterpretations, 
        level
      })
      
      // Add to history (keep only last 5 analyses)
      setHistory(prev => [{
        message,
        level: level.text
      }, ...prev.slice(0, 4)])
      
      // Hide loading state
      setIsAnalyzing(false)
    }, 1500)
  }

  // Reset function - clear everything and start fresh
  const reset = () => {
    setMessage('')
    setResult(null)
  }

  // Quick example messages for users to try
  const examples = ['ok', 'fine', 'k', 'sure', 'whatever', 'lol']

  return (
    <main>
      <div className="container">
        {/* Header Section */}
        <div className="header-section">
          <h1> Overthinking Message Analyzer</h1>
          <p className="description">
            Ever received a short message and spent the next hour analyzing it? 
            You're not alone. Let's scientifically measure your overthinking level!
          </p>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <input
            type="text"
            placeholder='Enter a message (e.g., "ok", "fine", "sure")'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isAnalyzing && analyze()}
            disabled={isAnalyzing}
          />
          <button 
            onClick={analyze} 
            disabled={isAnalyzing || !message.trim()}
            className={isAnalyzing ? 'analyzing' : ''}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              'Analyze Message'
            )}
          </button>
        </div>

        {/* Example Messages Section */}
        <div className="examples">
          <p>Try these examples:</p>
          <div className="example-buttons">
            {examples.map((example, i) => (
              <button 
                key={i} 
                onClick={() => setMessage(example)}
                className="example-btn"
                disabled={isAnalyzing}
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        {/* Results Section - Only shown after analysis */}
        {result && (
          <div className="result-card">
            {/* Header with title */}
            <div className="result-header">
              <h2>Analysis Complete</h2>
            </div>
            
            {/* Display the message that was analyzed */}
            <div className="message-display">
              <strong>Message Received:</strong> 
              <span className="message-text">"{message}"</span>
            </div>
            
            {/* List of possible interpretations */}
            <div className="interpretations">
              <h3>Possible Interpretations:</h3>
              <ul>
                {result.interpretations.map((interp, i) => (
                  <li key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className="bullet">•</span>
                    {interp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Overthinking level badge */}
            <div className="level">
              <h3> Overthinking Level:</h3>
              <div className="level-badge">
                <span className="level-emoji">{result.level.emoji}</span>
                <span className="level-text">{result.level.text}</span>
              </div>
            </div>

            {/* Contextual advice based on overthinking level */}
            <div className="advice">
              <p> <strong>Pro Tip:</strong> {
                result.level.text === 'Panic Mode' 
                  ? 'Take a deep breath. It\'s probably fine. Maybe.'
                  : result.level.text === 'Overthinking'
                  ? 'You\'re reading too much into this. Or are you?'
                  : result.level.text === 'Slightly Concerned'
                  ? 'A healthy amount of analysis. Keep it balanced!'
                  : 'You\'re zen. Teach us your ways!'
              }</p>
            </div>

            {/* Reset button to analyze another message */}
            <button onClick={reset} className="reset-btn">
              Analyze Another Message
            </button>
          </div>
        )}

        {/* History Section - Shows last 5 analyses */}
        {history.length > 0 && (
          <div className="history-section">
            <h3> Recent Analyses</h3>
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

        {/* Footer with disclaimer */}
        <div className="footer">
          <p>⚠️ Disclaimer: This is a satirical tool. No actual AI or psychology involved—just pure overthinking simulation!</p>
        </div>
      </div>
    </main>
  )
}
