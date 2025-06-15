"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Car,
  Wrench,
  CalendarPlus,
  FileText,
  LogOut,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/shared/Logo';

const navItems = [
  { href: '/portal/dashboard', label: 'Meu Painel', icon: LayoutDashboard },
  { href: '/portal/dashboard/historico', label: 'Histórico de Serviços', icon: Wrench },
  { href: '/portal/dashboard/meus-veiculos', label: 'Meus Veículos', icon: Car },
  { href: '/portal/dashboard/agendar-servico', label: 'Agendar Serviço', icon: CalendarPlus },
  { href: '/portal/dashboard/solicitar-orcamento', label: 'Solicitar Orçamento', icon: FileText },
];

export function CustomerPortalSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link href="/portal/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo />
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                pathname === item.href && 'bg-accent text-accent-foreground hover:text-accent-foreground',
                pathname.startsWith(item.href + '/') && item.href !== '/portal/dashboard' && 'bg-accent text-accent-foreground hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
         <Link
            href="/portal" // Link to customer portal login
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
