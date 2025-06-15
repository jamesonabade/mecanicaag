
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, FileSpreadsheet, Eye, Edit, Search, Printer } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react"; 

// Mock data - Mover para um arquivo central no futuro
interface Cliente {
  id: string;
  nome: string;
  cpfCnpj?: string; // Adicionado para consistência
}
interface Veiculo {
  id: string;
  clienteId: string;
  modelo: string;
  placa: string;
  marca?: string; // Adicionado para consistência
}

const mockClientes: Cliente[] = [
  { id: "cli001", nome: "João da Silva", cpfCnpj: "111.111.111-11" },
  { id: "cli002", nome: "Maria Oliveira", cpfCnpj: "222.222.222-22" },
  { id: "cli003", nome: "Carlos Pereira", cpfCnpj: "333.333.333-33" },
];

const mockVeiculos: Veiculo[] = [
  { id: "vec001", clienteId: "cli001", marca: "Honda", modelo: "Civic", placa: "ABC-1234" },
  { id: "vec002", clienteId: "cli001", marca: "Fiat", modelo: "Strada", placa: "DEF-5678" },
  { id: "vec003", clienteId: "cli002", marca: "Toyota", modelo: "Corolla", placa: "GHI-9012" },
  { id: "vec004", clienteId: "cli003", marca: "VW", modelo: "Nivus", placa: "JKL-3456" },
];

const mockOrcamentosData = [
  {
    id: "ORC001",
    clienteId: "cli001",
    veiculoId: "vec001",
    dataOrcamento: "2024-07-28T10:00:00Z",
    validadeDias: 15,
    totalGeral: 485.00,
    status: "Aprovado",
  },
  {
    id: "ORC002",
    clienteId: "cli002",
    veiculoId: "vec003",
    dataOrcamento: "2024-07-29T14:30:00Z",
    validadeDias: 7,
    totalGeral: 1250.75,
    status: "Pendente",
  },
  {
    id: "ORC003",
    clienteId: "cli001",
    veiculoId: "vec002",
    dataOrcamento: "2024-07-30T09:15:00Z",
    validadeDias: 10,
    totalGeral: 320.00,
    status: "Rejeitado",
  },
  {
    id: "ORC004",
    clienteId: "cli003",
    veiculoId: "vec004",
    dataOrcamento: "2024-07-30T11:00:00Z",
    validadeDias: 5,
    totalGeral: 880.50,
    status: "ConvertidoOS",
  },
];

export default function OrcamentosPage() {
  const { toast } = useToast();

  const getClienteNome = (clienteId: string) => mockClientes.find(c => c.id === clienteId)?.nome || "Desconhecido";
  const getVeiculoDescricao = (veiculoId: string) => {
    const veiculo = mockVeiculos.find(v => v.id === veiculoId);
    return veiculo ? `${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})` : "Desconhecido";
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Aprovado":
        return "default"; 
      case "Pendente":
        return "secondary"; 
      case "Rejeitado":
      case "Cancelado":
        return "destructive"; 
      case "ConvertidoOS":
        return "outline"; 
      default:
        return "secondary";
    }
  };
  
  const getStatusLabel = (status: string): string => {
     switch (status) {
      case "Aprovado": return "Aprovado";
      case "Pendente": return "Pendente";
      case "Rejeitado": return "Rejeitado";
      case "Cancelado": return "Cancelado";
      case "ConvertidoOS": return "Convertido em OS";
      default: return status;
    }
  }


  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <FileSpreadsheet className="h-7 w-7" /> Gestão de Orçamentos
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-initial">
            <Search className="mr-2 h-4 w-4" /> Buscar Orçamento
          </Button>
          <Button asChild className="flex-1 md:flex-initial">
            <Link href="/dashboard/orcamentos/novo">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Orçamento
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Orçamentos</CardTitle>
          <CardDescription>Visualize e gerencie os orçamentos da oficina.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockOrcamentosData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Orçamento</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor Total (R$)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrcamentosData.map((orcamento) => (
                  <TableRow key={orcamento.id}>
                    <TableCell className="font-medium">{orcamento.id}</TableCell>
                    <TableCell>{getClienteNome(orcamento.clienteId)}</TableCell>
                    <TableCell>{getVeiculoDescricao(orcamento.veiculoId)}</TableCell>
                    <TableCell>{format(new Date(orcamento.dataOrcamento), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell className="text-right">{orcamento.totalGeral.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadgeVariant(orcamento.status)}>{getStatusLabel(orcamento.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild title="Visualizar">
                        <Link href={`/dashboard/orcamentos/${orcamento.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" title="Editar" onClick={() => toast({ title: "Edição em desenvolvimento"})}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Imprimir" onClick={() => toast({ title: "Impressão em desenvolvimento"})}>
                        <Printer className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p>Nenhum orçamento encontrado.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Total de {mockOrcamentosData.length} orçamentos listados.</p>
        </CardFooter>
      </Card>
    </div>
  );
}

