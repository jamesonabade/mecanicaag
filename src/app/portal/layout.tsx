import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CustomerPortalBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
           <Button variant="outline" asChild>
              <Link href="/">Acesso Oficina</Link>
            </Button>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-6 px-4 text-center text-sm text-muted-foreground border-t bg-card">
        © {new Date().getFullYear()} Mecânica Ágil. Todos os direitos reservados.
      </footer>
    </div>
  );
}
