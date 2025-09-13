'use client';

import React, { useContext } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { SidebarNav } from './sidebar-nav';
import {
  Languages,
  LogOut,
  PanelLeft,
  Settings,
  User,
} from 'lucide-react';
import { AppContext } from '@/contexts/app-context';
import { ValetLogo } from './valet-logo';

const translations = {
  en: {
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Log out',
    changeLanguage: 'Change language',
  },
  ar: {
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    logout: 'تسجيل الخروج',
    changeLanguage: 'تغيير اللغة',
  },
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { language, toggleLanguage } = useContext(AppContext);
  const t = translations[language];
  const userAvatar = PlaceHolderImages.find(
    (img) => img.id === 'user-avatar-1'
  );

  return (
    <SidebarProvider>
      <Sidebar
        side="left"
        variant="sidebar"
        collapsible="icon"
        className="border-r border-sidebar-border"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <SidebarHeader className="flex items-center gap-3 p-4">
          <ValetLogo />
          <div className="flex flex-col">
            <span className="font-headline text-lg font-semibold text-sidebar-foreground">
              YOUSIF TARIQ
            </span>
            <span className="text-xs text-muted-foreground">Valet Insights</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-12 w-full justify-start gap-3 px-3"
              >
                <Avatar className="h-8 w-8">
                  {userAvatar && (
                    <Image
                      src={userAvatar.imageUrl}
                      alt={userAvatar.description}
                      width={32}
                      height={32}
                      data-ai-hint={userAvatar.imageHint}
                    />
                  )}
                  <AvatarFallback>YT</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">Yousif Tariq</p>
                  <p className="text-xs text-muted-foreground">
                    yousif@example.com
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Yousif Tariq
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    yousif@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{t.profile}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t.settings}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t.logout}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <Button size="icon" variant="outline" className="d-block md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="outline" size="icon" onClick={toggleLanguage}>
              <Languages className="h-5 w-5" />
              <span className="sr-only">{t.changeLanguage}</span>
            </Button>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
