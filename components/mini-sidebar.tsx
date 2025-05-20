'use client';

import { useEffect, useState } from 'react';
import type { User } from 'next-auth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, MessageSquare, MoreVertical } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';
import Image from 'next/image';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

// Navigation items
const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
];

export function MiniSidebar({ user }: { user: User | undefined }) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mounted, setMounted] = useState(false);

  // Mock user data for demo purposes
  const dummyUser = user || {
    name: 'Demo User',
    email: 'demo@example.com',
    image: null,
  };

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Check if path is active
  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(`${path}/`);

  if (isMobile) {
    // Mobile bottom bar or desktop sidebar
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none pb-4">
        <div className="pointer-events-auto flex items-center h-16 px-2 bg-background/80 backdrop-blur-md rounded-full border border-border/50 shadow-lg mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex justify-center"
            >
              <Button
                variant={isActive(item.href) ? 'secondary' : 'ghost'}
                size="icon"
                className={cn(
                  'w-12 h-12 rounded-full transition-all',
                  isActive(item.href) && 'bg-primary/10 text-primary shadow-sm',
                )}
              >
                <item.icon size={22} />
                <span className="sr-only">{item.label}</span>
              </Button>
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-full"
              >
                <MoreVertical size={22} />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <div className="w-8 h-8 rounded-full bg-[#FFD2A6] flex items-center justify-center text-[#A34B2F] font-medium">
                  {dummyUser.name?.charAt(0) || 'D'}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{dummyUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {dummyUser.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
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
                  onClick={() => signOut({ redirectTo: '/' })}
                >
                  Sign out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <TooltipProvider delayDuration={100}>
      <div className="fixed top-0 left-0 h-dvh z-50 flex">
        <div className="h-[calc(100vh-2rem)] my-4 ml-4 flex flex-col items-center bg-background/80 backdrop-blur-md rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-border/50 w-16 transition-all duration-300 overflow-hidden">
          {/* Logo */}
          <div className="mt-6 mb-6 relative group">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#25E5CA] to-[#2080D] rounded-xl transition-transform duration-300 group-hover:scale-110">
              {theme === 'dark' ? (
                <Image
                  src="/images/LogoL.png"
                  alt="Logo"
                  className="w-8 h-8 object-cover"
                  width={50}
                  height={50}
                />
              ) : (
                <Image
                  src="/images/LogoT.png"
                  alt="Logo"
                  className="w-8 h-8 object-cover"
                  width={50}
                  height={50}
                />
              )}
            </div>
          </div>

          {/* Subtle divider */}
          <div className="w-8 h-px bg-border/50 mb-6"></div>

          {/* Navigation */}
          <div className="flex flex-col items-center gap-3">
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href} className="relative group">
                    <Button
                      variant={isActive(item.href) ? 'secondary' : 'ghost'}
                      size="icon"
                      className={cn(
                        'w-10 h-10 rounded-xl transition-all duration-200',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'hover:bg-primary/5 hover:scale-105',
                      )}
                    >
                      <item.icon size={20} />
                      <span className="sr-only">{item.label}</span>
                    </Button>
                    {isActive(item.href) && (
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-primary rounded-full" />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={10}
                  className="font-medium"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* User menu */}
          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="w-8 h-px bg-border/50"></div>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-xl hover:bg-primary/5 transition-all duration-200 hover:scale-105"
                    >
                      <MoreVertical size={20} />
                      <span className="sr-only">User Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={10}
                  className="font-medium"
                >
                  Menu
                </TooltipContent>
              </Tooltip>

              <DropdownMenuContent align="end" side="right" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFD2A6] flex items-center justify-center text-[#A34B2F] font-medium">
                    {dummyUser.name?.charAt(0) || 'D'}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{dummyUser.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {dummyUser.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
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
                    onClick={() => signOut({ redirectTo: '/' })}
                  >
                    Sign out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
