import React from 'react'
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from './lib/registry'
import StyledProvider from '../components/StyledProvider'
import { dark } from '../styles/colors'

const inter = Inter({ subsets: ['latin'] })

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
            {children}
          </StyledProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
} 