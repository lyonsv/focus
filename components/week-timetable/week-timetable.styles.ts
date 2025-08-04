import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.light};
  min-height: 100vh;
`

export const StatsPanel = styled.div`
  width: 16rem;
  background-color: ${props => props.theme.colors.light};
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  height: fit-content;
`

export const TimetableContainer = styled.div`
  flex: 1;
  background-color: ${props => props.theme.colors.light};
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: auto;
`

export const TimetableContent = styled.div`
  padding: 1rem;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const Th = styled.th`
  padding: 0.5rem;
  border: 1px solid #B7B7B7;
  background-color: ${props => props.theme.colors.light};
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.base};
  min-width: 8rem;
  
  &:first-child {
    width: 5rem;
    min-width: 5rem;
  }
`

export const Td = styled.td<{ isFocused?: boolean; activityColor?: string }>`
  border: 1px solid #B7B7B7;
  height: 2rem;
  transition: background-color 0.2s;
  cursor: pointer;
  background-color: ${props => {
    if (props.isFocused) return `${props.theme.colors.accent}10`
    if (props.activityColor && props.activityColor !== 'transparent') return props.activityColor
    return 'transparent'
  }};
  
  &:hover {
    background-color: ${props => props.theme.colors.light};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.accent};
    outline-offset: -2px;
  }
`

export const TimeCell = styled.td`
  padding: 0.5rem;
  border: 1px solid #B7B7B7;
  background-color: ${props => props.theme.colors.light};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.colors.base};
  text-align: center;
`

export const CellContent = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
  cursor: text;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

export const Input = styled.input`
  width: 100%;
  height: 100%;
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
  border: none;
  outline: none;
  background-color: ${props => props.theme.colors.accent}20;
  text-align: center;
`

export const UnallocatedCard = styled.div`
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
`

export const ActivityCard = styled.div`
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.accent}10;
  border-radius: 0.25rem;
  border: 1px solid ${props => props.theme.colors.accent}30;
  margin-bottom: 0.5rem;
`

export const EmptyState = styled.div`
  color: ${props => props.theme.colors.base};
  font-size: 0.875rem;
  font-style: italic;
  opacity: 0.6;
` 