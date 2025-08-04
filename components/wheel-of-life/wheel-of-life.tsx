'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Settings, Save, X, Trash2, Edit3 } from 'lucide-react'
import { H1, H2, H3, H4, P } from '../../styles/typography'
import { Container, WheelCard, WheelGrid, EmptyState, Button, Input, RangeInput, SegmentRow, ConfigSection, ConfigCard } from './wheel-of-life.styles'
import { useUsers } from '../../app/contexts/UserContext'

interface Wheel {
  id: number
  title: string
  segments: string[]
  values: number[]
  createdAt: Date
}

interface WheelOfLifeProps {
  segments: string[]
  values: number[]
  title: string
  isConfiguring: boolean
  onSegmentChange?: (index: number, value: string) => void
  onValueChange?: (index: number, value: number) => void
  onSave?: () => void
  onCancel?: () => void
  onAddSegment?: () => void
  onRemoveSegment?: (index: number) => void
  onDelete?: () => void
  minSegments?: number
  maxSegments?: number
}

interface WheelOfLifeAppProps {
  person?: string
}

const WheelOfLife = ({
  segments, 
  values, 
  title, 
  isConfiguring, 
  onSegmentChange, 
  onValueChange, 
  onSave, 
  onCancel, 
  onAddSegment, 
  onRemoveSegment, 
  onDelete, 
  minSegments = 4, 
  maxSegments = 12 
}: WheelOfLifeProps) => {
  const centerX = 200
  const centerY = 200
  const radius = 120
  const innerRadius = 20
  
  const segmentAngle = (2 * Math.PI) / segments.length
  
  const getSegmentPath = (index: number, value: number) => {
    const startAngle = index * segmentAngle - Math.PI / 2
    const endAngle = (index + 1) * segmentAngle - Math.PI / 2
    const valueRadius = innerRadius + (value / 10) * (radius - innerRadius)
    
    const x1 = centerX + innerRadius * Math.cos(startAngle)
    const y1 = centerY + innerRadius * Math.sin(startAngle)
    const x2 = centerX + valueRadius * Math.cos(startAngle)
    const y2 = centerY + valueRadius * Math.sin(startAngle)
    const x3 = centerX + valueRadius * Math.cos(endAngle)
    const y3 = centerY + valueRadius * Math.sin(endAngle)
    const x4 = centerX + innerRadius * Math.cos(endAngle)
    const y4 = centerY + innerRadius * Math.sin(endAngle)
    
    const largeArcFlag = segmentAngle > Math.PI ? 1 : 0
    
    return `M ${x1} ${y1} L ${x2} ${y2} A ${valueRadius} ${valueRadius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`
  }
  
  const getLabelPosition = (index: number) => {
    const angle = index * segmentAngle + segmentAngle / 2 - Math.PI / 2
    const labelRadius = radius + 40
    const x = centerX + labelRadius * Math.cos(angle)
    const y = centerY + labelRadius * Math.sin(angle)
    return { x, y }
  }
  
  const getScorePosition = (index: number, value: number) => {
    const angle = index * segmentAngle + segmentAngle / 2 - Math.PI / 2
    const scoreRadius = innerRadius + (value / 10) * (radius - innerRadius) * 0.7
    const x = centerX + scoreRadius * Math.cos(angle)
    const y = centerY + scoreRadius * Math.sin(angle)
    return { x, y }
  }
  
  const colors = [
    '#E8F4FD', '#F0F8FF', '#F5F5DC', '#F0FFF0', '#FFF8DC', '#FDF5E6',
    '#F5F5F5', '#FAF0E6', '#F8F8FF', '#F0FFFF', '#FFF0F5', '#F5FFFA'
  ]

  return (
    <WheelCard>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <H3>{title}</H3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isConfiguring && (
            <>
              <Button onClick={onSave} style={{ backgroundColor: '#10B981', color: 'white' }}>
                <Save size={16} />
              </Button>
              <Button onClick={onCancel} style={{ backgroundColor: '#6B7280', color: 'white' }}>
                <X size={16} />
              </Button>
            </>
          )}
          {!isConfiguring && onDelete && (
            <Button 
              onClick={onDelete} 
              style={{ backgroundColor: '#EF4444', color: 'white' }}
              title="Delete wheel"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width="400" height="400" style={{ marginBottom: '1rem' }}>
          {/* Grid circles */}
          {[2, 4, 6, 8, 10].map(level => (
            <circle
              key={level}
              cx={centerX}
              cy={centerY}
              r={innerRadius + (level / 10) * (radius - innerRadius)}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Grid lines */}
          {segments.map((_, index) => {
            const angle = index * segmentAngle - Math.PI / 2
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)
            return (
              <line
                key={index}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            )
          })}
          
          {/* Segments */}
          {segments.map((segment, index) => {
            const value = values[index] || 0
            return (
              <path
                key={index}
                d={getSegmentPath(index, value)}
                fill={colors[index % colors.length]}
                fillOpacity="0.7"
                stroke="#fff"
                strokeWidth="2"
              />
            )
          })}
          
          {/* Labels */}
          {segments.map((segment, index) => {
            const pos = getLabelPosition(index)
            // Truncate very long labels to prevent clipping
            const displayText = segment.length > 12 ? segment.substring(0, 12) + '...' : segment
            return (
              <g key={index}>
                <title>{segment}</title>
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '0.875rem', fontWeight: 500, fill: '#374151' }}
                >
                  {displayText}
                </text>
              </g>
            )
          })}
          
          {/* Score labels */}
          {segments.map((segment, index) => {
            const value = values[index] || 0
            if (value > 0) {
              const pos = getScorePosition(index, value)
              return (
                <text
                  key={`score-${index}`}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: '0.75rem', fontWeight: 700, fill: '#374151' }}
                >
                  {value}
                </text>
              )
            }
            return null
          })}
        </svg>
        
        {isConfiguring && (
          <div style={{ width: '100%' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <H4>Configure Segments</H4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    {segments.length} of {maxSegments} segments
                  </span>
                  <Button
                    onClick={onAddSegment}
                    disabled={segments.length >= maxSegments}
                    style={{ 
                      backgroundColor: segments.length >= maxSegments ? '#D1D5DB' : '#10B981', 
                      color: 'white',
                      padding: '0.25rem'
                    }}
                    title="Add segment"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>
              {segments.map((segment, index) => (
                <SegmentRow key={index}>
                  <Input
                    type="text"
                    value={segment}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSegmentChange?.(index, e.target.value)}
                    placeholder={`Segment ${index + 1}`}
                  />
                  <RangeInput
                    type="range"
                    min="0"
                    max="10"
                    value={values[index] || 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onValueChange?.(index, parseInt(e.target.value))}
                  />
                  <span style={{ width: '2rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    {values[index] || 0}
                  </span>
                  {segments.length > minSegments && (
                    <Button
                      onClick={() => onRemoveSegment?.(index)}
                      style={{ backgroundColor: '#EF4444', color: 'white', padding: '0.5rem' }}
                      title="Remove segment"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </SegmentRow>
              ))}
              {segments.length <= minSegments && (
                <P light style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Minimum {minSegments} segments required
                </P>
              )}
            </div>
          </div>
        )}
      </div>
    </WheelCard>
  )
}

const WheelOfLifeApp = ({ person }: WheelOfLifeAppProps) => {
  const { currentUser } = useUsers()
  const [wheels, setWheels] = useState<Wheel[]>([])
  const [isConfiguringSegments, setIsConfiguringSegments] = useState(false)
  const [isCreatingWheel, setIsCreatingWheel] = useState(false)
  const [segments, setSegments] = useState([
    'Career', 'Finances', 'Health', 'Family & Friends', 'Romance', 'Personal Growth', 'Fun & Recreation', 'Physical Environment'
  ])
  const [currentValues, setCurrentValues] = useState(new Array(8).fill(5))
  
  const MIN_SEGMENTS = 4
  const MAX_SEGMENTS = 12
  
  const formatDate = (date: Date) => {
    const day = date.getDate()
    const month = date.toLocaleString('default', { month: 'long' })
    const year = date.getFullYear()
    
    const getOrdinal = (n: number) => {
      if (n > 3 && n < 21) return 'th'
      switch (n % 10) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
      }
    }
    
    return `${day}${getOrdinal(day)} ${month} ${year}`
  }
  
  const handleSegmentChange = (index: number, value: string) => {
    const newSegments = [...segments]
    newSegments[index] = value
    setSegments(newSegments)
  }
  
  const handleValueChange = (index: number, value: number) => {
    const newValues = [...currentValues]
    newValues[index] = value
    setCurrentValues(newValues)
  }
  
  const handleSaveSegments = () => {
    // Save segments configuration
    setIsConfiguringSegments(false)
  }
  
  const handleCancelSegmentConfig = () => {
    setIsConfiguringSegments(false)
  }
  
  const handleSaveWheel = () => {
    const newWheel: Wheel = {
      id: Date.now(),
      title: formatDate(new Date()),
      segments: [...segments],
      values: [...currentValues],
      createdAt: new Date()
    }
    setWheels([...wheels, newWheel])
    setIsCreatingWheel(false)
    // Reset values to default for next wheel
    setCurrentValues(new Array(segments.length).fill(5))
  }
  
  const handleCancelWheelCreation = () => {
    setIsCreatingWheel(false)
    // Reset values to default
    setCurrentValues(new Array(segments.length).fill(5))
  }
  
  const startSegmentConfiguration = () => {
    setIsConfiguringSegments(true)
  }
  
  const startWheelCreation = () => {
    setIsCreatingWheel(true)
  }
  
  const addSegment = () => {
    if (segments.length < MAX_SEGMENTS) {
      setSegments([...segments, `Segment ${segments.length + 1}`])
      setCurrentValues([...currentValues, 5])
    }
  }
  
  const removeSegment = (index: number) => {
    if (segments.length > MIN_SEGMENTS) {
      const newSegments = segments.filter((_, i) => i !== index)
      const newValues = currentValues.filter((_, i) => i !== index)
      setSegments(newSegments)
      setCurrentValues(newValues)
    }
  }

  const handleDeleteWheel = (wheelId: number) => {
    setWheels(wheels.filter(wheel => wheel.id !== wheelId))
  }

  // Load wheels and segments from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storageKey = `wheelOfLifeWheels_${currentUser?.id || 'default'}`
        const segmentsKey = `wheelOfLifeSegments_${currentUser?.id || 'default'}`
        
        const savedWheels = localStorage.getItem(storageKey)
        const savedSegments = localStorage.getItem(segmentsKey)
        
        if (savedWheels) {
          const parsedWheels = JSON.parse(savedWheels)
          // Convert string dates back to Date objects
          const wheelsWithDates = parsedWheels.map((wheel: any) => ({
            ...wheel,
            createdAt: new Date(wheel.createdAt)
          }))
          setWheels(wheelsWithDates)
        }
        
        if (savedSegments) {
          setSegments(JSON.parse(savedSegments))
          setCurrentValues(new Array(JSON.parse(savedSegments).length).fill(5))
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error)
      }
    }
  }, [currentUser?.id])

  // Save wheels and segments to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storageKey = `wheelOfLifeWheels_${currentUser?.id || 'default'}`
        const segmentsKey = `wheelOfLifeSegments_${currentUser?.id || 'default'}`
        localStorage.setItem(storageKey, JSON.stringify(wheels))
        localStorage.setItem(segmentsKey, JSON.stringify(segments))
      } catch (error) {
        console.error('Error saving data to localStorage:', error)
      }
    }
  }, [wheels, segments, currentUser?.id])

  return (
    <Container>
      {/* Segment Configuration Section */}
      <ConfigSection>
        <ConfigCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <H3>Life Categories</H3>
              <P style={{ marginTop: '0.25rem', color: '#374151' }}>
                Define the consistent categories for your life balance tracking
              </P>
            </div>
            <Button
              onClick={startSegmentConfiguration}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                backgroundColor: '#1666f0',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              <Edit3 size={16} />
              Configure Categories
            </Button>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {segments.map((segment, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {segment}
              </span>
            ))}
          </div>
        </ConfigCard>
      </ConfigSection>
      
      {/* Wheel Creation Section */}
      {!isConfiguringSegments && !isCreatingWheel && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Button
            onClick={startWheelCreation}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              backgroundColor: '#10B981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            <Plus size={20} />
            Create New Wheel
          </Button>
        </div>
      )}
      
      <WheelGrid>
        {isConfiguringSegments && (
          <WheelOfLife
            segments={segments}
            values={new Array(segments.length).fill(5)}
            title="Configure Life Categories"
            isConfiguring={true}
            onSegmentChange={handleSegmentChange}
            onValueChange={handleValueChange}
            onSave={handleSaveSegments}
            onCancel={handleCancelSegmentConfig}
            onAddSegment={addSegment}
            onRemoveSegment={removeSegment}
            minSegments={MIN_SEGMENTS}
            maxSegments={MAX_SEGMENTS}
          />
        )}
        
        {isCreatingWheel && (
          <WheelOfLife
            segments={segments}
            values={currentValues}
            title="Create New Wheel"
            isConfiguring={true}
            onSegmentChange={handleSegmentChange}
            onValueChange={handleValueChange}
            onSave={handleSaveWheel}
            onCancel={handleCancelWheelCreation}
            onAddSegment={addSegment}
            onRemoveSegment={removeSegment}
            minSegments={MIN_SEGMENTS}
            maxSegments={MAX_SEGMENTS}
          />
        )}
        
        {wheels.map((wheel) => (
          <WheelOfLife
            key={wheel.id}
            segments={wheel.segments}
            values={wheel.values}
            title={wheel.title}
            isConfiguring={false}
            onDelete={() => handleDeleteWheel(wheel.id)}
          />
        ))}
      </WheelGrid>
      
      {wheels.length === 0 && !isConfiguringSegments && !isCreatingWheel && (
        <EmptyState>
          <Settings size={48} style={{ color: '#9CA3AF', marginBottom: '1rem' }} />
          <H3 style={{ color: '#6B7280', marginBottom: '0.5rem' }}>No wheels created yet</H3>
          <P light style={{ marginBottom: '1.5rem' }}>Create your first Wheel of Life to start tracking your life balance</P>
          <Button
            onClick={startWheelCreation}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              backgroundColor: '#10B981',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            <Plus size={20} />
            Create Your First Wheel
          </Button>
        </EmptyState>
      )}
    </Container>
  )
}

export default WheelOfLifeApp 