'use client'

import React, { useState, useEffect } from 'react'
import { H1, H2, P } from '../../styles/typography'
import {
  Container,
  StatsPanel,
  TimetableContainer,
  TimetableContent,
  Table,
  Th,
  Td,
  TimeCell,
  CellContent,
  Input,
  UnallocatedCard,
  ActivityCard,
  EmptyState
} from './week-timetable.styles'
import { useUsers } from '../../app/contexts/UserContext'

interface Schedule {
  [day: string]: {
    [time: string]: string
  }
}

interface ActivityStats {
  [activity: string]: {
    hours: number
    color: string
  }
}

interface EditingCell {
  day: string
  time: string
}

interface WeekTimetableProps {
  person?: string
}

const WeekTimetable = ({ person }: WeekTimetableProps) => {
  const { currentUser } = useUsers()
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const totalSlots = 7 * 34 // 7 days × 34 time slots (7am-12am in 30min blocks)
  
  // Use currentUser.id as the person identifier for storage
  const personId = currentUser?.id || 'default'
  
  // Calm color palette for activities - each color is unique
  const activityColors = [
    '#E8F4FD', // Light blue
    '#F0F8FF', // Alice blue
    '#F5F5DC', // Beige
    '#F0FFF0', // Honeydew
    '#FFF8DC', // Cornsilk
    '#FDF5E6', // Old lace
    '#F5F5F5', // White smoke
    '#FAF0E6', // Linen
    '#F8F8FF', // Ghost white
    '#F0FFFF', // Azure
    '#FFF0F5', // Lavender blush
    '#F5FFFA', // Mint cream
    '#FFF5EE', // Seashell
    '#F0F8F8', // Light cyan
    '#F8F0FF', // Light lavender
    '#FFF8F0', // Light peach
    '#F0FFF8', // Light mint
    '#F8FFF0', // Light lime
    '#FFF0F8', // Light pink
    '#F0F8F0', // Light green
    '#F8F8F0', // Light yellow
    '#F0F0F8', // Light purple
    '#F8F0F0', // Light salmon
    '#F0F8F0', // Light mint green
    '#F8F8F8', // Light gray
    '#F5F0FF', // Very light purple
    '#FFF0F5', // Very light pink
    '#F0FFF5', // Very light mint
    '#F5FFF0', // Very light lime
    '#FFF5F0', // Very light peach
    '#F0F5FF', // Very light blue
    '#F5F0F5', // Very light lavender
    '#F7F7F7', // Very light gray
    '#F9F9F9', // Almost white
    '#F6F6F6', // Light gray 2
    '#F4F4F4', // Light gray 3
    '#F3F3F3', // Light gray 4
    '#F2F2F2', // Light gray 5
    '#F1F1F1', // Light gray 6
    '#F0F0F0', // Light gray 7
    '#EFEFEF', // Light gray 8
    '#EEEEEE', // Light gray 9
    '#EDEDED', // Light gray 10
    '#ECECEC', // Light gray 11
    '#EBEBEB', // Light gray 12
    '#EAEAEA', // Light gray 13
    '#E9E9E9', // Light gray 14
    '#E8E8E8', // Light gray 15
    '#E7E7E7', // Light gray 16
    '#E6E6E6', // Light gray 17
    '#E5E5E5', // Light gray 18
    '#E4E4E4', // Light gray 19
    '#E3E3E3', // Light gray 20
    '#E2E2E2', // Light gray 21
    '#E1E1E1', // Light gray 22
    '#E0E0E0', // Light gray 23
    '#DFDFDF', // Light gray 24
    '#DEDEDE', // Light gray 25
    '#DDDDDD', // Light gray 26
    '#DCDCDC', // Light gray 27
    '#DBDBDB', // Light gray 28
    '#DADADA', // Light gray 29
    '#D9D9D9', // Light gray 30
    '#D8D8D8', // Light gray 31
    '#D7D7D7', // Light gray 32
    '#D6D6D6', // Light gray 33
    '#D5D5D5', // Light gray 34
    '#D4D4D4', // Light gray 35
    '#D3D3D3', // Light gray 36
    '#D2D2D2', // Light gray 37
    '#D1D1D1', // Light gray 38
    '#D0D0D0', // Light gray 39
    '#CFCFCF', // Light gray 40
    '#CECECE', // Light gray 41
    '#CDCDCD', // Light gray 42
    '#CCCCCC', // Light gray 43
    '#CBCBCB', // Light gray 44
    '#CACACA', // Light gray 45
    '#C9C9C9', // Light gray 46
    '#C8C8C8', // Light gray 47
    '#C7C7C7', // Light gray 48
    '#C6C6C6', // Light gray 49
    '#C5C5C5', // Light gray 50
  ]
  
  // Track activity-to-color assignments to ensure consistency
  const [activityColorMap, setActivityColorMap] = useState<Map<string, string>>(new Map())
  

  
  const getActivityColor = (activity: string): string => {
    if (!activity.trim()) return 'transparent'
    
    // Check if we already have a color assigned for this activity
    if (activityColorMap.has(activity)) {
      return activityColorMap.get(activity)!
    }
    
    // If no color is assigned yet, return a default color
    return '#E8F4FD' // Light blue as default
  }

  // Separate function to assign colors to activities
  const assignActivityColor = (activity: string): string => {
    if (!activity.trim()) return 'transparent'
    
    // Check if we already have a color assigned for this activity
    if (activityColorMap.has(activity)) {
      return activityColorMap.get(activity)!
    }
    
    // Find the first unused color
    const usedColors = new Set(activityColorMap.values())
    let selectedColor = activityColors[0] // fallback
    
    for (const color of activityColors) {
      if (!usedColors.has(color)) {
        selectedColor = color
        break
      }
    }
    
    // Assign this color to the activity
    setActivityColorMap(prev => new Map(prev).set(activity, selectedColor))
    
    return selectedColor
  }
  
  // Generate time slots from 7:00 AM to 12:00 AM (midnight)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 7; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      slots.push(`${hour.toString().padStart(2, '0')}:30`)
    }
    // Add midnight slot
    slots.push('00:00')
    return slots
  }

  const timeSlots = generateTimeSlots()
  
  // Initialize empty schedule
  const initializeSchedule = (): Schedule => {
    const schedule: Schedule = {}
    days.forEach(day => {
      schedule[day] = {}
      timeSlots.forEach(time => {
        schedule[day][time] = ''
      })
    })
    return schedule
  }

  const [schedule, setSchedule] = useState<Schedule>(initializeSchedule())
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [activityStats, setActivityStats] = useState<ActivityStats>({})
  const [unallocatedTime, setUnallocatedTime] = useState(totalSlots)
  const [isLoaded, setIsLoaded] = useState(false)
  const [focusedCell, setFocusedCell] = useState<EditingCell | null>(null)

  // Load schedule from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storageKey = `weekTimetableSchedule_${personId}`
        const savedSchedule = localStorage.getItem(storageKey)
        if (savedSchedule) {
          let parsedSchedule
          
          // Handle both old double-encoded format and new format
          try {
            // First try to parse as the new format (direct JSON)
            parsedSchedule = JSON.parse(savedSchedule)
          } catch {
            // If that fails, try the old double-encoded format
            const oldFormatData = JSON.parse(savedSchedule)
            if (oldFormatData.weekTimetableSchedule) {
              parsedSchedule = JSON.parse(oldFormatData.weekTimetableSchedule)
            } else {
              throw new Error('Invalid data format')
            }
          }
          
          setSchedule(parsedSchedule)
        }
      } catch (error) {
        console.error('Error loading schedule from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [personId])

  // Save schedule to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        const storageKey = `weekTimetableSchedule_${personId}`
        localStorage.setItem(storageKey, JSON.stringify(schedule))
      } catch (error) {
        console.error('Error saving schedule to localStorage:', error)
      }
    }
  }, [schedule, isLoaded, personId])

  // Calculate activity statistics
  useEffect(() => {
    const stats: ActivityStats = {}
    let filledSlots = 0

    days.forEach(day => {
      timeSlots.forEach(time => {
        const activity = schedule[day][time].trim()
        if (activity) {
          filledSlots++
          const activityKey = activity.toLowerCase()
          if (!stats[activityKey]) {
            stats[activityKey] = {
              hours: 0,
              color: getActivityColor(activity)
            }
          }
          stats[activityKey].hours += 0.5 // Each slot is 30 minutes = 0.5 hours
        }
      })
    })

    setActivityStats(stats)
    setUnallocatedTime(totalSlots - filledSlots)
  }, [schedule, activityColorMap])

  // Set initial focused cell
  useEffect(() => {
    if (isLoaded && !focusedCell) {
      setFocusedCell({ day: days[0], time: timeSlots[0] })
    }
  }, [isLoaded, focusedCell])

  // Assign colors to all activities in the schedule
  useEffect(() => {
    if (isLoaded && schedule) {
      // Get all unique activities from the schedule
      const allActivities = new Set<string>()
      days.forEach(day => {
        timeSlots.forEach(time => {
          const activity = schedule[day][time].trim()
          if (activity) {
            allActivities.add(activity)
          }
        })
      })
      
      // Assign a unique color to each activity
      let colorIndex = 0
      allActivities.forEach(activity => {
        if (!activityColorMap.has(activity)) {
          const color = activityColors[colorIndex % activityColors.length]
          setActivityColorMap(prev => new Map(prev).set(activity, color))
          colorIndex++
        }
      })
    }
  }, [isLoaded, schedule, activityColorMap])



  const handleCellClick = (day: string, time: string) => {
    setEditingCell({ day, time })
    setFocusedCell({ day, time })
  }

  const handleGlobalKeyDown = (e: React.KeyboardEvent) => {
    if (editingCell) return // Don't handle global navigation when editing
    
    const currentCell = focusedCell || { day: days[0], time: timeSlots[0] }
    const currentDayIndex = days.indexOf(currentCell.day)
    const currentTimeIndex = timeSlots.indexOf(currentCell.time)
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        if (currentDayIndex < days.length - 1) {
          const newCell = { day: days[currentDayIndex + 1], time: timeSlots[currentTimeIndex] }
          setFocusedCell(newCell)
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (currentDayIndex > 0) {
          const newCell = { day: days[currentDayIndex - 1], time: timeSlots[currentTimeIndex] }
          setFocusedCell(newCell)
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (currentTimeIndex < timeSlots.length - 1) {
          const newCell = { day: days[currentDayIndex], time: timeSlots[currentTimeIndex + 1] }
          setFocusedCell(newCell)
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (currentTimeIndex > 0) {
          const newCell = { day: days[currentDayIndex], time: timeSlots[currentTimeIndex - 1] }
          setFocusedCell(newCell)
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedCell) {
          setEditingCell(focusedCell)
        }
        break
    }
  }

  const handleInputChange = (day: string, time: string, value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: value
      }
    }))
    
    // Assign color to new activity if it doesn't have one
    if (value.trim() && !activityColorMap.has(value.trim())) {
      assignActivityColor(value.trim())
    }
  }

  const handleInputBlur = () => {
    setEditingCell(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setEditingCell(null)
      // Move to next cell on Enter
      moveToNextCell()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (e.shiftKey) {
        moveToPreviousCell()
      } else {
        moveToNextCell()
      }
    }
  }

  const moveToNextCell = () => {
    if (!editingCell) return
    
    const currentDayIndex = days.indexOf(editingCell.day)
    const currentTimeIndex = timeSlots.indexOf(editingCell.time)
    
    let nextDayIndex = currentDayIndex
    let nextTimeIndex = currentTimeIndex
    
    if (currentDayIndex < days.length - 1) {
      nextDayIndex = currentDayIndex + 1
    } else {
      nextDayIndex = 0
      if (currentTimeIndex < timeSlots.length - 1) {
        nextTimeIndex = currentTimeIndex + 1
      } else {
        return // At the end of the table
      }
    }
    
    setEditingCell({
      day: days[nextDayIndex],
      time: timeSlots[nextTimeIndex]
    })
  }

  const moveToPreviousCell = () => {
    if (!editingCell) return
    
    const currentDayIndex = days.indexOf(editingCell.day)
    const currentTimeIndex = timeSlots.indexOf(editingCell.time)
    
    let prevDayIndex = currentDayIndex
    let prevTimeIndex = currentTimeIndex
    
    if (currentDayIndex > 0) {
      prevDayIndex = currentDayIndex - 1
    } else {
      prevDayIndex = days.length - 1
      if (currentTimeIndex > 0) {
        prevTimeIndex = currentTimeIndex - 1
      } else {
        return // At the beginning of the table
      }
    }
    
    setEditingCell({
      day: days[prevDayIndex],
      time: timeSlots[prevTimeIndex]
    })
  }

  const handleArrowKeyNavigation = (e: React.KeyboardEvent) => {
    if (!editingCell) return
    
    const currentDayIndex = days.indexOf(editingCell.day)
    const currentTimeIndex = timeSlots.indexOf(editingCell.time)
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        if (currentDayIndex < days.length - 1) {
          setEditingCell({
            day: days[currentDayIndex + 1],
            time: timeSlots[currentTimeIndex]
          })
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (currentDayIndex > 0) {
          setEditingCell({
            day: days[currentDayIndex - 1],
            time: timeSlots[currentTimeIndex]
          })
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (currentTimeIndex < timeSlots.length - 1) {
          setEditingCell({
            day: days[currentDayIndex],
            time: timeSlots[currentTimeIndex + 1]
          })
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (currentTimeIndex > 0) {
          setEditingCell({
            day: days[currentDayIndex],
            time: timeSlots[currentTimeIndex - 1]
          })
        }
        break
    }
  }

  const formatHours = (hours: number) => {
    const h = Math.floor(hours)
    const m = (hours % 1) * 60
    if (m === 0) {
      return `${h}h`
    }
    return `${h}h ${m}m`
  }

  const getCellContent = (day: string, time: string) => {
    const activity = schedule[day][time]
    const isEditing = editingCell && editingCell.day === day && editingCell.time === time

    if (isEditing) {
      return (
        <Input
          type="text"
          value={activity}
          onChange={(e) => handleInputChange(day, time, e.target.value)}
          onBlur={handleInputBlur}
          onKeyDown={(e) => {
            handleKeyPress(e)
            handleArrowKeyNavigation(e)
          }}
          autoFocus
        />
      )
    }

    return (
      <CellContent>
        {activity || ''}
      </CellContent>
    )
  }

  return (
    <Container onKeyDown={handleGlobalKeyDown} tabIndex={0}>
      {/* Activity Statistics Panel */}
      <StatsPanel>
        <H2 style={{ margin: '0 0 1rem 0' }}>Activity Summary</H2>
        
        {/* Unallocated Time */}
        <UnallocatedCard>
          <P style={{ fontSize: '0.875rem', fontWeight: 500, color: '#dc2626', margin: '0 0 0.25rem 0' }}>
            Unallocated Time
          </P>
          <P style={{ fontSize: '1.125rem', fontWeight: 700, color: '#dc2626', margin: 0 }}>
            {formatHours(unallocatedTime * 0.5)}
          </P>
        </UnallocatedCard>

        {/* Activity List */}
        <div>
          {Object.entries(activityStats)
            .sort(([,a], [,b]) => b.hours - a.hours) // Sort by time spent (descending)
            .map(([activity, data]) => (
              <ActivityCard key={activity}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div 
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: data.color, 
                        borderRadius: '2px',
                        border: '1px solid #B7B7B7',
                        flexShrink: 0
                      }} 
                    />
                    <P style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1666f0', margin: 0, textTransform: 'capitalize' }}>
                      {activity}
                    </P>
                  </div>
                  <P style={{ fontSize: '0.875rem', color: '#1666f0', fontWeight: 600, margin: 0 }}>
                    {formatHours(data.hours)}
                  </P>
                </div>
              </ActivityCard>
            ))}
        </div>
        
        {Object.keys(activityStats).length === 0 && (
          <EmptyState>
            No activities scheduled yet. Click on time slots to add activities.
          </EmptyState>
        )}
      </StatsPanel>

      {/* Timetable */}
      <TimetableContainer>
        <TimetableContent>
          <H1 style={{ marginBottom: '1.5rem' }}>{currentUser?.name || 'User'}'s Weekly Timetable</H1>
          
          <div style={{ overflowX: 'auto' }}>
            <Table>
              <thead>
                <tr>
                  <Th>Time</Th>
                  {days.map(day => (
                    <Th key={day}>{day}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time}>
                    <TimeCell>{time}</TimeCell>
                    {days.map(day => (
                      <Td
                        key={`${day}-${time}`}
                        onClick={() => handleCellClick(day, time)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleCellClick(day, time)
                          }
                        }}
                        tabIndex={focusedCell && focusedCell.day === day && focusedCell.time === time ? 0 : -1}
                        role="gridcell"
                        isFocused={!!(focusedCell && focusedCell.day === day && focusedCell.time === time && !editingCell)}
                        activityColor={getActivityColor(schedule[day][time])}
                      >
                        {getCellContent(day, time)}
                      </Td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </TimetableContent>
      </TimetableContainer>
    </Container>
  )
}

export default WeekTimetable 