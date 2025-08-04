'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { white, black, blue, gray3, gray4 } from '../styles/colors'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Week', href: '/week' },
  { label: 'Wheels', href: '/wheels' },
  { label: 'Settings', href: '/settings' },
]

export default function TopNavigation() {
  const pathname = usePathname()

  return (
    <nav style={{
      backgroundColor: black,
      borderBottom: `1px solid ${gray4}`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '4rem',
        padding: '0 2rem',
      }}>
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  color: isActive ? blue : gray3,
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '1rem',
                  padding: '0.5rem 0',
                  borderBottom: isActive ? `2px solid ${blue}` : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 