import { Component, StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { motion, motionEase } from './constants/motion'

const MotionSystem = () => {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--motion-fast', `${motion.fast}s`)
    root.style.setProperty('--motion-medium', `${motion.medium}s`)
    root.style.setProperty('--motion-slow', `${motion.slow}s`)
    root.style.setProperty('--motion-ease', motionEase)
  }, [])

  return null
}

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' }
  }

  componentDidCatch(error, info) {
    console.error('App render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100svh',
            display: 'grid',
            placeItems: 'center',
            padding: 24,
            background: '#090d1f',
            color: '#f4f7ff',
            fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
            textAlign: 'center',
          }}
        >
          <div>
            <h1 style={{ marginBottom: 8, fontSize: 20 }}>App failed to load</h1>
            <p style={{ opacity: 0.8, fontSize: 14, margin: 0 }}>{this.state.message}</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionSystem />
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
)
