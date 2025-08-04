'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  isDefault?: boolean
}

interface UserContextType {
  users: User[]
  currentUser: User | null
  addUser: (name: string) => void
  removeUser: (userId: string) => void
  updateUser: (userId: string, name: string) => void
  setCurrentUser: (user: User) => void
  getDefaultUser: () => User
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const STORAGE_KEY = 'focus-users'

const getDefaultUser = (): User => ({
  id: 'default',
  name: 'Unnamed User',
  isDefault: true
})

// Check if there's old hardcoded data in localStorage
const checkForOldData = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check for old wheel data
  const hasWheelData = localStorage.getItem('wheelOfLifeWheels_vincent') || 
                       localStorage.getItem('wheelOfLifeWheels_aoife')
  
  // Check for old timetable data
  const hasTimetableData = localStorage.getItem('weekTimetableSchedule_vincent') || 
                           localStorage.getItem('weekTimetableSchedule_aoife')
  
  return !!(hasWheelData || hasTimetableData)
}

// Migrate old hardcoded data to new user system
const migrateOldData = (): User[] => {
  const users: User[] = []
  
  // Check for Vincent's data
  const hasVincentData = localStorage.getItem('wheelOfLifeWheels_vincent') || 
                         localStorage.getItem('weekTimetableSchedule_vincent')
  
  // Check for Aoife's data
  const hasAoifeData = localStorage.getItem('wheelOfLifeWheels_aoife') || 
                       localStorage.getItem('weekTimetableSchedule_aoife')
  
  if (hasVincentData) {
    users.push({
      id: 'vincent-migrated',
      name: 'Vincent'
    })
  }
  
  if (hasAoifeData) {
    users.push({
      id: 'aoife-migrated',
      name: 'Aoife'
    })
  }
  
  // If no old data found, create default user
  if (users.length === 0) {
    users.push(getDefaultUser())
  }
  
  return users
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Load users from localStorage on mount
  useEffect(() => {
    console.log('Loading users from localStorage...')
    const storedUsers = localStorage.getItem(STORAGE_KEY)
    console.log('Stored users:', storedUsers)
    
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers)
        console.log('Parsed users:', parsedUsers)
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          setUsers(parsedUsers)
          setCurrentUser(parsedUsers[0])
          console.log('Set users:', parsedUsers)
        } else {
          // Invalid data or empty array, initialize with default
          const defaultUser = getDefaultUser()
          setUsers([defaultUser])
          setCurrentUser(defaultUser)
          console.log('Set default user:', defaultUser)
        }
      } catch (error) {
        console.error('Error parsing stored users:', error)
        // Initialize with default user on error
        const defaultUser = getDefaultUser()
        setUsers([defaultUser])
        setCurrentUser(defaultUser)
        console.log('Set default user after error:', defaultUser)
      }
    } else {
      // Check for old hardcoded data and migrate
      const hasOldData = checkForOldData()
      console.log('Has old data:', hasOldData)
      if (hasOldData) {
        // Migrate old data to new user system
        const migratedUsers = migrateOldData()
        setUsers(migratedUsers)
        setCurrentUser(migratedUsers[0])
        console.log('Migrated users:', migratedUsers)
      } else {
        // Initialize with default user
        const defaultUser = getDefaultUser()
        setUsers([defaultUser])
        setCurrentUser(defaultUser)
        console.log('Set default user (no old data):', defaultUser)
      }
    }
  }, [])

  // Save users to localStorage whenever users change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    }
  }, [users])

  const addUser = (name: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Unnamed User'
    }
    setUsers(prev => {
      const updatedUsers = [...prev, newUser]
      // Set as current user if it's the first user
      if (prev.length === 0) {
        setCurrentUser(newUser)
      }
      return updatedUsers
    })
  }

  const removeUser = (userId: string) => {
    setUsers(prev => {
      const filtered = prev.filter(user => user.id !== userId)
      
      // If we're removing the current user, set to first available user
      if (currentUser?.id === userId) {
        if (filtered.length > 0) {
          setCurrentUser(filtered[0])
        } else {
          const defaultUser = getDefaultUser()
          setCurrentUser(defaultUser)
          return [defaultUser]
        }
      }
      
      return filtered
    })
  }

  const updateUser = (userId: string, name: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, name: name.trim() || 'Unnamed User' }
          : user
      )
    )
    
    // Update current user if it's the one being updated
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, name: name.trim() || 'Unnamed User' } : null)
    }
  }

  const getDefaultUser = (): User => ({
    id: 'default',
    name: 'Unnamed User',
    isDefault: true
  })

  const value: UserContextType = {
    users,
    currentUser,
    addUser,
    removeUser,
    updateUser,
    setCurrentUser,
    getDefaultUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUsers() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider')
  }
  return context
} 