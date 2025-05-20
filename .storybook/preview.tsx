import React from 'react'
import type { Preview } from "@storybook/react"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SessionProvider } from "next-auth/react"
import './tailwind.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'dark',
          value: '#020817'
        },
        {
          name: 'light',
          value: '#ffffff'
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}          
        >
          <TooltipProvider delayDuration={100}>
            <div className="light">
              <div className="min-h-screen bg-background text-foreground">
                <Story />
              </div>
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </SessionProvider>
    ),
  ],
}

export default preview