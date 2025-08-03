import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '../../app/page'

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />)
    const title = screen.getByTestId('homepage-title')
    expect(title).toBeInTheDocument()
  })
})
