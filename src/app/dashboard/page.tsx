
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { 
  CalendarDays, 
  Car, 
  DollarSign, 
  Users, 
  Wrench, 
  ListChecks, 
  Clock, 
  UserCircle,
  PlusCircle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data - substituir por dados reais no futuro
const kpiCards = [
  { title: "Serviços Hoje", value: "12", icon: Wrench, color: "text-primary", description: "+5% vs ontem", link: "/dashboard/servicos" },
  { title: "Clientes na Oficina", value: "8", icon: Users, color: "text-green-500", description: "Atualmente", link: "/dashboard/clientes" },
  { title: "Veículos Aguardando", value: "5", icon: Car, color: "text-yellow-500", description: "Para serviço/orçamento", link: "/dashboard/veiculos" },
  { title: "Faturamento (Dia)", value: "R$ 3.500", icon: DollarSign, color: "text-indigo-500", description: "Meta: R$ 5.000", link: "/dashboard/financeiro" },
];

const actionButtons = [
  { label: "Novo Agendamento", icon: CalendarDays, href: "/dashboard/agendamento/novo", variant: "default" as const},
  { label: "Nova O.S.", icon: Wrench, href: "/dashboard/servicos/novo", variant: "secondary" as const},
  { label: "Novo Checklist", icon: ListChecks, href: "/dashboard/checklists/novo", variant: "outline" as const},
  { label: "Novo Cliente", icon: UserCircle, href: "/dashboard/clientes/novo", variant: "outline" as const},
];

const agendamentosDoDiaMock = [
  { id: "ag001", horario: "09:00", cliente: "João da Silva", veiculo: "Honda Civic (ABC-1234)", servico: "Revisão Periódica", mecanico: "Carlos", status: "Confirmado" },
  { id: "ag002", horario: "10:30", cliente: "Maria Oliveira", veiculo: "Toyota Corolla (GHI-9012)", servico: "Troca de Óleo", mecanico: "Pedro", status: "Confirmado" },
  { id: "ag003", horario: "14:00", cliente: "Ana Costa", veiculo: "Fiat Strada (DEF-5678)", servico: "Diagnóstico de Freios", mecanico: "Carlos", status: "Aguardando" },
  { id: "ag004", horario: "16:00", cliente: "Roberto Lima", veiculo: "VW Gol (JKL-3456)", servico: "Alinhamento", mecanico: "Ana", status: "Chegou" },
];

export default function DashboardPage() {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    setDate(new Date()); // Set initial date on client-side to avoid hydration mismatch
  }, []);

  const agendamentosFiltrados = date 
    ? agendamentosDoDiaMock.filter(() => {
        // Simula filtro por data, por enquanto mostra todos para o "dia atual" mockado
        // Num cenário real, você filtraria pela `date` selecionada
        return true; 
      })
    : [];

  return (
    <div className="flex flex-1 flex-col gap-6 md:gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-headline font-semibold md:text-3xl">Painel de Gestão Integrado</h1>
        <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
          {actionButtons.map(button => (
            <Button key={button.href} variant={button.variant} asChild className="w-full sm:w-auto">
              <Link href={button.href}>
                <button.icon className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{button.label}</span>
                <span className="sm:hidden text-xs">{button.label.split(' ')[0]}</span> 
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
              <Button variant="link" asChild className="px-0 pt-2 text-sm h-auto">
                <Link href={card.link}>Ver detalhes</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Calendário de Agendamentos</CardTitle>
            <CardDescription>Selecione uma data para ver os compromissos.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-2 sm:p-4 md:p-6">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full sm:max-w-md"
              locale={ptBR}
              disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() -1))} // Disable past dates, allow today
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              Agendamentos para {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : "Hoje"}
            </CardTitle>
            <CardDescription>Lista dos serviços agendados.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[300px] sm:h-[350px] md:h-[400px] px-6">
              {agendamentosFiltrados.length > 0 ? (
                <div className="space-y-4">
                  {agendamentosFiltrados.map((ag, index) => (
                    <React.Fragment key={ag.id}>
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <Clock className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{ag.horario} - {ag.servico}</p>
                          <p className="text-xs text-muted-foreground">{ag.cliente} ({ag.veiculo})</p>
                          <p className="text-xs text-muted-foreground">Mec.: {ag.mecanico} | Status: <span className="font-medium">{ag.status}</span></p>
                        </div>
                         <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                           <Link href={`/dashboard/servicos/detalhes/${ag.id}`}>Ver OS</Link> 
                         </Button>
                      </div>
                      {index < agendamentosFiltrados.length - 1 && <Separator />}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                  <CalendarDays className="h-12 w-12 text-muted-foreground/30 mb-3" />
                  <p>Nenhum agendamento para {date ? format(date, "dd/MM/yyyy") : "hoje"}.</p>
                  <Button variant="link" className="mt-2" asChild>
                    <Link href="/dashboard/agendamento/novo">
                        <PlusCircle className="mr-2 h-4 w-4"/> Novo Agendamento
                    </Link>
                  </Button>
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
      </div>
    </div>
  );
}
