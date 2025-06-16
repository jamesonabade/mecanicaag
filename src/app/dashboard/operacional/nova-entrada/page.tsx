
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, LogIn, Edit, Trash2, PlusCircle, FilePlus } from "lucide-react"; 
import { getClienteById as getClienteDBById } from "@/lib/mockData/clientes"; // Import Cliente type if needed
import { getVeiculoById as getVeiculoDBById } from "@/lib/mockData/veiculos"; // Import Veiculo type if needed
import NovaEntradaDialog, { EntradaEmProgresso, StatusProgressoEntrada } from "@/components/operacional/NovaEntradaDialog";


const mockEntradasIniciais: EntradaEmProgresso[] = [
  {
    id: `ENT-${Date.now() - 10000}`,
    cliente: getClienteDBById("cli_modelo_001"),
    veiculo: getVeiculoDBById("vec_modelo_001"),
    statusProgressoEntrada: "Aguardando Orçamento",
    dataCriacao: new Date(Date.now() - 10000).toISOString(),
    entradaId: `ENT-${Date.now() - 10000}`,
  },
  {
    id: `ENT-${Date.now() - 20000}`,
    cliente: getClienteDBById("cli_002_maria"),
    veiculo: undefined, 
    statusProgressoEntrada: "Aguardando Veículo",
    dataCriacao: new Date(Date.now() - 20000).toISOString(),
    entradaId: `ENT-${Date.now() - 20000}`,
  },
  {
    id: `ENT-${Date.now() - 5000}`,
    cliente: getClienteDBById("cli_modelo_001"),
    veiculo: getVeiculoDBById("vec_002_strada"),
    statusProgressoEntrada: "Orçamento Iniciado", 
    dataCriacao: new Date(Date.now() - 5000).toISOString(),
    entradaId: `ENT-${Date.now() - 5000}`
  },
    {
    id: `ENT-${Date.now() - 30000}`,
    cliente: undefined, 
    veiculo: undefined,
    statusProgressoEntrada: "Aguardando Cliente",
    dataCriacao: new Date(Date.now() - 30000).toISOString(),
    entradaId: `ENT-${Date.now() - 30000}`,
  },
];


export default function PaginaEntradasVeiculos() {
  const { toast } = useToast();
  const router = useRouter();

  const [listaEntradas, setListaEntradas] = useState<EntradaEmProgresso[]>(mockEntradasIniciais.sort((a,b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()));
  const [isNovaEntradaDialogOpen, setIsNovaEntradaDialogOpen] = useState(false);
  const [entradaParaEditar, setEntradaParaEditar] = useState<Partial<EntradaEmProgresso> | undefined>(undefined);

  const handleAbrirDialogNovaEntrada = (entrada?: Partial<EntradaEmProgresso>) => {
    setEntradaParaEditar(entrada);
    setIsNovaEntradaDialogOpen(true);
  };
  
  const handleEntradaDialogFinalizada = (entrada: EntradaEmProgresso | null, action?: 'goToOrcamento' | 'addToList') => {
    setIsNovaEntradaDialogOpen(false); // Fecha o dialog independentemente
    setEntradaParaEditar(undefined); // Limpa a entrada para edição

    if (entrada && action) {
      const existingEntryIndex = listaEntradas.findIndex(e => e.id === entrada.id);
      let newList = [...listaEntradas];

      if (existingEntryIndex > -1) {
        newList[existingEntryIndex] = entrada;
      } else {
        newList.push(entrada);
      }
      setListaEntradas(newList.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()));
      
      if (action === 'goToOrcamento') {
        toast({ title: "Entrada Registrada", description: `Redirecionando para criar orçamento para ${entrada.id}.` });
        // O redirecionamento já é feito dentro do NovaEntradaDialog
      } else if (action === 'addToList') {
        toast({ title: "Entrada Registrada", description: `Entrada ${entrada.id} adicionada à lista, aguardando orçamento.` });
      }
    }
  };
  
  const handleContinuarParaOrcamento = (entradaId: string) => {
    const entrada = listaEntradas.find(e => e.id === entradaId);
    if (entrada && entrada.cliente && entrada.veiculo) {
      setListaEntradas(prev => prev.map(e => e.id === entradaId ? { ...e, statusProgressoEntrada: "Orçamento Iniciado" } : e));
      router.push(`/dashboard/orcamentos/novo?clienteId=${entrada.cliente.id}&veiculoId=${entrada.veiculo.id}&entradaId=${entrada.id}`);
    }
  };
  
  const handleRemoverEntrada = (entradaId: string) => {
    setListaEntradas(prev => prev.filter(e => e.id !== entradaId));
    toast({ title: "Entrada Removida", description: `A entrada ${entradaId} foi removida da lista.` });
  };


  const getStatusBadgeVariant = (status: StatusProgressoEntrada): "default" | "secondary" | "outline" | "destructive" => {
    if (status === "Aguardando Orçamento") return "default";
    if (status === "Orçamento Iniciado") return "outline"; 
    return "secondary"; 
  };

  const calculateProgress = (status: StatusProgressoEntrada): number => {
    switch (status) {
      case "Aguardando Cliente": return 10;
      case "Aguardando Veículo": return 40;
      case "Aguardando Orçamento": return 70;
      case "Orçamento Iniciado": return 100;
      default: return 0;
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><LogIn className="h-7 w-7"/> Gerenciamento de Entradas de Veículos</h1>
        <div className="flex gap-2">
            <Button onClick={() => handleAbrirDialogNovaEntrada()}><PlusCircle className="mr-2 h-4 w-4"/> Iniciar Nova Entrada</Button>
            <Button variant="outline" asChild><Link href="/dashboard"><ChevronLeft className="mr-2 h-4 w-4"/> Voltar ao Painel</Link></Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Entradas de Veículos em Progresso</CardTitle>
          <CardDescription>Acompanhe os veículos que deram entrada e estão aguardando os próximos passos.</CardDescription>
        </CardHeader>
        <CardContent>
          {listaEntradas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Entrada</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status / Progresso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listaEntradas.map((entrada) => (
                  <TableRow key={entrada.id}>
                    <TableCell className="font-medium">{entrada.id}</TableCell>
                    <TableCell>{entrada.cliente?.nomeCompleto || "N/A"}</TableCell>
                    <TableCell>{entrada.veiculo ? `${entrada.veiculo.marca} ${entrada.veiculo.modelo} (${entrada.veiculo.placa})` : "N/A"}</TableCell>
                    <TableCell>{format(new Date(entrada.dataCriacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusBadgeVariant(entrada.statusProgressoEntrada)} className="mb-1 block w-fit">
                            {entrada.statusProgressoEntrada}
                        </Badge>
                        <Progress value={calculateProgress(entrada.statusProgressoEntrada)} className="h-2 w-full sm:w-3/4 md:w-1/2" />
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {entrada.statusProgressoEntrada === "Aguardando Orçamento" && (
                        <Button variant="default" size="sm" onClick={() => handleContinuarParaOrcamento(entrada.id)}>
                          <FilePlus className="mr-1 h-4 w-4"/> Criar Orçamento
                        </Button>
                      )}
                       {(entrada.statusProgressoEntrada === "Aguardando Cliente" || entrada.statusProgressoEntrada === "Aguardando Veículo") && (
                         <Button variant="outline" size="sm" onClick={() => handleAbrirDialogNovaEntrada(entrada)}>
                           <Edit className="mr-1 h-4 w-4"/> Continuar
                         </Button>
                       )}
                       <Button variant="ghost" size="icon" onClick={() => handleRemoverEntrada(entrada.id)} className="text-destructive hover:text-destructive">
                           <Trash2 className="h-4 w-4"/>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <LogIn className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p>Nenhuma entrada de veículo em progresso.</p>
              <p className="text-sm">Clique em "Iniciar Nova Entrada" para começar.</p>
            </div>
          )}
        </CardContent>
         <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Total de {listaEntradas.length} entradas na lista.</p>
        </CardFooter>
      </Card>
      
      <NovaEntradaDialog 
        isOpen={isNovaEntradaDialogOpen} 
        onOpenChange={setIsNovaEntradaDialogOpen}
        onEntradaFinalizada={handleEntradaDialogFinalizada}
        entradaInicial={entradaParaEditar}
      />
    </div>
  );
}
