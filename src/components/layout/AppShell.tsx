import { StaffHeader } from './StaffHeader';
import { StaffSidebarNav } from './StaffSidebarNav';
import { Sheet, SheetContent } from '@/components/ui/sheet'; // For mobile sidebar

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card md:block">
        <StaffSidebarNav />
      </div>
      <Sheet> {/* Mobile Sidebar */}
        <SheetContent side="left" className="p-0 w-[220px] sm:w-[280px] bg-card">
          <StaffSidebarNav />
        </SheetContent>
        <div className="flex flex-col">
          <StaffHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
            {children}
          </main>
        </div>
      </Sheet>
    </div>
  );
}
