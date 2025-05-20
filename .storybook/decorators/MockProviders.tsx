import React from 'react'
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Session, User } from "next-auth"

interface MockProvidersProps {
  children: React.ReactNode
  theme?: "light" | "dark"
}

/**
 * MockProviders component wraps story components with necessary context providers.
 * This includes session, theme, and tooltip providers required by the components.
 *
 * @param props.children - The story component to wrap
 * @param props.theme - Optional theme override ('light' | 'dark')
 */
export function MockProviders({ children, theme = "dark" }: MockProvidersProps) {
  // Mock user data that matches next-auth User type
  const mockUser: User = {
    id: 'mock-user-id',
    name: 'Mock User',
    email: 'mock@example.com',
    image: 'https://github.com/shadcn.png',
  }

  // Mock session data that matches next-auth Session type
  const mockSession: Session = {
    user: mockUser,
    expires: new Date(Date.now() + 2 * 86400000).toISOString(), // 2 days from now
  }

  return (
    <SessionProvider session={mockSession}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme={theme} 
        enableSystem={false}
        storageKey="sb-theme"
      >
        <TooltipProvider delayDuration={100}>
          <div className="sb-main">
            {children}
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}