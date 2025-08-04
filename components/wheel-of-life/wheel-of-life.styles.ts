import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
`

export const WheelCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
`

export const WheelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
`

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
`

export const ConfigSection = styled.div`
  margin-bottom: 1.5rem;
`

export const ConfigCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  width: 100%;
`

export const Button = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const Input = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: #1666f0;
    box-shadow: 0 0 0 3px rgba(22, 102, 240, 0.1);
  }
`

export const RangeInput = styled.input`
  width: 5rem;
  height: 0.5rem;
  border-radius: 0.25rem;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #1666f0;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #1666f0;
    cursor: pointer;
    border: none;
  }
`

export const SegmentRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
` 