'use client'

import React from 'react'
import WeekTimetable from '../components/week-timetable'

export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ 
        marginBottom: '2rem',
        fontSize: '2rem',
        fontWeight: 600,
        color: '#FFFFFF'
      }}>
        Welcome to Focus
      </h1>
      
      <WeekTimetable person="vincent" />
    </div>
  )
} 