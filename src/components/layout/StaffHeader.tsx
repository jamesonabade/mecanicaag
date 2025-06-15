import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SheetTrigger } from '@/components/ui/sheet'; // For mobile sidebar toggle
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { PanelLeft, Search, Info, Bell } from 'lucide-react'; 
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function StaffHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-sidebar-border bg-sidebar px-4 sm:px-6 text-sidebar-foreground">
      <div className="md:hidden"> {/* Mobile sidebar toggle */}
         <SheetTrigger asChild> 
          <Button size="icon" variant="ghost" className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
      </div>
      
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        {/* Search Bar */}
        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Procurar..."
            className="w-full rounded-lg bg-background text-foreground pl-8 md:w-[200px] lg:w-[320px] h-9"
          />
        </div>

        {/* Alert Banner - Example */}
        <div className="hidden lg:flex items-center gap-2 bg-destructive/90 text-destructive-foreground px-3 py-1.5 rounded-md text-xs">
          <Info className="h-4 w-4" />
          <span>ATENÇÃO: Sua assinatura expira em 7 dias.</span>
          <Button variant="link" className="text-destructive-foreground h-auto p-0 underline text-xs">Renovar</Button>
        </div>
        
        <ThemeToggle />

        <Button variant="ghost" size="icon" className="rounded-full text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
          <Info className="h-5 w-5" />
          <span className="sr-only">Informações</span>
        </Button>

        <Button variant="ghost" size="icon" className="rounded-full relative text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 justify-center text-xs bg-red-500 text-white rounded-full">3</Badge>
          <span className="sr-only">Notificações</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full p-0 h-9 w-9 focus-visible:ring-0 focus-visible:ring-offset-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40/4285F4/FFFFFF.png?text=M" alt="Mecânica Ágil" data-ai-hint="user avatar" />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">M</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-sidebar border-sidebar-border text-sidebar-foreground">
            <DropdownMenuLabel>Mecânica Ágil</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-sidebar-border"/>
            <DropdownMenuItem className="hover:!bg-sidebar-accent focus:!bg-sidebar-accent hover:!text-sidebar-accent-foreground focus:!text-sidebar-accent-foreground">Configurações</DropdownMenuItem>
            <DropdownMenuItem className="hover:!bg-sidebar-accent focus:!bg-sidebar-accent hover:!text-sidebar-accent-foreground focus:!text-sidebar-accent-foreground">Suporte</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-sidebar-border"/>
            <DropdownMenuItem asChild className="hover:!bg-sidebar-accent focus:!bg-sidebar-accent hover:!text-sidebar-accent-foreground focus:!text-sidebar-accent-foreground">
              <Link href="/">Sair</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
