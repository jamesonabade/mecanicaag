
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Filter, Eye, Edit, FileText, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getClienteById, Cliente } from "@/lib/mockData/clientes";
import { getVeiculoById, Veiculo } from "@/lib/mockData/veiculos";
import { getMecanicos, Funcionario, getFuncionarioById } from "@/lib/mockData/funcionarios";
import { Skeleton } from "@/components/ui/skeleton";


export interface ItemOS {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'servico' | 'peca';
  quantidade?: number;
}

interface FotoOS {
    url: string;
    legenda: string;
    dataAiHint?: string;
}

// Interface para informações de um checklist preenchido vinculado a uma OS
export interface FilledChecklistInfo {
  id: string; // ID único desta instância preenchida
  modelId: string; // ID do modelo de checklist usado
  modelName: string; // Nome do modelo de checklist
  dataPreenchimento: string; // ISOString
  responsavel: string; // Nome do responsável pelo preenchimento
  // As respostas detalhadas ficariam dentro do objeto da OS ou seriam buscadas separadamente
}


export const mockOrdensServico = [
  {
    id: "OS001",
    clienteId: "cli_modelo_001",
    veiculoId: "vec_modelo_001",
    dataEntrada: "2024-07-25T10:00:00Z",
    dataPrevisaoEntrega: "2024-07-26T17:00:00Z",
    mecanicoId: "func002", // Carlos Alberto
    tipoServico: "Revisão Completa (Preventiva)", // Nome do serviço do catálogo
    descricaoProblema: "Cliente solicitou revisão completa dos 25.000km. Verificar freios, suspensão e trocar óleo/filtros.",
    servicosPecasPlanejadas: "Óleo 5W30 Sintético (4L)\nFiltro de Óleo\nFiltro de Ar\nFiltro de Combustível\nAlinhamento e Balanceamento",
    observacoesInternas: "Veículo chegou com barulho leve na suspensão dianteira direita. Verificar durante a revisão.",
    status: "Em Andamento",
    valorEstimado: 650.00, // Valor do serviço principal do catálogo
    valorFinal: 0, // Será calculado com base nos itens executados
    itensExecutados: [
      {id: "item1_os1", descricao: "Troca de Óleo e Filtro", valor: 180.00, tipo: "servico" as const},
      {id: "item2_os1", descricao: "Óleo 5W30 Sintético", valor: 45.00, quantidade: 4, tipo: "peca" as const},
      {id: "item3_os1", descricao: "Filtro de Óleo", valor: 35.00, quantidade: 1, tipo: "peca" as const},
    ] as ItemOS[],
    diagnosticoTecnico: "Suspensão dianteira direita com folga na bandeja. Necessário orçamento adicional para substituição.",
    fotos: [
      {url: "https://placehold.co/300x200.png", legenda: "Entrada do veículo", dataAiHint: "car service"},
      {url: "https://placehold.co/300x200.png", legenda: "Motor antes da limpeza", dataAiHint: "engine detail"},
    ] as FotoOS[],
    checklistsPreenchidos: [] as FilledChecklistInfo[],
  },
  {
    id: "OS002",
    clienteId: "cli_002_maria",
    veiculoId: "vec_003_corolla",
    dataEntrada: "2024-07-26T14:30:00Z",
    dataPrevisaoEntrega: "2024-07-27T18:00:00Z",
    mecanicoId: "func003", // Pedro Henrique
    tipoServico: "Serviço Freios Dianteiros (Pastilhas)",
    descricaoProblema: "Pastilhas de freio fazendo barulho e pedal baixo.",
    servicosPecasPlanejadas: "Jogo de Pastilhas de Freio Dianteiras\nFluido de Freio DOT4",
    observacoesInternas: "Verificar discos de freio, podem precisar de retífica.",
    status: "Aguardando Aprovação",
    valorEstimado: 220.00,
    valorFinal: 0,
    itensExecutados: [] as ItemOS[],
    diagnosticoTecnico: null,
    fotos: [] as FotoOS[],
    checklistsPreenchidos: [] as FilledChecklistInfo[],
  },
  {
    id: "OS003",
    clienteId: "cli_003_carlos",
    veiculoId: "vec_004_nivus",
    dataEntrada: "2024-07-27T09:15:00Z",
    dataPrevisaoEntrega: "2024-07-27T12:00:00Z",
    mecanicoId: "func002", // Carlos Alberto
    tipoServico: "Diagnóstico com Scanner",
    descricaoProblema: "Luz da injeção acesa no painel e falha em baixa rotação.",
    servicosPecasPlanejadas: "Diagnóstico com scanner\nVerificação de velas e bicos",
    observacoesInternas: "",
    status: "Concluída",
    valorEstimado: 150.00,
    valorFinal: 150.00,
    itensExecutados: [{id: "item1_os3", descricao: "Diagnóstico com Scanner", valor: 150.00, tipo: "servico" as const}] as ItemOS[],
    diagnosticoTecnico: "Bobina do cilindro 3 com defeito. Substituição recomendada em orçamento futuro.",
    fotos: [] as FotoOS[],
    checklistsPreenchidos: [
        { id: "filled_chk_os003_1", modelId: "chk_model_001", modelName: "Checklist de Inspeção Veicular Pré-Serviço", dataPreenchimento: "2024-07-27T09:20:00Z", responsavel: "Carlos Alberto" }
    ] as FilledChecklistInfo[],
  },
  {
    id: "OS004",
    clienteId: "cli_modelo_001",
    veiculoId: "vec_002_strada",
    dataEntrada: "2024-07-28T11:00:00Z",
    dataPrevisaoEntrega: "2024-07-29T10:00:00Z",
    mecanicoId: null,
    tipoServico: "Diagnóstico de Suspensão",
    descricaoProblema: "Barulho na suspensão traseira ao passar em lombadas.",
    servicosPecasPlanejadas: "Inspeção da suspensão traseira.",
    observacoesInternas: "Cliente informou que o barulho começou após viagem longa.",
    status: "Aguardando Diagnóstico",
    valorEstimado: 100.00,
    valorFinal: 0,
    itensExecutados: [] as ItemOS[],
    diagnosticoTecnico: null,
    fotos: [] as FotoOS[],
    checklistsPreenchidos: [] as FilledChecklistInfo[],
  },
  {
    id: "OS005",
    clienteId: "cli_004_ana",
    veiculoId: "vec_005_hb20",
    dataEntrada: "2024-07-29T08:00:00Z",
    dataPrevisaoEntrega: "2024-07-29T17:00:00Z",
    mecanicoId: "func006", // Juliana Alves
    tipoServico: "Alinhamento e Balanceamento (4 rodas)",
    descricaoProblema: "Veículo puxando para a direita e volante vibrando em alta velocidade.",
    servicosPecasPlanejadas: "Alinhamento de direção\nBalanceamento das 4 rodas",
    observacoesInternas: "Pneus aparentemente em bom estado.",
    status: "Aguardando Peças",
    valorEstimado: 120.00,
    valorFinal: 0,
    itensExecutados: [] as ItemOS[],
    diagnosticoTecnico: null,
    fotos: [] as FotoOS[],
    checklistsPreenchidos: [] as FilledChecklistInfo[],
  },
   {
    id: "OS006",
    clienteId: "cli_002_maria",
    veiculoId: "vec_003_corolla",
    dataEntrada: "2024-07-29T16:00:00Z",
    dataPrevisaoEntrega: "2024-07-30T12:00:00Z",
    mecanicoId: "func003", // Pedro Henrique
    tipoServico: "Verificação Elétrica Básica",
    descricaoProblema: "Farol baixo do lado esquerdo não acende.",
    servicosPecasPlanejadas: "Diagnóstico elétrico\nPossível troca de lâmpada ou reparo no chicote",
    observacoesInternas: "Cliente já trocou a lâmpada e o problema persistiu.",
    status: "Cancelada",
    valorEstimado: 90.00,
    valorFinal: 0,
    itensExecutados: [] as ItemOS[],
    diagnosticoTecnico: null,
    fotos: [] as FotoOS[],
    checklistsPreenchidos: [] as FilledChecklistInfo[],
  },
];

export type OSStatus = "Aguardando Diagnóstico" | "Aguardando Orçamento" | "Aguardando Aprovação" | "Aguardando Peças" | "Em Andamento" | "Concluída" | "Cancelada";

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
  const [mecanicos, setMecanicos] = React.useState<Funcionario[]>([]);
  const [ordensServico, setOrdensServico] = useState<typeof mockOrdensServico>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OSStatus | "Todos">("Todos");
  const [mecanicoFilter, setMecanicoFilter] = useState<string>("Todos");


  React.useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setOrdensServico(mockOrdensServico);
      setMecanicos(getMecanicos());
      setIsLoading(false);
    }, 700); // Simulate 0.7 second delay
    return () => clearTimeout(timer);
  }, []);

  const getClienteNome = (clienteId: string) => getClienteById(clienteId)?.nomeCompleto || "N/A";
  const getVeiculoDesc = (veiculoId: string) => {
    const veiculo = getVeiculoById(veiculoId);
    return veiculo ? `${veiculo.marca} ${veiculo.modelo} (${veiculo.placa})` : "N/A";
  };
  const getMecanicoNome = (mecanicoId: string | null) => getFuncionarioById(mecanicoId || "")?.nome || "Não atribuído";

  const getStatusBadgeVariant = (status: OSStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Concluída": return "default";
      case "Em Andamento": return "outline";
      case "Aguardando Aprovação":
      case "Aguardando Diagnóstico":
      case "Aguardando Orçamento":
      case "Aguardando Peças":
        return "secondary";
      case "Cancelada": return "destructive";
      default: return "secondary";
    }
  };

  const filteredOS = useMemo(() => {
    return ordensServico.filter(os => {
      const termLower = searchTerm.toLowerCase();
      const matchesSearch =
        os.id.toLowerCase().includes(termLower) ||
        getClienteNome(os.clienteId).toLowerCase().includes(termLower) ||
        getVeiculoDesc(os.veiculoId).toLowerCase().includes(termLower) ||
        os.tipoServico.toLowerCase().includes(termLower);

      const matchesStatus = statusFilter === "Todos" || os.status === statusFilter;
      const matchesMecanico = mecanicoFilter === "Todos" || os.mecanicoId === mecanicoFilter || (mecanicoFilter === "NaoAtribuido" && !os.mecanicoId);

      return matchesSearch && matchesStatus && matchesMecanico;
    });
  }, [ordensServico, searchTerm, statusFilter, mecanicoFilter]);


  const handleAction = (action: string, osId: string) => {
      if (action === "Gerar Orçamento para") {
        toast({ title: `${action} OS ${osId} (Simulado)`, description: `A OS ${osId} seria associada a um novo orçamento ou um existente.`});
      } else {
        toast({ title: `${action} OS ${osId} (Simulado)`, description: `A ação de ${action.toLowerCase()} para a OS ${osId} será implementada.`});
      }
  };

  const renderSkeletonTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          {[...Array(9)].map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            {[...Array(8)].map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}
            <TableCell className="text-right space-x-1">
              <Skeleton className="h-8 w-8 inline-block" />
              <Skeleton className="h-8 w-8 inline-block" />
              <Skeleton className="h-8 w-8 inline-block" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );


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
                    <Input id="searchOS" type="text" placeholder="Digite para buscar..." className="h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="filterStatus" className="block text-sm font-medium text-muted-foreground mb-1">
                    Status
                    </label>
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OSStatus | "Todos")}>
                        <SelectTrigger id="filterStatus" className="h-9">
                            <SelectValue placeholder="Todos os Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todos os Status</SelectItem>
                            {statusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="filterMecanico" className="block text-sm font-medium text-muted-foreground mb-1">
                    Mecânico
                    </label>
                    <Select value={mecanicoFilter} onValueChange={setMecanicoFilter}>
                        <SelectTrigger id="filterMecanico" className="h-9">
                            <SelectValue placeholder="Todos os Mecânicos" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="Todos">Todos os Mecânicos</SelectItem>
                            {mecanicos.map(mec => <SelectItem key={mec.id} value={mec.id}>{mec.nome}</SelectItem>)}
                             <SelectItem value="NaoAtribuido">Não Atribuído</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button onClick={() => toast({title: "Filtros aplicados!"})} className="w-full mt-4 sm:mt-0 sm:w-auto h-9">
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
          {isLoading ? renderSkeletonTable() :
           filteredOS.length > 0 ? (
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
                {filteredOS.map((os) => (
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
                    <TableCell className="text-right">{os.valorEstimado && os.valorEstimado > 0 ? os.valorEstimado.toFixed(2) : "-"}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" asChild title="Visualizar Detalhes">
                        <Link href={`/dashboard/servicos/${os.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
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
              <p>Nenhuma Ordem de Serviço encontrada com os filtros atuais.</p>
              {searchTerm === "" && statusFilter === "Todos" && mecanicoFilter === "Todos" && (
                <p className="text-sm">Clique em "Nova Ordem de Serviço" para começar.</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Total de {filteredOS.length} ordens de serviço listadas.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
