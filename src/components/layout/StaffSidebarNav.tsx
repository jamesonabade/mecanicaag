
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
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
  FileArchive, // Icon for NF-e
  ShoppingCart, // Icon for PDV
  Edit,
  Save,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/shared/Logo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';


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

// IMPORTANT: To customize the order of the main menu items,
// simply reorder the objects within this 'navItems' array.
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
    id: 'vendas',
    label: 'Vendas',
    icon: ShoppingCart,
    subItems: [
      { href: '/dashboard/pdv', label: 'PDV - Venda Balcão', icon: ShoppingCart },
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
      { href: '/dashboard/financeiro/notas-fiscais', label: 'Gerenciar NF-e', icon: FileArchive },
      { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
    ],
  },
  { id: 'portal', href: '/portal', label: 'Portal do Cliente', icon: Globe, target: "_blank" },
];

export function StaffSidebarNav() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [isEditingOrder, setIsEditingOrder] = useState(false);

  // Default to no items open
  const defaultOpenAccordionItems = React.useMemo(() => {
    return [];
  }, []);

  const toggleEditOrder = () => {
    if (isEditingOrder) {
      // Simulate saving
      toast({
        title: "Ordem Salva (Simulado)",
        description: "A nova ordem dos menus foi salva (simulação).",
      });
    } else {
      toast({
        title: "Modo de Edição de Ordem Ativado",
        description: "A funcionalidade de arrastar e soltar para reordenar está em desenvolvimento. Por enquanto, a ordem pode ser ajustada no código.",
        duration: 5000,
      });
    }
    setIsEditingOrder(!isEditingOrder);
  };


  return (
    <div className="flex h-full max-h-screen flex-col text-sidebar-foreground">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo />
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleEditOrder} className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent" title={isEditingOrder ? "Salvar Ordem" : "Editar Ordem dos Menus"}>
          {isEditingOrder ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          <span className="sr-only">{isEditingOrder ? "Salvar Ordem" : "Editar Ordem dos Menus"}</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 py-4">
        <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full px-2 text-sm lg:px-4">
          {navItems.map((item) => {
            if (item.subItems) {
              const isParentActive = item.subItems.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href + '/'));
              return (
                <AccordionItem value={item.id} key={item.id} className="border-b-0">
                  <AccordionTrigger
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground [&[data-state=open]>svg.lucide-chevron-down]:rotate-180',
                      'uppercase font-semibold text-sm', 
                      isParentActive && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent className="pl-4 pt-1 pb-0">
                    <nav className="grid gap-1">
                      {item.subItems.map((subItem) => {
                        const isActiveSubItem = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            target={subItem.target}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-sidebar-accent/90 hover:text-sidebar-accent-foreground',
                              'text-sm', 
                              isActiveSubItem && 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                            )}
                          >
                            <subItem.icon className="h-4 w-4" />
                            {subItem.label}
                          </Link>
                        );
                      })}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href!}
                target={item.target}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground',
                  'uppercase font-semibold text-sm', 
                  pathname === item.href && 'bg-sidebar-primary text-sidebar-primary-foreground',
                  'my-0.5'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </Accordion>
      </ScrollArea>
      <div className="mt-auto p-4 border-t border-sidebar-border">
         <Link
            href="/"
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-sidebar-accent/90 hover:text-sidebar-accent-foreground',
                'text-sm' 
            )}
            >
            <LogOut className="h-4 w-4" />
            Sair
        </Link>
      </div>
    </div>
  );
}
    
