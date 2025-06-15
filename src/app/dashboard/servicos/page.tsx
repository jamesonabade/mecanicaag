
"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Filter, Eye, Edit, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data - Em uma aplicação real, isso viria de uma API
const mockClientes = [
  { id: "cli001", nome: "João da Silva" },
  { id: "cli002", nome: "Maria Oliveira" },
  { id: "cli003", nome: "Carlos Pereira" },
  { id: "cli004", nome: "Ana Costa" },
];

const mockVeiculos = [
  { id: "vec001", clienteId: "cli001", modelo: "Honda Civic", placa: "ABC-1234" },
  { id: "vec002", clienteId: "cli001", modelo: "Fiat Strada", placa: "DEF-5678" },
  { id: "vec003", clienteId: "cli002", modelo: "Toyota Corolla", placa: "GHI-9012" },
  { id: "vec004", clienteId: "cli003", modelo: "VW Nivus", placa: "JKL-3456" },
  { id: "vec005", clienteId: "cli004", modelo: "Hyundai HB20", placa: "MNO-7890" },
];

const mockMecanicos = [
  { id: "mec001", nome: "Carlos Alberto" },
  { id: "mec002", nome: "Pedro Henrique" },
  { id: "mec003", nome: "Ana Beatriz" },
];

const mockOrdensServico = [
  {
    id: "OS001",
    clienteId: "cli001",
    veiculoId: "vec001",
    dataEntrada: "2024-07-25T10:00:00Z",
    mecanicoId: "mec001",
    tipoServico: "Revisão Completa",
    status: "Em Andamento",
    valorEstimado: 550.00,
  },
  {
    id: "OS002",
    clienteId: "cli002",
    veiculoId: "vec003",
    dataEntrada: "2024-07-26T14:30:00Z",
    mecanicoId: "mec002",
    tipoServico: "Troca de pastilhas de freio",
    status: "Aguardando Aprovação",
    valorEstimado: 320.50,
  },
  {
    id: "OS003",
    clienteId: "cli003",
    veiculoId: "vec004",
    dataEntrada: "2024-07-27T09:15:00Z",
    mecanicoId: "mec001",
    tipoServico: "Diagnóstico de Motor",
    status: "Concluída",
    valorEstimado: 180.00,
  },
  {
    id: "OS004",
    clienteId: "cli001",
    veiculoId: "vec002",
    dataEntrada: "2024-07-28T11:00:00Z",
    mecanicoId: null,
    tipoServico: "Verificação de suspensão",
    status: "Aguardando Diagnóstico",
    valorEstimado: 0,
  },
  {
    id: "OS005",
    clienteId: "cli004",
    veiculoId: "vec005",
    dataEntrada: "2024-07-29T08:00:00Z",
    mecanicoId: "mec003",
    tipoServico: "Alinhamento e Balanceamento",
    status: "Aguardando Peças",
    valorEstimado: 150.00,
  },
   {
    id: "OS006",
    clienteId: "cli002",
    veiculoId: "vec003",
    dataEntrada: "2024-07-29T16:00:00Z",
    mecanicoId: "mec002",
    tipoServico: "Reparo Elétrico",
    status: "Cancelada",
    valorEstimado: 280.00,
  },
];

type OSStatus = "Aguardando Diagnóstico" | "Aguardando Orçamento" | "Aguardando Aprovação" | "Aguardando Peças" | "Em Andamento" | "Concluída" | "Cancelada";

const statusOptions: { value: OSStatus; label: string }[] = [
  { value: "Aguardando Diagnóstico", label: "Aguardando Diagnóstico" },
  { value: "Aguardando Orçamento", label: "Aguardando Orçamento" },
  { value: "Aguardando Aprovação", label: "Aguardando Aprovação" },
  { value: "Aguardando Peças", label: "Aguardando Peças" },
  { value: "Em Andamento", label: "Em Andamento" },
  { value: "Concluída", label: "Concluída" },
  { value: "Cancelada", label: "Cancelada" },
];


export default function ServicosPage() {
  const { toast } = useToast();

  const getClienteNome = (clienteId: string) => mockClientes.find(c => c.id === clienteId)?.nome || "N/A";
  const getVeiculoDesc = (veiculoId: string) => {
    const veiculo = mockVeiculos.find(v => v.id === veiculoId);
    return veiculo ? `${veiculo.modelo} (${veiculo.placa})` : "N/A";
  };
  const getMecanicoNome = (mecanicoId: string | null) => mockMecanicos.find(m => m.id === mecanicoId)?.nome || "Não atribuído";

  const getStatusBadgeVariant = (status: OSStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Concluída": return "default"; // Shadcn 'default' is often blueish/greenish, good for completed
      case "Em Andamento": return "outline"; // Using outline for in-progress can be a different color like blue
      case "Aguardando Aprovação":
      case "Aguardando Diagnóstico":
      case "Aguardando Orçamento":
      case "Aguardando Peças":
        return "secondary"; // Yellow/Orange like, use secondary
      case "Cancelada": return "destructive"; // Red
      default: return "secondary";
    }
  };

  const handleSimulatedFilter = (type: string) => {
    toast({ title: `Filtro de ${type} (Simulado)`, description: "Funcionalidade de filtro será implementada." });
  };
  
  const handleAction = (action: string, osId: string) => {
      toast({ title: `${action} OS ${osId} (Simulado)`, description: `A ação de ${action.toLowerCase()} para a OS ${osId} será implementada.`});
  };


  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">Gestão de Ordens de Serviço</h1>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/servicos/novo">
            <PlusCircle className="mr-2 h-4 w-4" /> Nova Ordem de Serviço
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
            <CardTitle>Filtrar Ordens de Serviço</CardTitle>
            <CardDescription>Busque e filtre as OS por diversos critérios.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="searchOS" className="block text-sm font-medium text-muted-foreground mb-1">
                    Buscar por Nº OS, Cliente, Placa...
                    </label>
                    <Input id="searchOS" type="text" placeholder="Digite para buscar..." className="h-9" />
                </div>
                <div>
                    <label htmlFor="filterStatus" className="block text-sm font-medium text-muted-foreground mb-1">
                    Status
                    </label>
                    <Select onValueChange={() => handleSimulatedFilter("Status")}>
                        <SelectTrigger id="filterStatus" className="h-9">
                            <SelectValue placeholder="Todos os Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos os Status</SelectItem>
                            {statusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="filterMecanico" className="block text-sm font-medium text-muted-foreground mb-1">
                    Mecânico
                    </label>
                    <Select onValueChange={() => handleSimulatedFilter("Mecânico")}>
                        <SelectTrigger id="filterMecanico" className="h-9">
                            <SelectValue placeholder="Todos os Mecânicos" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="todos">Todos os Mecânicos</SelectItem>
                            {mockMecanicos.map(mec => <SelectItem key={mec.id} value={mec.id}>{mec.nome}</SelectItem>)}
                             <SelectItem value="nao_atribuido">Não Atribuído</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button onClick={() => handleSimulatedFilter("Busca Geral")} className="w-full mt-4 sm:mt-0 sm:w-auto h-9">
                <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Ordens de Serviço</CardTitle>
          <CardDescription>Acompanhe o status e gerencie as OS da oficina.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockOrdensServico.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº OS</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Data Entrada</TableHead>
                  <TableHead>Serviço Principal</TableHead>
                  <TableHead>Mecânico</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Valor Est. (R$)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOrdensServico.map((os) => (
                  <TableRow key={os.id}>
                    <TableCell className="font-medium">{os.id}</TableCell>
                    <TableCell>{getClienteNome(os.clienteId)}</TableCell>
                    <TableCell>{getVeiculoDesc(os.veiculoId)}</TableCell>
                    <TableCell>{format(new Date(os.dataEntrada), "dd/MM/yy HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell className="max-w-[150px] truncate" title={os.tipoServico}>{os.tipoServico}</TableCell>
                    <TableCell>{getMecanicoNome(os.mecanicoId)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadgeVariant(os.status as OSStatus)} className="text-xs">
                        {os.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{os.valorEstimado > 0 ? os.valorEstimado.toFixed(2) : "-"}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" asChild title="Visualizar Detalhes">
                        {/* No futuro: <Link href={`/dashboard/servicos/${os.id}`}> */}
                        <span onClick={() => handleAction("Visualizar", os.id)} className="cursor-pointer">
                          <Eye className="h-4 w-4" />
                        </span>
                      </Button>
                      <Button variant="ghost" size="icon" title="Editar OS" onClick={() => handleAction("Editar", os.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                       { (os.status === "Aguardando Diagnóstico" || os.status === "Aguardando Orçamento") &&
                         <Button variant="ghost" size="icon" title="Gerar Orçamento" onClick={() => handleAction("Gerar Orçamento para", os.id)}>
                            <FileText className="h-4 w-4" />
                        </Button>
                       }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p>Nenhuma Ordem de Serviço encontrada.</p>
              <p className="text-sm">Clique em "Nova Ordem de Serviço" para começar.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Total de {mockOrdensServico.length} ordens de serviço listadas.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
    
