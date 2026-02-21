import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import BottomNav from '../components/BottomNav'
import HamburgerMenu from '../components/HamburgerMenu'
import ReadAloud from '../components/ReadAloud'

const LogReading = () => {
  const navigate = useNavigate()
  const { addReadingLog } = useApp()
  const [formData, setFormData] = useState({
    bookTitle: '',
    minutes: '',
    pages: '',
    date: new Date().toISOString().split('T')[0],
    finished: false,
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.minutes && !formData.pages) {
      setError('Please enter at least minutes read or pages read')
      return
    }

    await addReadingLog({
      bookTitle: formData.bookTitle || 'Untitled Book',
      minutes: parseInt(formData.minutes) || 0,
      pages: parseInt(formData.pages) || 0,
      date: formData.date,
      finished: formData.finished,
    })

    navigate('/')
  }


  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              Log Reading
              <ReadAloud text="Log Reading" />
            </h1>
            <HamburgerMenu />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              {error}
              <ReadAloud text={error} size="xs" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
              Book Title
              <ReadAloud text="Book Title" size="xs" />
            </label>
            <input
              type="text"
              name="bookTitle"
              value={formData.bookTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What are you reading?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                Minutes Read
                <ReadAloud text="Minutes Read" size="xs" />
              </label>
              <input
                type="number"
                name="minutes"
                value={formData.minutes}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
                Pages Read
                <ReadAloud text="Pages Read" size="xs" />
              </label>
              <input
                type="number"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center">
              Date
              <ReadAloud text="Date" size="xs" />
            </label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                📅
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="finished"
                checked={formData.finished}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-3 text-sm font-medium text-gray-900 flex items-center">
                I finished this book
                <ReadAloud text="I finished this book" size="xs" />
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-100 text-gray-900 rounded-xl py-4 px-6 font-semibold hover:bg-gray-200 transition-colors border-2 border-gray-300 shadow-sm flex items-center justify-center"
            >
              Cancel
              <ReadAloud text="Cancel" size="xs" />
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white rounded-xl py-4 px-6 font-semibold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center"
            >
              Save Log
              <ReadAloud text="Save Log" size="xs" />
            </button>
          </div>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}

export default LogReading
