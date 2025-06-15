
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react'; // Import type
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Package,
  Landmark,
  UserCog,
  CalendarDays,
  ListChecks,
  Globe,
  LogOut,
  Settings,
  FileSpreadsheet,
  ChevronDown,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/shared/Logo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React from 'react';

type NavSubItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  target?: string;
};

type NavItemEntry = {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  target?: string;
  subItems?: NavSubItem[];
};

const navItems: NavItemEntry[] = [
  { id: 'painel', href: '/dashboard', label: 'Painel Principal', icon: LayoutDashboard },
  {
    id: 'gestao-oficina',
    label: 'Gestão da Oficina',
    icon: Wrench,
    subItems: [
      { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
      { href: '/dashboard/veiculos', label: 'Veículos', icon: Car },
      { href: '/dashboard/agendamento', label: 'Agendamentos', icon: CalendarDays },
      { href: '/dashboard/orcamentos', label: 'Orçamentos', icon: FileSpreadsheet },
      { href: '/dashboard/servicos', label: 'Serviços (OS)', icon: Wrench },
      { href: '/dashboard/checklists', label: 'Checklists', icon: ListChecks },
    ],
  },
  {
    id: 'gestao-recursos',
    label: 'Gestão de Recursos',
    icon: Package,
    subItems: [
      { href: '/dashboard/produtos', label: 'Produtos/Estoque', icon: Package },
      { href: '/dashboard/funcionarios', label: 'Funcionários', icon: UserCog },
    ],
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: Settings,
    subItems: [
      { href: '/dashboard/financeiro', label: 'Financeiro', icon: Landmark },
      { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
  { id: 'portal', href: '/portal', label: 'Portal do Cliente', icon: Globe, target: "_blank" },
];

export function StaffSidebarNav() {
  const pathname = usePathname();

  // Determine which accordion items should be open by default
  const defaultOpenAccordionItems = React.useMemo(() => {
    return navItems
      .filter(item => item.subItems?.some(subItem => pathname.startsWith(subItem.href)))
      .map(item => item.id);
  }, [pathname]);

  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo />
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => {
            if (item.subItems) {
              const isParentActive = item.subItems.some(subItem => pathname.startsWith(subItem.href));
              return (
                <AccordionItem value={item.id} key={item.id} className="border-b-0">
                  <AccordionTrigger
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted [&[data-state=open]>svg.lucide-chevron-down]:rotate-180',
                      isParentActive && 'bg-accent text-accent-foreground hover:text-accent-foreground hover:bg-accent/90'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-auto" />
                  </AccordionTrigger>
                  <AccordionContent className="pl-4 pt-1 pb-0">
                    <nav className="grid gap-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          target={subItem.target}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted/50',
                            pathname === subItem.href && 'bg-muted text-primary font-semibold',
                            pathname.startsWith(subItem.href + '/') && subItem.href !== '/dashboard' && 'bg-muted text-primary font-semibold'
                          )}
                        >
                          <subItem.icon className="h-4 w-4" />
                          {subItem.label}
                        </Link>
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              );
            }
            // Render direct link if no subItems
            return (
              <Link
                key={item.href}
                href={item.href!}
                target={item.target}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                  pathname === item.href && 'bg-accent text-accent-foreground hover:text-accent-foreground hover:bg-accent/90',
                   // Adjusted for non-accordion items to avoid unnecessary AccordionItem wrapper
                  'my-0.5' // Small margin for separation, mimicking AccordionItem spacing somewhat
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </Accordion>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
         <Link
            href="/"
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted'
            )}
            >
            <LogOut className="h-4 w-4" />
            Sair
        </Link>
      </div>
    </div>
  );
}
