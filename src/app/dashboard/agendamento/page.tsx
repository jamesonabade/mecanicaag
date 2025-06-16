
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; // Added import for Badge
import { PlusCircle, ListFilter, Search } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getMecanicos, Funcionario, getFuncionarioById } from "@/lib/mockData/funcionarios";
import { getClienteById } from "@/lib/mockData/clientes"; 
import { getVeiculoById } from "@/lib/mockData/veiculos";

// Mock data (adaptado do dashboard/page.tsx)
interface Agendamento {
  id: string;
  data: string; // ISO string
  horario: string;
  clienteId: string;
  veiculoId: string;
  servico: string;
  mecanicoId: string | null;
  status: AgendamentoStatus;
}

type AgendamentoStatus = "Confirmado" | "Aguardando" | "Chegou" | "Realizado" | "Cancelado" | "Todos";

const agendamentosMockData: Agendamento[] = [
  { id: "ag001", data: "2024-07-29T09:00:00Z", horario: "09:00", clienteId: "cli_modelo_001", veiculoId: "vec_modelo_001", servico: "Revisão Periódica", mecanicoId: "func002", status: "Confirmado" },
  { id: "ag002", data: "2024-07-29T10:30:00Z", horario: "10:30", clienteId: "cli_002_maria", veiculoId: "vec_003_corolla", servico: "Troca de Óleo", mecanicoId: "func003", status: "Confirmado" },
  { id: "ag003", data: "2024-07-30T14:00:00Z", horario: "14:00", clienteId: "cli_modelo_001", veiculoId: "vec_002_strada", servico: "Diagnóstico de Freios", mecanicoId: "func002", status: "Aguardando" },
  { id: "ag004", data: "2024-07-30T16:00:00Z", horario: "16:00", clienteId: "cli_003_carlos", veiculoId: "vec_004_nivus", servico: "Alinhamento", mecanicoId: "func006", status: "Chegou" },
  { id: "ag005", data: "2024-08-01T11:00:00Z", horario: "11:00", clienteId: "cli_004_ana", veiculoId: "vec_005_hb20", servico: "Revisão dos 10.000km", mecanicoId: "func003", status: "Confirmado" },
  { id: "ag006", data: new Date(Date.UTC(2024, 6, 15, 15, 0, 0)).toISOString(), horario: "15:00", clienteId: "cli_modelo_001", veiculoId: "vec_modelo_001", servico: "Teste de Agendamento", mecanicoId: null, status: "Cancelado"},
];

const agendamentoStatusOptions: { value: AgendamentoStatus; label: string }[] = [
  { value: "Todos", label: "Todos os Status" },
  { value: "Confirmado", label: "Confirmado" },
  { value: "Aguardando", label: "Aguardando Chegada" },
  { value: "Chegou", label: "Veículo na Oficina" },
  { value: "Realizado", label: "Realizado" },
  { value: "Cancelado", label: "Cancelado" },
];


export default function AgendamentoPage() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [minCalendarDate, setMinCalendarDate] = React.useState<Date | null>(null);
  const { toast } = useToast();

  const [mecanicos, setMecanicos] = useState<Funcionario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mecanicoFilter, setMecanicoFilter] = useState<string>("Todos");
  const [statusFilterAgendamento, setStatusFilterAgendamento] = useState<AgendamentoStatus>("Todos");

  useEffect(() => {
    setDate(new Date());
    setMinCalendarDate(new Date(new Date().setHours(0,0,0,0)));
    setMecanicos([{ id: "Todos", nome: "Todos os Mecânicos" }, ...getMecanicos()]);
  }, []);

  const getNomeCliente = (clienteId: string) => getClienteById(clienteId)?.nomeCompleto || "N/A";
  const getDescVeiculo = (veiculoId: string) => {
      const v = getVeiculoById(veiculoId);
      return v ? `${v.marca} ${v.modelo} (${v.placa})` : "N/A";
  };
  const getNomeMecanico = (mecanicoId: string | null) => getFuncionarioById(mecanicoId || "")?.nome || "Não atribuído";

  const mappedAgendamentos = useMemo(() => {
    return agendamentosMockData.map(ag => ({
      ...ag,
      clienteNome: getNomeCliente(ag.clienteId),
      veiculoDesc: getDescVeiculo(ag.veiculoId),
      mecanicoNome: getNomeMecanico(ag.mecanicoId),
      dataObj: parseISO(ag.data),
    }));
  }, []);

  const filteredAgendamentos = useMemo(() => {
    return mappedAgendamentos.filter(ag => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = 
        ag.clienteNome.toLowerCase().includes(searchTermLower) ||
        ag.veiculoDesc.toLowerCase().includes(searchTermLower) ||
        ag.servico.toLowerCase().includes(searchTermLower);
      
      const matchesMecanico = mecanicoFilter === "Todos" || ag.mecanicoId === mecanicoFilter || (mecanicoFilter === "NaoAtribuido" && !ag.mecanicoId) ;
      const matchesStatus = statusFilterAgendamento === "Todos" || ag.status === statusFilterAgendamento;
      const matchesDate = date ? isSameDay(ag.dataObj, date) : true;

      return matchesSearchTerm && matchesMecanico && matchesStatus && matchesDate;
    });
  }, [mappedAgendamentos, searchTerm, mecanicoFilter, statusFilterAgendamento, date]);


  const handleAdvancedFilter = () => {
    toast({
      title: "Filtros Avançados (Em Desenvolvimento)",
      description: "Mais opções de filtro serão adicionadas aqui.",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">Agendamento Inteligente</h1>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/agendamento/novo">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Agendamento
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Filtrar Agenda</CardTitle>
          <CardDescription>Busque por cliente, veículo, serviço ou filtre por mecânico e status.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="searchAgendamento" className="block text-sm font-medium text-muted-foreground mb-1">
                Buscar (Cliente, Veículo, Serviço)
              </label>
              <Input
                id="searchAgendamento"
                type="text"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <label htmlFor="filterMecanicoAgenda" className="block text-sm font-medium text-muted-foreground mb-1">
                Mecânico
              </label>
              <Select value={mecanicoFilter} onValueChange={setMecanicoFilter}>
                <SelectTrigger id="filterMecanicoAgenda" className="h-9">
                  <SelectValue placeholder="Todos os Mecânicos" />
                </SelectTrigger>
                <SelectContent>
                  {mecanicos.map(m => <SelectItem key={m.id} value={m.id}>{m.nome}</SelectItem>)}
                  <SelectItem value="NaoAtribuido">Não Atribuído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="filterStatusAgenda" className="block text-sm font-medium text-muted-foreground mb-1">
                Status do Agendamento
              </label>
              <Select value={statusFilterAgendamento} onValueChange={(value) => setStatusFilterAgendamento(value as AgendamentoStatus)}>
                <SelectTrigger id="filterStatusAgenda" className="h-9">
                  <SelectValue placeholder="Todos os Status" />
                </SelectTrigger>
                <SelectContent>
                  {agendamentoStatusOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            <Button onClick={() => toast({title: "Filtros Aplicados"})} className="h-9 flex-1 sm:flex-initial">
              <Search className="mr-2 h-4 w-4" /> Aplicar
            </Button>
            <Button variant="outline" onClick={handleAdvancedFilter} className="h-9 flex-1 sm:flex-initial">
              <ListFilter className="mr-2 h-4 w-4" /> Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-lg">
           <CardHeader>
            <CardTitle>Calendário</CardTitle>
            <CardDescription>Selecione um dia para ver os agendamentos.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
              disabled={(d) => minCalendarDate ? d < minCalendarDate : true}
              className="rounded-md border"
              locale={ptBR}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>
                Agendamentos para {date ? format(date, "dd 'de' MMMM 'de' yyyy", {locale: ptBR}) : "Hoje"}
            </CardTitle>
            <CardDescription>Lista dos serviços agendados para o dia selecionado.</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAgendamentos.length > 0 ? (
              <div className="space-y-3">
                {filteredAgendamentos.map(ag => (
                  <Card key={ag.id} className="p-3 hover:shadow-md">
                    <p className="font-semibold text-sm">{ag.horario} - {ag.servico}</p>
                    <p className="text-xs text-muted-foreground">Cliente: {ag.clienteNome}</p>
                    <p className="text-xs text-muted-foreground">Veículo: {ag.veiculoDesc}</p>
                    <p className="text-xs text-muted-foreground">Mecânico: {ag.mecanicoNome}</p>
                    <Badge variant={ag.status === "Confirmado" ? "default" : ag.status === "Cancelado" ? "destructive" : "secondary"} className="mt-1 text-xs">
                      {ag.status}
                    </Badge>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground border-2 border-dashed rounded-lg h-full flex flex-col justify-center">
                <p>Nenhum agendamento encontrado para os critérios selecionados.</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Total de {filteredAgendamentos.length} agendamentos para {date ? format(date, "dd/MM/yyyy") : "o dia selecionado"}.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
