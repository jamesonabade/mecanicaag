
"use client";

import React, { useState, useEffect, useMemo, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isSameDay, parseISO, isPast, differenceInDays, addDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

import {
  DollarSign,
  Users,
  Wrench,
  Package,
  Settings as SettingsIcon,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  FileText,
  ShoppingCart,
  UserPlus,
  CalendarDays,
  AlertCircle,
  CheckCircle,
  ClockIcon,
  ChevronRight,
  AlertTriangle, 
  PackageSearch,
  CalendarClock, 
  Send, 
  Search, 
  Filter,
  Link2 
} from "lucide-react";


const kpiData = [
  { title: "Receita Hoje", value: "R$ 0,00", previousValue: "R$ 2.340,00", change: "-100%", icon: DollarSign, color: "text-green-400", changeType: "negative" as const },
  { title: "Clientes Hoje", value: "0", previousValue: "12", change: "-100%", icon: Users, color: "text-purple-400", changeType: "negative" as const },
  { title: "Ordens Hoje", value: "2", previousValue: "R$ 1.450,00", change: "-0%", icon: Wrench, color: "text-blue-400", changeType: "neutral" as const },
  { title: "Produtos Hoje", value: "2", previousValue: "R$ 1.420,00", change: "-0%", icon: Package, color: "text-teal-400", changeType: "neutral" as const },
  { title: "Serviços Hoje", value: "3", previousValue: "R$ 230,00", change: "-0%", icon: SettingsIcon, color: "text-amber-400", changeType: "neutral" as const },
];

const financialKpiData = [
  { title: "Contas a Receber", value: "R$ 12.345,00", description: "Vencendo nos próximos 30 dias", icon: TrendingUp, trend: "up" as const },
  { title: "Contas a Pagar", value: "R$ 4.567,00", description: "Vencendo nos próximos 30 dias", icon: FileText, trend: "down" as const },
  { title: "Faturamento Mês", value: "R$ 28.789,00", description: "Meta: R$ 35.000 (82%)", icon: DollarSign, trend: "up" as const, progress: 82 },
  { title: "Ticket Médio", value: "R$ 350,00", description: "Mês atual", icon: ShoppingCart, trend: "neutral" as const },
];

// Static dates for mock data to ensure hydration stability
const MOCK_TODAY_ISO = new Date(Date.UTC(2024, 7, 1, 0, 0, 0)).toISOString().split('T')[0]; // Example: Aug 1, 2024
const MOCK_YESTERDAY_ISO = new Date(Date.UTC(2024, 6, 31, 0, 0, 0)).toISOString().split('T')[0]; // Example: Jul 31, 2024

const contasAPagarAlertasMock = [
  { id: "cp001", descricao: "Fornecedor AutoPeças Gama", valor: "R$ 1.250,70", dataVencimento: MOCK_TODAY_ISO, tipo: "Peças Urgentes" },
  { id: "cp002", descricao: "Aluguel da Oficina - Mês Corrente", valor: "R$ 3.500,00", dataVencimento: "2024-08-05", tipo: "Despesa Fixa" },
  { id: "cp003", descricao: "Mensalidade Software CRM", valor: "R$ 280,00", dataVencimento: MOCK_YESTERDAY_ISO, tipo: "Software" }, // Vencido
  { id: "cp004", descricao: "Conta de Energia Elétrica", valor: "R$ 450,00", dataVencimento: "2024-08-10", tipo: "Concessionária" },
  { id: "cp005", descricao: "Compra de Ferramentas Especiais", valor: "R$ 870,00", dataVencimento: "2024-08-03", tipo: "Investimento" },
  { id: "cp006", descricao: "Pagamento Impostos SIMPLES", valor: "R$ 1.800,00", dataVencimento: "2024-08-02", tipo: "Impostos" },
];


const lucroChartData = [
  { name: 'Jan', lucro: 4000, orcamento: 2400 },
  { name: 'Fev', lucro: 3000, orcamento: 1398 },
  { name: 'Mar', lucro: 2000, orcamento: 9800 },
  { name: 'Abr', lucro: 2780, orcamento: 3908 },
  { name: 'Mai', lucro: 1890, orcamento: 4800 },
  { name: 'Jun', lucro: 2390, orcamento: 3800 },
  { name: 'Jul', lucro: 3490, orcamento: 4300 },
];
const chartConfigLucro = {
  lucro: { label: "Lucro Real", color: "hsl(var(--chart-2))" },
  orcamento: { label: "Lucro Orçado", color: "hsl(var(--muted))" },
};

const vendasSemanaData = [
  { day: 'Seg', vendas: 2200 }, { day: 'Ter', vendas: 1800 }, { day: 'Qua', vendas: 3200 },
  { day: 'Qui', vendas: 2500 }, { day: 'Sex', vendas: 4100 }, { day: 'Sáb', vendas: 3000 },
  { day: 'Dom', vendas: 800 },
];
const chartConfigVendas = {
  vendas: { label: "Vendas", color: "hsl(var(--primary))" },
};

const osStatusData = [
  { name: 'Concluídas', value: 120, fill: 'hsl(var(--chart-1))' },
  { name: 'Em Andamento', value: 25, fill: 'hsl(var(--chart-2))' },
  { name: 'Aguardando Peças', value: 10, fill: 'hsl(var(--chart-3))' },
  { name: 'Canceladas', value: 5, fill: 'hsl(var(--destructive))' },
];

const clientesData = [
  { month: 'Jan', novos: 15, recorrentes: 45 }, { month: 'Fev', novos: 20, recorrentes: 50 },
  { month: 'Mar', novos: 18, recorrentes: 60 }, { month: 'Abr', novos: 25, recorrentes: 55 },
];
const chartConfigClientes = {
  novos: { label: "Novos Clientes", color: "hsl(var(--chart-4))" },
  recorrentes: { label: "Clientes Recorrentes", color: "hsl(var(--chart-5))" },
};

const ultimosClientes = [
  { id: 1, nome: "Ana Silva", veiculo: "Honda Civic", servico: "Revisão", data: "2024-07-28", avatar: "https://placehold.co/40x40.png?text=AS", dataAiHint: "woman portrait" },
  { id: 2, nome: "Bruno Costa", veiculo: "VW Gol", servico: "Troca de óleo", data: "2024-07-28", avatar: "https://placehold.co/40x40.png?text=BC", dataAiHint: "man portrait" },
  { id: 3, nome: "Carla Dias", veiculo: "Fiat Toro", servico: "Freios", data: "2024-07-27", avatar: "https://placehold.co/40x40.png?text=CD", dataAiHint: "professional woman" },
];

const topProdutosServicos = [
  { id: 1, nome: "Óleo Motor 5W30 Sintético", tipo: "Produto", vendas: 150, receita: "R$ 7.500,00" },
  { id: 2, nome: "Alinhamento e Balanceamento", tipo: "Serviço", vendas: 80, receita: "R$ 9.600,00" },
  { id: 3, nome: "Filtro de Ar Condicionado", tipo: "Produto", vendas: 120, receita: "R$ 3.600,00" },
];

const agendamentosMock = [
  { id: "ag001", data: "2024-07-29T09:00:00Z", horario: "09:00", cliente: "João da Silva", veiculo: "Honda Civic (ABC-1234)", servico: "Revisão Periódica", mecanico: "Carlos", status: "Confirmado" },
  { id: "ag002", data: "2024-07-29T10:30:00Z", horario: "10:30", cliente: "Maria Oliveira", veiculo: "Toyota Corolla (GHI-9012)", servico: "Troca de Óleo", mecanico: "Pedro", status: "Confirmado" },
  { id: "ag003", data: "2024-07-30T14:00:00Z", horario: "14:00", cliente: "Ana Costa", veiculo: "Fiat Strada (DEF-5678)", servico: "Diagnóstico de Freios", mecanico: "Carlos", status: "Aguardando" },
  { id: "ag004", data: "2024-07-30T16:00:00Z", horario: "16:00", cliente: "Roberto Lima", veiculo: "VW Gol (JKL-3456)", servico: "Alinhamento", mecanico: "Ana", status: "Chegou" },
  { id: "ag005", data: "2024-08-01T11:00:00Z", horario: "11:00", cliente: "Fernanda Souza", veiculo: "Hyundai HB20 (MNO-7890)", servico: "Revisão dos 10.000km", mecanico: "Pedro", status: "Confirmado" },
  // Static date for "today's" mock appointment to prevent hydration mismatch
  { id: "ag006", data: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 15, 0, 0)).toISOString(), horario: "15:00", cliente: "Cliente Teste Hoje", veiculo: "Carro Teste (XXX-0000)", servico: "Teste de Agendamento", mecanico: "Qualquer", status: "Confirmado"},
];

const ordensDeServicoConcluidasMock = [
  { id: "os001", clienteNome: "Juliana Alves", veiculoInfo: "VW Nivus - ABC1D23", dataConclusao: "2024-01-10", ultimoLembreteEnviado: null },
  { id: "os002", clienteNome: "Ricardo Mendes", veiculoInfo: "Chevrolet Onix - DEF4E56", dataConclusao: "2024-06-20", ultimoLembreteEnviado: null },
  { id: "os003", clienteNome: "Beatriz Costa", veiculoInfo: "Hyundai Creta - GHI7F89", dataConclusao: "2023-11-01", ultimoLembreteEnviado: "2024-04-29" }, 
  { id: "os004", clienteNome: "Fernando Lima", veiculoInfo: "Fiat Toro - JKL0G12", dataConclusao: "2023-12-05", ultimoLembreteEnviado: null },
  { id: "os005", clienteNome: "Laura Martins", veiculoInfo: "Jeep Renegade - MNO3P45", dataConclusao: "2024-02-01", ultimoLembreteEnviado: null }, // Static past date
  { id: "os006", clienteNome: "Pedro Barros", veiculoInfo: "Renault Kwid - QRS6T78", dataConclusao: "2024-07-01", ultimoLembreteEnviado: null }, // Static recent past date
];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [agendamentosDoDia, setAgendamentosDoDia] = useState<typeof agendamentosMock>([]);
  const [contasAPagarAlertas, setContasAPagarAlertas] = useState<typeof contasAPagarAlertasMock>([]);
  const { toast } = useToast(); 

  const [simulatedLembreteRevisaoAtivo, setSimulatedLembreteRevisaoAtivo] = useState(true);
  const [simulatedDiasParaRevisao, setSimulatedDiasParaRevisao] = useState(180);


  useEffect(() => {
    // Set initial date on client-side to avoid hydration mismatch with server-rendered "undefined"
    setSelectedDate(new Date()); 
  }, []);

  useEffect(() => {
    // Filter appointments and sort alerts once selectedDate is set
    if (selectedDate) {
      filterAppointmentsForDate(selectedDate);
    }
    setContasAPagarAlertas(
      [...contasAPagarAlertasMock].sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime())
    );
  }, [selectedDate]); // Re-run when selectedDate changes

  const scheduledDays = useMemo(() => {
    return agendamentosMock.map(ag => parseISO(ag.data));
  }, []);

  const filterAppointmentsForDate = (date: Date | undefined) => {
    if (date) {
      const filtered = agendamentosMock.filter(ag => isSameDay(parseISO(ag.data), date));
      setAgendamentosDoDia(filtered);
    } else {
      setAgendamentosDoDia([]);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // filterAppointmentsForDate(date); // This will be handled by the useEffect watching selectedDate
  };

  const clientesParaLembreteRevisao = useMemo(() => {
    if (!simulatedLembreteRevisaoAtivo) {
      return [];
    }
    const hoje = new Date(MOCK_TODAY_ISO + "T00:00:00Z"); // Use a consistent "today" for mock logic
    return ordensDeServicoConcluidasMock.filter(os => {
      if (os.ultimoLembreteEnviado) return false; 
      const dataConclusao = parseISO(os.dataConclusao + "T00:00:00Z");
      const dataLembrete = addDays(dataConclusao, simulatedDiasParaRevisao);
      // Check if dataLembrete is today or in the past relative to MOCK_TODAY_ISO
      return isSameDay(dataLembrete, hoje) || isBefore(dataLembrete, hoje);
    });
  }, [simulatedLembreteRevisaoAtivo, simulatedDiasParaRevisao]);

  const handleEnviarLembreteSimulado = (clienteNome: string) => {
    toast({
      title: "Lembrete Simulado",
      description: `Simulando envio de lembrete de revisão para ${clienteNome}.`,
    });
  };

  const handleSearchEstoque = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get("searchTermEstoque") as string;
    toast({
      title: "Busca no Estoque (Simulada)",
      description: `Buscando por: "${searchTerm}". Funcionalidade completa em desenvolvimento.`,
    });
    
  };

  const handleFilterEstoque = () => {
    toast({
      title: "Filtro de Estoque (Simulado)",
      description: "Opções de filtro de estoque serão implementadas aqui.",
    });
    
  };

  const handleConnectGoogleCalendar = () => {
    toast({
      title: "Integração com Google Agenda",
      description: "Funcionalidade de conexão com Google Agenda em desenvolvimento.",
    });
  };


  const kpiCardComponent = (kpi: typeof kpiData[0]) => (
    <Card key={kpi.title} className="shadow-md hover:shadow-lg transition-shadow bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
        <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground/80">{kpi.previousValue}</p>
          <Badge variant={kpi.changeType === "positive" ? "default" : kpi.changeType === "negative" ? "destructive" : "secondary"} className="text-xs">
            {kpi.changeType === "positive" ? <ArrowUp className="h-3 w-3 mr-1" /> : kpi.changeType === "negative" ? <ArrowDown className="h-3 w-3 mr-1" /> : null}
            {kpi.change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const financialKpiCardComponent = (kpi: typeof financialKpiData[0]) => (
    <Card key={kpi.title} className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">{kpi.title}</CardTitle>
            <kpi.icon className={`h-6 w-6 ${kpi.trend === "up" ? "text-green-500" : kpi.trend === "down" ? "text-red-500" : "text-muted-foreground" }`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-1">{kpi.value}</div>
        <p className="text-xs text-muted-foreground mb-2">{kpi.description}</p>
        {kpi.progress !== undefined && <Progress value={kpi.progress} className="h-2" />}
      </CardContent>
       <CardFooter className="pt-2 pb-4">
        <Button variant="link" size="sm" className="text-xs p-0 h-auto text-primary/80 hover:text-primary">
          Ver Relatório Detalhado <ChevronRight className="h-3 w-3 ml-1"/>
        </Button>
      </CardFooter>
    </Card>
  );

  const contasAPagarAlertsCard = (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <AlertCircle className="mr-2 h-6 w-6 text-amber-500" /> Alertas: Contas a Pagar
        </CardTitle>
        <CardDescription>Contas importantes que requerem sua atenção imediata.</CardDescription>
      </CardHeader>
      <CardContent>
        {contasAPagarAlertas.length > 0 ? (
          <ScrollArea className="max-h-[280px] pr-3">
            <div className="space-y-4">
              {contasAPagarAlertas.map(alerta => {
                const hoje = new Date(MOCK_TODAY_ISO + "T00:00:00Z"); // Use a consistent "today"
                const vencimentoDate = parseISO(alerta.dataVencimento + "T00:00:00Z");

                let statusText = "";
                let statusClasses = "border-border text-muted-foreground";
                let IconComponent = CalendarDays;
                let iconColorClass = "text-muted-foreground";

                if (isPast(vencimentoDate) && !isSameDay(vencimentoDate, hoje)) {
                  statusText = `Vencido em ${format(vencimentoDate, "dd/MM/yy", { locale: ptBR })}`;
                  statusClasses = "border-destructive/40 bg-destructive/10 text-destructive";
                  IconComponent = AlertTriangle;
                  iconColorClass = "text-destructive";
                } else if (isSameDay(vencimentoDate, hoje)) {
                  statusText = `Vence Hoje!`;
                  statusClasses = "border-amber-500/40 bg-amber-500/10 text-amber-600";
                  IconComponent = AlertTriangle;
                  iconColorClass = "text-amber-600";
                } else {
                  const diasParaVencer = differenceInDays(vencimentoDate, hoje); 
                  if (diasParaVencer <= 7 && diasParaVencer > 0) { // ensure it's in the future
                    statusText = `Vence em ${diasParaVencer} dia(s) (${format(vencimentoDate, "dd/MM/yy", { locale: ptBR })})`;
                    statusClasses = "border-yellow-500/40 bg-yellow-500/10 text-yellow-600";
                    IconComponent = ClockIcon;
                    iconColorClass = "text-yellow-600";
                  } else if (diasParaVencer > 0) {
                    statusText = `Vence em ${format(vencimentoDate, "dd/MM/yyyy", { locale: ptBR })}`;
                    IconComponent = CalendarDays;
                    iconColorClass = "text-muted-foreground";
                  } else { // Should not happen if sorted correctly and not past
                     statusText = `Vence em ${format(vencimentoDate, "dd/MM/yyyy", { locale: ptBR })}`;
                  }
                }

                return (
                  <div key={alerta.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg border ${statusClasses.split(' ')[0]} ${statusClasses.split(' ')[1]}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <IconComponent className={`h-6 w-6 sm:h-5 sm:w-5 shrink-0 ${iconColorClass}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" title={alerta.descricao}>{alerta.descricao} <span className="text-xs font-normal text-muted-foreground">({alerta.tipo})</span></p>
                        <p className={`text-xs ${statusClasses.split(' ')[2]}`}>{statusText}</p>
                      </div>
                    </div>
                    <div className="text-right mt-2 sm:mt-0 shrink-0">
                      <p className="font-bold text-base sm:text-sm">{alerta.valor}</p>
                       <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary/90 hover:text-primary mt-0.5" asChild>
                         <Link href={`/dashboard/financeiro/transacoes/${alerta.id}`}>Pagar/Ver</Link>
                       </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center text-muted-foreground h-full flex flex-col justify-center items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            <p>Ótimo! Nenhuma conta a pagar com alerta no momento.</p>
          </div>
        )}
      </CardContent>
      {contasAPagarAlertas.length > 0 && (
        <CardFooter className="pt-4 mt-2 border-t">
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                <Link href="/dashboard/financeiro?tab=contas-a-pagar">
                    <FileText className="mr-2 h-4 w-4"/> Ver Todas Contas a Pagar
                </Link>
            </Button>
        </CardFooter>
      )}
    </Card>
  );

const lembretesRevisaoCard = (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <CalendarClock className="mr-2 h-6 w-6 text-blue-500" /> Lembretes de Revisão Pendentes
        </CardTitle>
        <CardDescription>
          {simulatedLembreteRevisaoAtivo 
            ? `Clientes com revisão pendente (intervalo de ${simulatedDiasParaRevisao} dias pós-OS).`
            : "O sistema de lembretes de revisão pós-OS está desativado."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!simulatedLembreteRevisaoAtivo ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>Ative os lembretes na <Link href="/dashboard/configuracoes" className="underline text-primary">página de configurações</Link>.</p>
          </div>
        ) : clientesParaLembreteRevisao.length > 0 ? (
          <ScrollArea className="max-h-[280px] pr-3">
            <div className="space-y-3">
              {clientesParaLembreteRevisao.map(os => {
                const dataConclusao = parseISO(os.dataConclusao + "T00:00:00Z");
                const dataLembrete = addDays(dataConclusao, simulatedDiasParaRevisao);
                return (
                  <div key={os.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg border bg-muted/30">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" title={os.clienteNome}>{os.clienteNome}</p>
                      <p className="text-xs text-muted-foreground">{os.veiculoInfo}</p>
                      <p className="text-xs text-muted-foreground">
                        Última OS: {format(dataConclusao, "dd/MM/yy", { locale: ptBR })} | Lembrete em: {format(dataLembrete, "dd/MM/yy", { locale: ptBR })}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleEnviarLembreteSimulado(os.clienteNome)}>
                      <Send className="mr-2 h-3 w-3" /> Enviar Lembrete
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center text-muted-foreground h-full flex flex-col justify-center items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
            <p>Nenhum cliente com lembrete de revisão pendente no momento.</p>
          </div>
        )}
      </CardContent>
      {simulatedLembreteRevisaoAtivo && clientesParaLembreteRevisao.length > 0 && (
         <CardFooter className="pt-4 mt-2 border-t">
            <p className="text-xs text-muted-foreground">Total de {clientesParaLembreteRevisao.length} lembretes pendentes.</p>
        </CardFooter>
      )}
    </Card>
  );


  const mainChartSection = (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="shadow-lg lg:col-span-2">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Lucro (Real vs Orçado)</CardTitle>
          <CardDescription>Comparativo mensal do lucro obtido em relação ao orçado.</CardDescription>
        </CardHeader>
        <CardContent className="pl-0 pr-4">
          <ChartContainer config={chartConfigLucro} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={lucroChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `R$${value/1000}k`} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <RechartsLine type="monotone" dataKey="lucro" stroke="var(--color-lucro)" strokeWidth={2} dot={false} />
                <RechartsLine type="monotone" dataKey="orcamento" stroke="var(--color-orcamento)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <ChartLegend content={<ChartLegendContent />} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="shadow-lg lg:col-span-1">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Vendas na Semana</CardTitle>
          <CardDescription>Total de vendas diárias na semana atual.</CardDescription>
        </CardHeader>
        <CardContent className="pl-0 pr-4">
          <ChartContainer config={chartConfigVendas} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={vendasSemanaData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.5)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `R$${value/1000}k`} />
                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                <Bar dataKey="vendas" fill="var(--color-vendas)" radius={4} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );

  const calendarCard = (
    <Card className="shadow-xl border-2 border-primary/30">
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Calendário de Serviços (Integrado com Google Agenda - Simulação)
        </CardTitle>
        <CardDescription>Selecione uma data para ver os compromissos. Conecte sua agenda para sincronizar.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border p-3 w-full"
          locale={ptBR}
          disabled={(d) => d < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates only
          modifiers={{
            scheduled: scheduledDays
          }}
          modifiersClassNames={{
            scheduled: 'day-scheduled' 
          }}
          components={{
            DayContent: (props) => {
              const isScheduled = scheduledDays.some(scheduledDate =>
                isSameDay(props.date, scheduledDate)
              );
              return (
                <>
                  {props.date.getDate()}
                  {isScheduled && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-accent"></span>}
                </>
              );
            }
          }}
        />
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" onClick={handleConnectGoogleCalendar} className="w-full">
          <Link2 className="mr-2 h-4 w-4" /> Conectar com Google Agenda (Em Breve)
        </Button>
      </CardFooter>
    </Card>
  );

  const appointmentsCard = (
    <Card className="shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          Agendamentos para {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : "o dia selecionado"}
        </CardTitle>
        <CardDescription>Lista dos serviços agendados para este dia.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[350px] sm:h-[400px] md:h-[450px] px-6">
          {agendamentosDoDia.length > 0 ? (
            <div className="space-y-4">
              {agendamentosDoDia.map((ag, index) => (
                <React.Fragment key={ag.id}>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <ClockIcon className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{ag.horario} - {ag.servico}</p>
                      <p className="text-xs text-muted-foreground">{ag.cliente} ({ag.veiculo})</p>
                      <p className="text-xs text-muted-foreground">Mec.: {ag.mecanico} | Status: <span className="font-medium">{ag.status}</span></p>
                    </div>
                     <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                       <Link href={`/dashboard/servicos/detalhes/${ag.id}`}>Ver OS</Link>
                     </Button>
                  </div>
                  {index < agendamentosDoDia.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground h-full flex flex-col justify-center items-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p>Nenhum agendamento para {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "este dia"}.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
       <CardFooter className="border-t p-4">
         <Button className="w-full" asChild>
            <Link href="/dashboard/agendamento">Ver Agenda Completa</Link>
         </Button>
       </CardFooter>
    </Card>
  );
  
  const calendarAndAppointmentsSection = (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> 
        {calendarCard}
        {appointmentsCard}
    </div>
  );


  const tablesSection = (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Clientes (Últimos Atendidos)</CardTitle>
          <div className="flex justify-between items-center">
            <CardDescription>Visualização rápida dos últimos clientes.</CardDescription>
            <Button variant="outline" size="sm" asChild><Link href="/dashboard/clientes"><Users className="mr-2 h-3 w-3"/>Ver Todos</Link></Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Avatar</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Últ. Serviço</TableHead>
                <TableHead className="text-right">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ultimosClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={cliente.avatar} alt={cliente.nome} data-ai-hint={cliente.dataAiHint} />
                      <AvatarFallback>{cliente.nome.substring(0,1)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{cliente.veiculo}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{cliente.servico}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">{format(parseISO(cliente.data), "dd/MM/yy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Produtos & Serviços (TOP 3)</CardTitle>
           <div className="flex justify-between items-center">
            <CardDescription>Itens mais vendidos ou realizados no período.</CardDescription>
            <Button variant="outline" size="sm" asChild><Link href="/dashboard/produtos"><Package className="mr-2 h-3 w-3"/>Ver Estoque</Link></Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Vendas/Qtd</TableHead>
                <TableHead className="text-right">Receita Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProdutosServicos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-sm">{item.nome}</TableCell>
                  <TableCell><Badge variant={item.tipo === "Produto" ? "secondary" : "outline"}>{item.tipo}</Badge></TableCell>
                  <TableCell className="text-right text-sm">{item.vendas}</TableCell>
                  <TableCell className="text-right font-semibold text-sm">{item.receita}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );


  return (
    <ScrollArea className="flex-1">
      <div className="p-2 sm:p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-headline font-semibold md:text-3xl">Painel de Gestão - Mecânica Ágil</h1>
                <p className="text-sm text-muted-foreground">Bem-vindo de volta! Aqui está um resumo da sua oficina.</p>
            </div>
            <div className="flex gap-2 flex-wrap w-full sm:w-auto items-center">
                <Button variant="outline" size="sm" asChild><Link href="/dashboard/agendamento/novo"><CalendarDays className="mr-2 h-4 w-4"/>Agendar Cliente</Link></Button>
                <Button size="sm" asChild><Link href="/dashboard/servicos/novo"><Wrench className="mr-2 h-4 w-4"/>Nova Ordem de Serviço</Link></Button>
                <form onSubmit={handleSearchEstoque} className="flex gap-1 items-center">
                  <Input
                    type="search"
                    name="searchTermEstoque"
                    placeholder="Buscar no estoque..."
                    className="h-9 text-sm sm:w-auto md:w-[150px] lg:w-[200px]"
                  />
                  <Button type="submit" size="sm" variant="outline" className="h-9 px-3">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={handleFilterEstoque} className="h-9 px-3">
                    <Filter className="h-4 w-4" />
                  </Button>
                </form>
            </div>
        </div>
        
        <Separator className="my-4" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {kpiData.map(kpiCardComponent)}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {financialKpiData.map(financialKpiCardComponent)}
        </div>
        
        {calendarAndAppointmentsSection} 

        {contasAPagarAlertsCard}
        {lembretesRevisaoCard}

        {mainChartSection}
        {tablesSection}
        
        <Card className="shadow-lg bg-gradient-to-r from-primary/80 to-accent/80 text-primary-foreground p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h3 className="text-xl font-bold">Quer mais comodidade e eficiência?</h3>
                <p className="text-sm opacity-90">Experimente nosso App Mobile para Clientes e Mecânicos! Gestão na palma da mão.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">Saiba Mais</Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">Contratar Módulo</Button>
            </div>
        </Card>
      </div>
    </ScrollArea>
  );
}
