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
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { PanelLeft } from 'lucide-react'; // For sidebar toggle icon
import { SheetTrigger } from '@/components/ui/sheet';

export function CustomerHeader() {
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
          {/* Optional elements like search or quick links */}
        </div>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" alt="Customer Avatar" data-ai-hint="user avatar" />
                <AvatarFallback>C</AvatarFallback> {/* Customer Initial */}
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Meus Dados</DropdownMenuItem>
            <DropdownMenuItem>Preferências</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/portal">Sair</Link> {/* Link to customer portal login */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
