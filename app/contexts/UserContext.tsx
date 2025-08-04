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

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Load users from localStorage on mount
  useEffect(() => {
    const storedUsers = localStorage.getItem(STORAGE_KEY)
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers)
      setUsers(parsedUsers)
      
      // Set current user to first user or default
      if (parsedUsers.length > 0) {
        setCurrentUser(parsedUsers[0])
      } else {
        const defaultUser = getDefaultUser()
        setUsers([defaultUser])
        setCurrentUser(defaultUser)
      }
    } else {
      // Initialize with default user
      const defaultUser = getDefaultUser()
      setUsers([defaultUser])
      setCurrentUser(defaultUser)
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
    setUsers(prev => [...prev, newUser])
    
    // Set as current user if it's the first user
    if (users.length === 0) {
      setCurrentUser(newUser)
    }
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