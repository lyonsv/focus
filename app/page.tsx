'use client'

import React, { useState } from 'react'
import WeekTimetable from '../components/week-timetable'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'vincent' | 'aoife'>('vincent')

  return (
    <div style={{ padding: '2rem' }}>
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '1rem'
      }}>
        <button
          onClick={() => setActiveTab('vincent')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'vincent' ? '#1666f0' : '#f3f4f6',
            color: activeTab === 'vincent' ? 'white' : '#374151',
            transition: 'all 0.2s ease'
          }}
        >
          Vincent
        </button>
        <button
          onClick={() => setActiveTab('aoife')}
          style={{
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: activeTab === 'aoife' ? '#1666f0' : '#f3f4f6',
            color: activeTab === 'aoife' ? 'white' : '#374151',
            transition: 'all 0.2s ease'
          }}
        >
          Aoife
        </button>
      </div>

      {/* Timetable Content */}
      <WeekTimetable person={activeTab} />
    </div>
  )
} 