
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, TrendingUp, Filter, Download } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
// Placeholder for chart component
// import { BarChart } from "@/components/ui/chart"; // Assuming a chart component exists

export default function FluxoCaixaPage() {
  const { toast } = useToast();

  const handleFilter = () => {
    toast({
      title: "Filtro em Desenvolvimento",
      description: "A funcionalidade de filtrar o fluxo de caixa será implementada em breve.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exportação em Desenvolvimento",
      description: "A funcionalidade de exportar o fluxo de caixa será implementada em breve.",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <TrendingUp /> Fluxo de Caixa
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleFilter}>
            <Filter className="mr-2 h-4 w-4" /> Filtrar Período
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/financeiro">
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Financeiro
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Visão Geral do Fluxo de Caixa</CardTitle>
          <CardDescription>Acompanhe as entradas e saídas financeiras da oficina.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Placeholder for Chart */}
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg h-64 flex items-center justify-center">
            <p>Gráfico do Fluxo de Caixa será exibido aqui.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Entradas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Lista de receitas recentes.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Saídas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <p>Lista de despesas recentes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
