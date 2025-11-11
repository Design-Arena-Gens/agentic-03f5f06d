'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './page.module.css'

interface Message {
  role: 'user' | 'agent'
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'agent',
      content: 'Hello! I\'m your AI agent. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500))

    const responses = [
      `I understand you're asking about "${userMessage}". Let me help you with that.`,
      `That's an interesting question about "${userMessage}". Based on my analysis, I can provide several insights.`,
      `I've processed your request regarding "${userMessage}". Here's what I found.`,
      `Thank you for your query. Regarding "${userMessage}", I can assist you with detailed information.`,
      `I'm analyzing "${userMessage}" for you. This involves several key considerations.`,
    ]

    const taskResponses = [
      'I can help you break this down into manageable steps.',
      'I\'ll need to gather some information first, then we can proceed.',
      'This is something I can definitely help with. Let me walk you through it.',
      'I\'ve completed the analysis. Here are my recommendations.',
      'Based on current best practices, here\'s what I suggest.',
    ]

    const mainResponse = responses[Math.floor(Math.random() * responses.length)]
    const taskResponse = taskResponses[Math.floor(Math.random() * taskResponses.length)]

    return `${mainResponse}\n\n${taskResponse}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    const response = await generateResponse(userMessage.content)

    const agentMessage: Message = {
      role: 'agent',
      content: response,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, agentMessage])
    setIsThinking(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatWindow}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.statusIndicator}></div>
            <h1>AI Agent</h1>
          </div>
          <p className={styles.subtitle}>Intelligent Assistant</p>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.role === 'user' ? styles.userMessage : styles.agentMessage
              }`}
            >
              <div className={styles.messageHeader}>
                <span className={styles.messageRole}>
                  {message.role === 'user' ? '👤 You' : '🤖 Agent'}
                </span>
                <span className={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className={styles.messageContent}>
                {message.content}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className={`${styles.message} ${styles.agentMessage}`}>
              <div className={styles.messageHeader}>
                <span className={styles.messageRole}>🤖 Agent</span>
              </div>
              <div className={styles.messageContent}>
                <div className={styles.thinkingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className={styles.input}
            disabled={isThinking}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!input.trim() || isThinking}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
