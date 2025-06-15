
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Car, DollarSign, Users, Wrench, ListChecks } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const kpiCards = [
    { title: "Serviços Hoje", value: "12", icon: Wrench, color: "text-primary", description: "+5% vs ontem", link: "/dashboard/servicos" },
    { title: "Clientes Atendidos", value: "8", icon: Users, color: "text-green-500", description: "Mês atual", link: "/dashboard/clientes" },
    { title: "Veículos na Oficina", value: "15", icon: Car, color: "text-yellow-500", description: "Status: Em Andamento", link: "/dashboard/veiculos" },
    { title: "Faturamento (Dia)", value: "R$ 3.500", icon: DollarSign, color: "text-indigo-500", description: "Meta: R$ 5.000", link: "/dashboard/financeiro" },
  ];

  const actionButtons = [
    { label: "Novo Agendamento", icon: CalendarDays, href: "/dashboard/agendamento/novo", variant: "default" as const}, // Atualizado para /novo se houver página
    { label: "Nova Ordem de Serviço", icon: Wrench, href: "/dashboard/servicos/novo", variant: "secondary" as const},
    { label: "Ver Checklists", icon: ListChecks, href: "/dashboard/checklists", variant: "outline" as const},
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-headline font-semibold md:text-3xl">Painel de Gestão Integrado</h1>
        <div className="flex gap-2">
          {actionButtons.map(button => (
            <Button key={button.href} variant={button.variant} asChild>
              <Link href={button.href}>
                <button.icon className="mr-2 h-4 w-4" />
                {button.label}
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
              <Button variant="link" asChild className="px-0 pt-2 text-sm">
                <Link href={card.link}>Ver detalhes</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Serviços Recentes</CardTitle>
            <CardDescription>Acompanhe os últimos serviços realizados.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Lista de serviços recentes aparecerá aqui...</p>
            {/* Placeholder for a table or list of recent services */}
            <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground">
              Nenhum serviço recente para exibir.
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Próximos Agendamentos</CardTitle>
            <CardDescription>Veja os agendamentos para os próximos dias.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Lista de próximos agendamentos aparecerá aqui...</p>
            {/* Placeholder for a calendar view or list of upcoming appointments */}
            <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground">
              Nenhum agendamento próximo.
            </div>
             <Button asChild className="mt-4">
              <Link href="/dashboard/agendamento">Ver Agenda Completa</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    