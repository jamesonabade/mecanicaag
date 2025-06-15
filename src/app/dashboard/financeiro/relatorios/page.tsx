
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Download, CalendarDays, BarChart2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function RelatoriosFinanceirosPage() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = React.useState<{from: Date | undefined, to: Date | undefined}>({
    from: undefined,
    to: undefined,
  });

  const handleGenerateReport = () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        variant: "destructive",
        title: "Período Inválido",
        description: "Por favor, selecione um período para gerar o relatório.",
      });
      return;
    }
    toast({
      title: "Gerando Relatório (Simulado)",
      description: `Relatório para o período de ${format(dateRange.from, "PPP", { locale: ptBR })} a ${format(dateRange.to, "PPP", { locale: ptBR })} será exibido/baixado aqui.`,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <FileText /> Relatórios Financeiros
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/financeiro">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Financeiro
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Gerar Novo Relatório</CardTitle>
          <CardDescription>Selecione o tipo de relatório e o período desejado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6 items-end">
                <div>
                    <Label htmlFor="tipoRelatorio" className="block mb-2">Tipo de Relatório</Label>
                    <Select defaultValue="fluxo_caixa_detalhado">
                        <SelectTrigger id="tipoRelatorio">
                        <SelectValue placeholder="Selecione o tipo de relatório" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="fluxo_caixa_detalhado">Fluxo de Caixa Detalhado</SelectItem>
                        <SelectItem value="dre_simplificado">DRE Simplificado</SelectItem>
                        <SelectItem value="contas_pagar_receber">Contas a Pagar/Receber</SelectItem>
                        <SelectItem value="vendas_servicos">Vendas por Serviços/Produtos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="block mb-2">Período</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                            )}
                        >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {dateRange.from ? (
                            dateRange.to ? (
                                <>
                                {format(dateRange.from, "LLL dd, y", { locale: ptBR })} -{" "}
                                {format(dateRange.to, "LLL dd, y", { locale: ptBR })}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y", { locale: ptBR })
                            )
                            ) : (
                            <span>Escolha um período</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange.from}
                            selected={dateRange}
                            onSelect={(range) => range && setDateRange(range)}
                            numberOfMonths={2}
                            locale={ptBR}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
             <Button onClick={handleGenerateReport} className="w-full md:w-auto">
                <BarChart2 className="mr-2 h-4 w-4" /> Gerar Relatório
            </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Visualização do Relatório</CardTitle>
          <CardDescription>O relatório gerado será exibido abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg h-96 flex flex-col items-center justify-center">
            <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="mb-2">Nenhum relatório gerado ou selecionado.</p>
            <p>Utilize os filtros acima para gerar um novo relatório financeiro.</p>
            <Button variant="outline" className="mt-4" onClick={() => toast({title: "Download em desenvolvimento"})}>
                <Download className="mr-2 h-4 w-4"/> Baixar Exemplo (PDF)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
