
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, FileText } from "lucide-react";
import Link from "next/link";

export default function FinanceiroPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">Gestão Financeira</h1>
         <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button asChild className="flex-grow md:flex-grow-0">
              <Link href="/dashboard/financeiro/transacoes/nova">
                <PlusCircle className="mr-2 h-4 w-4" /> Nova Transação
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-grow md:flex-grow-0">
              <Link href="/dashboard/financeiro/fluxo-caixa">
                <TrendingUp className="mr-2 h-4 w-4" /> Ver Fluxo de Caixa
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-grow md:flex-grow-0">
              <Link href="/dashboard/financeiro/relatorios">
                <FileText className="mr-2 h-4 w-4" /> Gerar Relatório
              </Link>
            </Button>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Contas a Pagar e Receber</CardTitle>
          <CardDescription>Controle suas despesas, receitas e visualize o fluxo de caixa.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="mb-2">Funcionalidade de Gestão Financeira em desenvolvimento.</p>
            <p>Aqui você poderá gerenciar contas, emitir NF-e e analisar relatórios financeiros.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
