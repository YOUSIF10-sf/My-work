'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  BarChart2,
  FileUp,
  FileText,
  Settings,
} from 'lucide-react';
import { useContext } from 'react';
import { AppContext } from '@/contexts/app-context';

const navTranslations = {
  en: {
    Dashboard: 'Dashboard',
    Operations: 'Operations',
    Invoices: 'Invoices',
    Settings: 'Settings',
  },
  ar: {
    Dashboard: 'لوحة التحكم',
    Operations: 'العمليات',
    Invoices: 'الفواتير',
    Settings: 'الإعدادات',
  }
};

const navItems = [
  {
    href: '/',
    labelKey: 'Dashboard',
    icon: BarChart2,
  },
  {
    href: '/operations',
    labelKey: 'Operations',
    icon: FileUp,
  },
  {
    href: '/invoices',
    labelKey: 'Invoices',
    icon: FileText,
  },
  {
    href: '/settings',
    labelKey: 'Settings',
    icon: Settings,
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { language } = useContext(AppContext);
  const t = navTranslations[language];

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const label = t[item.labelKey as keyof typeof t];
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
