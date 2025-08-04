'use client'

import React from 'react'
import WheelOfLifeApp from '../../components/wheel-of-life'
import { useUsers } from '../contexts/UserContext'

export default function WheelsPage() {
  const { currentUser } = useUsers()

  return (
    <div style={{ padding: '2rem' }}>
      {/* Current User Display */}
      {currentUser && (
        <div style={{ 
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '0.5rem',
          border: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: '#1666f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ color: '#ffffff', margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
              {currentUser.name}'s Wheel of Life
            </h2>
            <p style={{ color: '#888888', margin: 0, fontSize: '0.875rem' }}>
              Track your life balance and personal growth
            </p>
          </div>
        </div>
      )}

      {/* Wheel of Life Content */}
      <WheelOfLifeApp />
    </div>
  )
} 