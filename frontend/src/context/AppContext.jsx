import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

// Fixed goals
export const FIXED_GOALS = [
  { id: 1, name: 'Read 10 minutes', type: 'minutes', target: 10 },
  { id: 2, name: 'Read 20 pages', type: 'pages', target: 20 },
  { id: 3, name: 'Start 1 new book', type: 'books_started', target: 1 },
  { id: 4, name: 'Finish 1 book', type: 'books_finished', target: 1 },
]

// Available animals
export const ANIMALS = [
  { id: 'lion', name: 'Lion', emoji: '🦁' },
  { id: 'panda', name: 'Panda', emoji: '🐼' },
  { id: 'toucan', name: 'Toucan', emoji: '🦜' },
  { id: 'penguin', name: 'Penguin', emoji: '🐧' },
  { id: 'seal', name: 'Seal', emoji: '🦭' },
  { id: 'wolf', name: 'Wolf', emoji: '🐺' },
  { id: 'dog', name: 'Dog', emoji: '🐕' },
]

// Shop items with unlock requirements
export const SHOP_ITEMS = {
  accessories: [
    { id: 'hat_fedora', name: 'Fedora Hat', emoji: '🎩', unlockGoals: 0 },
    { id: 'hat_cap', name: 'Baseball Cap', emoji: '🧢', unlockGoals: 3 },
    { id: 'glasses', name: 'Glasses', emoji: '👓', unlockGoals: 5 },
    { id: 'backpack', name: 'Backpack', emoji: '🎒', unlockGoals: 1 },
    { id: 'scarf', name: 'Scarf', emoji: '🧣', unlockGoals: 8 },
  ],
  backgrounds: [
    { id: 'bg_default', name: 'Default', emoji: '⚪', unlockGoals: 0 },
    { id: 'bg_forest', name: 'Forest', emoji: '🌲', unlockGoals: 3 },
    { id: 'bg_beach', name: 'Beach', emoji: '🏖', unlockGoals: 6 },
    { id: 'bg_space', name: 'Space', emoji: '🌌', unlockGoals: 12 },
    { id: 'bg_library', name: 'Library', emoji: '📚', unlockGoals: 10 },
  ],
}

// Mock friends data
export const MOCK_FRIENDS = [
  { 
    id: 1, 
    name: 'Angelique', 
    goalsCompleted: 30, 
    animal: 'seal',
    currentStreak: 45,
    totalMinutes: 15234,
    booksFinished: 8,
    currentReading: 'The Great Gatsby'
  },
  { 
    id: 2, 
    name: 'Mark', 
    goalsCompleted: 20, 
    animal: 'panda',
    currentStreak: 28,
    totalMinutes: 9876,
    booksFinished: 5,
    currentReading: '1984'
  },
  { 
    id: 3, 
    name: 'John', 
    goalsCompleted: 15, 
    animal: 'toucan',
    currentStreak: 12,
    totalMinutes: 6543,
    booksFinished: 3,
    currentReading: 'To Kill a Mockingbird'
  },
  { 
    id: 4, 
    name: 'Kelly', 
    goalsCompleted: 13, 
    animal: 'penguin',
    currentStreak: 9,
    totalMinutes: 4321,
    booksFinished: 2,
    currentReading: 'Pride and Prejudice'
  },
]

// Map a database row (snake_case) to the frontend log format (camelCase)
const mapLog = (row) => ({
  id: row.id,
  bookTitle: row.book_title,
  minutes: row.minutes_read,
  pages: row.pages_read,
  date: row.date,
  finished: row.finished,
})

export const AppProvider = ({ children }) => {
  const [readingLogs, setReadingLogs] = useState([])

  // Fetch reading logs from the backend API on mount
  useEffect(() => {
    axios.get('/api/reading-logs')
      .then(res => setReadingLogs(res.data.map(mapLog)))
      .catch(err => console.error('Failed to fetch reading logs:', err))
  }, [])

  const [avatar, setAvatar] = useState(() => {
    const saved = localStorage.getItem('avatar')
    return saved ? JSON.parse(saved) : {
      animal: 'lion',
      accessories: [],
      background: 'bg_default',
    }
  })

  const [currentStreak, setCurrentStreak] = useState(() => {
    const saved = localStorage.getItem('currentStreak')
    return saved ? parseInt(saved) : 7
  })

  // Calculate stats from reading logs
  const totalMinutes = readingLogs.reduce((sum, log) => sum + (log.minutes || 0), 0)
  const totalPages = readingLogs.reduce((sum, log) => sum + (log.pages || 0), 0)
  const booksStarted = new Set(readingLogs.map(log => log.bookTitle).filter(Boolean)).size
  const booksFinished = readingLogs.filter(log => log.finished).length

  // Calculate goal progress
  const goalProgress = FIXED_GOALS.map(goal => {
    let current = 0
    if (goal.type === 'minutes') {
      current = totalMinutes
    } else if (goal.type === 'pages') {
      current = totalPages
    } else if (goal.type === 'books_started') {
      current = booksStarted
    } else if (goal.type === 'books_finished') {
      current = booksFinished
    }
    return {
      ...goal,
      current: Math.min(current, goal.target),
      completed: current >= goal.target,
    }
  })

  const goalsCompleted = goalProgress.filter(g => g.completed).length

  const mostRecentBook = readingLogs.length > 0 
    ? readingLogs[readingLogs.length - 1].bookTitle 
    : null

  // Get current reading book (most recent book that hasn't been finished, or most recent book)
  const currentReading = readingLogs.length > 0
    ? (() => {
        // Find the most recent book that isn't marked as finished
        const unfinishedBooks = readingLogs.filter(log => !log.finished && log.bookTitle)
        if (unfinishedBooks.length > 0) {
          // Get the most recent unfinished book
          return unfinishedBooks[unfinishedBooks.length - 1].bookTitle
        }
        // If all books are finished, return the most recent book
        return mostRecentBook
      })()
    : null

  const addReadingLog = async (log) => {
    const res = await axios.post('/api/reading-logs', log)
    const newLog = mapLog(res.data)
    setReadingLogs(prev => {
      const updatedLogs = [...prev, newLog]

      // Update streak: if logged today and yesterday, increment
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const loggedToday = updatedLogs.some(l => l.date === today)
      const loggedYesterday = updatedLogs.some(l => l.date === yesterday)

      if (loggedToday && loggedYesterday) {
        setCurrentStreak(prev => {
          const newStreak = prev + 1
          localStorage.setItem('currentStreak', newStreak.toString())
          return newStreak
        })
      }

      return updatedLogs
    })
  }

  const updateAvatar = (updates) => {
    const newAvatar = { ...avatar, ...updates }
    setAvatar(newAvatar)
    localStorage.setItem('avatar', JSON.stringify(newAvatar))
  }

  const toggleAccessory = (accessoryId) => {
    const currentAccessories = avatar.accessories || []
    const newAccessories = currentAccessories.includes(accessoryId)
      ? currentAccessories.filter(id => id !== accessoryId)
      : [...currentAccessories, accessoryId]
    updateAvatar({ accessories: newAccessories })
  }

  const setBackground = (backgroundId) => {
    updateAvatar({ background: backgroundId })
  }

  const setAnimal = (animalId) => {
    updateAvatar({ animal: animalId })
  }

  const value = {
    readingLogs,
    addReadingLog,
    avatar,
    updateAvatar,
    toggleAccessory,
    setBackground,
    setAnimal,
    currentStreak,
    totalMinutes,
    totalPages,
    booksStarted,
    booksFinished,
    goalProgress,
    goalsCompleted,
    mostRecentBook,
    currentReading,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
