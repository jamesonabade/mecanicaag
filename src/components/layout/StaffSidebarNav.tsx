
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
  FileArchive, 
  ShoppingCart, 
  Edit,
  Save,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/shared/Logo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React, { useState, useEffect, useCallback } from 'react';
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

// Default order of navigation items.
// To customize the default order, reorder the objects within this 'initialNavItems' array.
const initialNavItems: NavItemEntry[] = [
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

const LOCAL_STORAGE_KEY = 'mecAgilSidebarOrder';

export function StaffSidebarNav() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [orderedNavItems, setOrderedNavItems] = useState<NavItemEntry[]>(initialNavItems);

  useEffect(() => {
    const savedOrderJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedOrderJson) {
      try {
        const savedOrderIds = JSON.parse(savedOrderJson) as string[];
        const newOrderedItems: NavItemEntry[] = [];
        const initialItemsMap = new Map(initialNavItems.map(item => [item.id, item]));

        savedOrderIds.forEach(id => {
          const item = initialItemsMap.get(id);
          if (item) {
            newOrderedItems.push(item);
            initialItemsMap.delete(id);
          }
        });
        // Add any new items not in the saved order to the end
        initialItemsMap.forEach(item => newOrderedItems.push(item));
        setOrderedNavItems(newOrderedItems);
      } catch (error) {
        console.error("Failed to parse saved sidebar order:", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid data
      }
    }
  }, []);

  const defaultOpenAccordionItems = React.useMemo(() => {
     return []; // Start with all accordions collapsed
  }, []);

  const handleToggleEditOrder = () => {
    if (isEditingOrder) {
      // Save the current order to localStorage
      const currentOrderIds = orderedNavItems.map(item => item.id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentOrderIds));
      toast({
        title: "Ordem Salva!",
        description: "A nova ordem dos menus foi salva no seu navegador.",
      });
    } else {
      toast({
        title: "Modo de Edição de Ordem Ativado",
        description: "Use as setas para reordenar os menus principais. Clique em 'Salvar Ordem' para aplicar.",
        duration: 5000,
      });
    }
    setIsEditingOrder(!isEditingOrder);
  };

  const moveItem = useCallback((index: number, direction: 'up' | 'down') => {
    setOrderedNavItems(prevItems => {
      const newItems = [...prevItems];
      const itemToMove = newItems[index];
      if (direction === 'up' && index > 0) {
        newItems.splice(index, 1);
        newItems.splice(index - 1, 0, itemToMove);
      } else if (direction === 'down' && index < newItems.length - 1) {
        newItems.splice(index, 1);
        newItems.splice(index + 1, 0, itemToMove);
      }
      return newItems;
    });
  }, []);


  return (
    <div className="flex h-full max-h-screen flex-col text-sidebar-foreground">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Logo />
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleToggleEditOrder} 
          className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent" 
          title={isEditingOrder ? "Salvar Ordem dos Menus" : "Editar Ordem dos Menus"}
        >
          {isEditingOrder ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          <span className="sr-only">{isEditingOrder ? "Salvar Ordem" : "Editar Ordem dos Menus"}</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 py-4">
        <Accordion type="multiple" defaultValue={defaultOpenAccordionItems} className="w-full px-2 text-sm lg:px-4">
          {orderedNavItems.map((item, index) => {
            const mainItemContent = (
              <div className="flex-1 flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            );

            const reorderControls = isEditingOrder && (
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => { e.stopPropagation(); moveItem(index, 'up'); }} 
                  disabled={index === 0}
                  className="h-7 w-7 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => { e.stopPropagation(); moveItem(index, 'down'); }} 
                  disabled={index === orderedNavItems.length - 1}
                  className="h-7 w-7 text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            );

            if (item.subItems) {
              const isParentActive = item.subItems.some(subItem => pathname === subItem.href || pathname.startsWith(subItem.href + '/'));
              return (
                <AccordionItem value={item.id} key={item.id} className="border-b-0">
                  <AccordionTrigger
                    className={cn(
                      'flex items-center gap-0 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground [&[data-state=open]>svg.lucide-chevron-down]:rotate-180',
                      'uppercase font-semibold text-sm', 
                      isParentActive && 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
                    )}
                  >
                    {mainItemContent}
                    {reorderControls}
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
              <div key={item.id} className={cn(
                'flex items-center justify-between gap-0 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground',
                'uppercase font-semibold text-sm', 
                pathname === item.href && 'bg-sidebar-primary text-sidebar-primary-foreground',
                'my-0.5' // consistent margin for direct links
              )}>
                <Link
                  href={item.href!}
                  target={item.target}
                  className="flex-1 flex items-center gap-3"
                >
                  {mainItemContent}
                </Link>
                {reorderControls}
              </div>
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
    

    