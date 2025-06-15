
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
  Settings, // Ícone para Configurações
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/shared/Logo';

const navItems = [
  { href: '/dashboard', label: 'Painel Principal', icon: LayoutDashboard },
  { href: '/dashboard/clientes', label: 'Clientes', icon: Users },
  { href: '/dashboard/veiculos', label: 'Veículos', icon: Car },
  { href: '/dashboard/servicos', label: 'Serviços', icon: Wrench },
  { href: '/dashboard/produtos', label: 'Produtos/Estoque', icon: Package },
  { href: '/dashboard/financeiro', label: 'Financeiro', icon: Landmark },
  { href: '/dashboard/funcionarios', label: 'Funcionários', icon: UserCog },
  { href: '/dashboard/agendamento', label: 'Agendamentos', icon: CalendarDays },
  { href: '/dashboard/checklists', label: 'Checklists', icon: ListChecks },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings }, // Novo item
  { href: '/portal', label: 'Portal do Cliente', icon: Globe, target: "_blank" },
];

export function StaffSidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col">
      <div className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo />
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.target}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                pathname === item.href && 'bg-accent text-accent-foreground hover:text-accent-foreground',
                pathname.startsWith(item.href + '/') && item.href !== '/dashboard' && 'bg-accent text-accent-foreground hover:text-accent-foreground'
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
            href="/" // Link to logout/login page
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

    