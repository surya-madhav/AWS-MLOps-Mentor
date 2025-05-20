import type { Meta, StoryObj } from '@storybook/react'
import { MiniSidebar } from '@/components/mini-sidebar'
import { SessionProvider } from 'next-auth/react'
import { TooltipProvider } from '@/components/ui/tooltip'

// Simple mock user
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  image: 'https://github.com/shadcn.png',
}

const meta = {
  title: 'Components/Navigation/MiniSidebar',
  component: MiniSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <SessionProvider>
        <TooltipProvider delayDuration={100}>
          <div className="min-h-screen bg-slate-900">
            <Story />
          </div>
        </TooltipProvider>
      </SessionProvider>
    )
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof MiniSidebar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default state showing a logged-in user with all navigation items.
 */
export const LoggedIn: Story = {
  args: {
    user: mockUser,
  },
}

/**
 * Shows nothing when no user is logged in.
 */
export const LoggedOut: Story = {
  args: {
    user: undefined,
  },
}

/**
 * Tests how the component handles long user names in the avatar.
 */
export const LongName: Story = {
  args: {
    user: {
      ...mockUser,
      name: 'Very Long Name That Should Truncate Properly In The UI',
    },
  },
}

/**
 * Shows the fallback avatar when user has no profile image.
 */
export const NoImage: Story = {
  args: {
    user: {
      ...mockUser,
      image: null,
    },
  },
}