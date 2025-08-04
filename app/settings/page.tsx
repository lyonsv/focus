'use client'

import React, { useState } from 'react'
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react'
import { useUsers, User } from '../contexts/UserContext'
import { H1, H2, P } from '../../styles/typography'

export default function SettingsPage() {
  const { users, currentUser, addUser, removeUser, updateUser, setCurrentUser } = useUsers()
  const [newUserName, setNewUserName] = useState('')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleAddUser = () => {
    if (newUserName.trim()) {
      addUser(newUserName)
      setNewUserName('')
    }
  }

  const handleStartEdit = (user: User) => {
    setEditingUser(user.id)
    setEditingName(user.name)
  }

  const handleSaveEdit = () => {
    if (editingUser && editingName.trim()) {
      updateUser(editingUser, editingName)
      setEditingUser(null)
      setEditingName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setEditingName('')
  }

  const handleRemoveUser = (userId: string) => {
    if (users.length > 1) {
      removeUser(userId)
    }
  }

  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <H1 style={{ marginBottom: '2rem', color: '#ffffff' }}>Settings</H1>
      
      {/* Current User Section */}
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        border: '1px solid #333'
      }}>
        <H2 style={{ marginBottom: '1rem', color: '#ffffff' }}>Current User</H2>
        {currentUser && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#2a2a2a',
            borderRadius: '0.5rem'
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
              <P style={{ color: '#ffffff', margin: 0, fontWeight: 600 }}>
                {currentUser.name}
              </P>
              <P style={{ color: '#888888', margin: 0, fontSize: '0.875rem' }}>
                Active user
              </P>
            </div>
          </div>
        )}
      </div>

      {/* Users Management Section */}
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        marginBottom: '2rem',
        border: '1px solid #333'
      }}>
        <H2 style={{ marginBottom: '1rem', color: '#ffffff' }}>Users</H2>
        
        {/* Add New User */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1.5rem',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter user name"
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '0.375rem',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: '#ffffff',
              fontSize: '1rem'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
          />
          <button
            onClick={handleAddUser}
            disabled={!newUserName.trim()}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: newUserName.trim() ? '#1666f0' : '#444',
              color: 'white',
              cursor: newUserName.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            <Plus size={16} />
            Add User
          </button>
        </div>

        {/* Users List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                backgroundColor: '#2a2a2a',
                borderRadius: '0.5rem',
                border: currentUser?.id === user.id ? '2px solid #1666f0' : '1px solid #444'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: currentUser?.id === user.id ? '#1666f0' : '#555',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                
                {editingUser === user.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      border: '1px solid #444',
                      backgroundColor: '#1a1a1a',
                      color: '#ffffff',
                      fontSize: '0.875rem'
                    }}
                    autoFocus
                  />
                ) : (
                  <P style={{ color: '#ffffff', margin: 0 }}>
                    {user.name}
                    {currentUser?.id === user.id && (
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        fontSize: '0.75rem', 
                        color: '#1666f0',
                        fontWeight: 500
                      }}>
                        (Current)
                      </span>
                    )}
                  </P>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {editingUser === user.id ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      disabled={!editingName.trim()}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        backgroundColor: editingName.trim() ? '#10b981' : '#444',
                        color: 'white',
                        cursor: editingName.trim() ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Save size={14} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(user)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Edit3 size={14} />
                    </button>
                    {users.length > 1 && (
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.25rem',
                          border: 'none',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Switch User Section */}
        {users.length > 1 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #444' }}>
            <H2 style={{ marginBottom: '1rem', color: '#ffffff', fontSize: '1.125rem' }}>
              Switch User
            </H2>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSetCurrentUser(user)}
                  disabled={currentUser?.id === user.id}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #444',
                    backgroundColor: currentUser?.id === user.id ? '#1666f0' : 'transparent',
                    color: currentUser?.id === user.id ? 'white' : '#cccccc',
                    cursor: currentUser?.id === user.id ? 'default' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: currentUser?.id === user.id ? 600 : 400
                  }}
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '1.5rem', 
        borderRadius: '0.5rem',
        border: '1px solid #333'
      }}>
        <H2 style={{ marginBottom: '1rem', color: '#ffffff' }}>How it works</H2>
        <div style={{ color: '#cccccc', fontSize: '0.875rem', lineHeight: '1.5' }}>
          <P style={{ marginBottom: '0.5rem' }}>
            • Add multiple users to switch between different profiles
          </P>
          <P style={{ marginBottom: '0.5rem' }}>
            • Each user has their own data for wheels and timetables
          </P>
          <P style={{ marginBottom: '0.5rem' }}>
            • The current user is highlighted and their data is shown in the app
          </P>
          <P style={{ marginBottom: '0' }}>
            • You can edit user names or remove users (at least one user must remain)
          </P>
        </div>
      </div>
    </div>
  )
} 