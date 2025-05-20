'use client';

import type { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, MessageSquare, MoreVertical } from 'lucide-react';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export function MiniSidebar({ user }: { user: User | undefined }) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  
  // Check if user is authenticated
  if (!user) {
    return null;
  }

  const isDashboardActive =
    pathname === '/dashboard' || pathname?.startsWith('/dashboard/');
  const isChatActive = pathname === '/chat' || pathname?.startsWith('/chat/');

  return (
    <TooltipProvider>
      <div className="fixed top-0 left-0 flex flex-col items-center h-dvh border-r w-14 bg-background py-4 gap-4 z-50">
        {/* Dashboard Icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/dashboard">
              <Button 
                variant={isDashboardActive ? "secondary" : "ghost"} 
                size="icon" 
                className="w-10 h-10"
              >
                <LayoutDashboard size={20} />
                <span className="sr-only">Dashboard</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Dashboard</TooltipContent>
        </Tooltip>

        {/* Chat Icon */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/chat">
              <Button 
                variant={isChatActive ? "secondary" : "ghost"} 
                size="icon" 
                className="w-10 h-10"
              >
                <MessageSquare size={20} />
                <span className="sr-only">Chat</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Chat</TooltipContent>
        </Tooltip>

        {/* Spacer to push settings to bottom */}
        <div className="flex-grow"></div>

        {/* User menu dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-10 h-10">
                  <MoreVertical size={20} />
                  <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">Menu</TooltipContent>
          </Tooltip>
          
          <DropdownMenuContent align="end" side="right">
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => {
                  signOut({
                    redirectTo: '/',
                  });
                }}
              >
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}
