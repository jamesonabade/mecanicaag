
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ListFilter } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export default function AgendamentoPage() {
  const [date, setDate] = React.useState<Date | undefined>(undefined); 
  const [minCalendarDate, setMinCalendarDate] = React.useState<Date | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setDate(new Date());
    setMinCalendarDate(new Date(new Date().setHours(0,0,0,0)));
  }, []);


  const handleFilterClick = () => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: "A opção de filtrar agenda será implementada em breve.",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">Agendamento Inteligente</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard/agendamento/novo">
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Agendamento
            </Link>
          </Button>
          <Button variant="outline" onClick={handleFilterClick}>
            <ListFilter className="mr-2 h-4 w-4" /> Filtrar Agenda
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle>Calendário de Agendamentos</CardTitle>
            <CardDescription>Visualize e gerencie os agendamentos da oficina.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {/* 
              The Calendar component from shadcn/ui is a day picker. 
              A full-fledged calendar view for scheduling typically requires a more complex library 
              or custom implementation (e.g., react-big-calendar, FullCalendar).
              For this scaffold, we'll show the basic Calendar component.
            */}
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
              disabled={(d) => minCalendarDate ? d < minCalendarDate : true}
              className="rounded-md border"
              
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Próximos Compromissos</CardTitle>
            <CardDescription>Lista dos próximos serviços agendados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 text-center text-muted-foreground border-2 border-dashed rounded-lg h-full flex flex-col justify-center">
              <p>Nenhum compromisso agendado para os próximos dias.</p>
              <p className="text-xs mt-1">Utilize o calendário ou o botão "Novo Agendamento".</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    
