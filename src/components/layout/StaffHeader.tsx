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
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { PanelLeft } from 'lucide-react'; // For sidebar toggle icon

export function StaffHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="md:hidden"> {/* Mobile sidebar toggle */}
         <SheetTrigger asChild> 
          <Button size="icon" variant="outline">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Search bar can be added here if needed */}
        </div>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
                <AvatarFallback>MA</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Suporte</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Sair</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
