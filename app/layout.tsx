import React from 'react'
import StyledComponentsRegistry from './lib/registry'
import StyledProvider from '../components/StyledProvider'
import TopNavigation from '../components/TopNavigation'
import { UserProvider } from './contexts/UserContext'
import { dark } from '../styles/colors'

export const metadata = {
  title: 'Base',
  description: 'Base application',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-gb" style={{ background: dark }}>
      <body>
        <StyledComponentsRegistry>
          <StyledProvider>
            <UserProvider>
              <TopNavigation />
              {children}
            </UserProvider>
          </StyledProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
} 