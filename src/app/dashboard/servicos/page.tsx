import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function ServicosPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Gestão de Serviços</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Nova Ordem de Serviço
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Ordens de Serviço</CardTitle>
          <CardDescription>Crie e acompanhe orçamentos e ordens de serviço.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="mb-2">Funcionalidade de Gestão de Serviços em desenvolvimento.</p>
            <p>Aqui você poderá gerar orçamentos, emitir OS, controlar status e apontar horas.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
