import React from 'react'
import { render, screen } from '@testing-library/react'
import HomePage from '../../app/page'
import StyledProvider from '../../components/StyledProvider'
import StyledComponentsRegistry from '../../app/lib/registry'

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(
      <StyledComponentsRegistry>
        <StyledProvider>
          <HomePage />
        </StyledProvider>
      </StyledComponentsRegistry>
    )
    const title = screen.getByTestId('homepage-title')
    expect(title).toBeInTheDocument()
  })
})
