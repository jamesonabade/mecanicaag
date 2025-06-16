
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarPlus, CheckCircle } from "lucide-react";
import React from "react";
import { useToast } from "@/hooks/use-toast";

export default function AgendarServicoPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [minCalendarDate, setMinCalendarDate] = React.useState<Date | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    setMinCalendarDate(new Date(today.setHours(0,0,0,0)));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Placeholder for submission logic
    toast({
      title: "Agendamento Confirmado!",
      description: `Seu serviço foi agendado para ${selectedDate?.toLocaleDateString('pt-BR')}. Lembretes serão enviados.`,
      variant: "default"
    });
    // Reset form or redirect
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><CalendarPlus /> Agendar Novo Serviço</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-lg">
            <CardHeader>
              <CardTitle>Detalhes do Agendamento</CardTitle>
              <CardDescription>Selecione o veículo, o tipo de serviço e descreva suas necessidades.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="veiculoAgendamento">Selecione o Veículo</Label>
                <Select>
                  <SelectTrigger id="veiculoAgendamento">
                    <SelectValue placeholder="Escolha um veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veiculo1_agenda">Honda Civic - ABC-1234</SelectItem>
                    <SelectItem value="veiculo2_agenda">Toyota Corolla - XYZ-5678</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipoServico">Tipo de Serviço</Label>
                <Select>
                  <SelectTrigger id="tipoServico">
                    <SelectValue placeholder="Escolha o tipo de serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revisao">Revisão Programada</SelectItem>
                    <SelectItem value="trocaOleo">Troca de Óleo</SelectItem>
                    <SelectItem value="freios">Serviço de Freios</SelectItem>
                    <SelectItem value="suspensao">Serviço de Suspensão</SelectItem>
                    <SelectItem value="diagnostico">Diagnóstico de Problema</SelectItem>
                    <SelectItem value="outro">Outro (descrever abaixo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="observacoes">Observações Adicionais</Label>
                <Textarea id="observacoes" placeholder="Alguma informação extra sobre o serviço ou problema?" rows={3} />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Escolha Data e Hora</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  defaultMonth={selectedDate}
                  className="rounded-md border"
                  disabled={(date) => minCalendarDate ? date < minCalendarDate : true}
                />
                <div className="mt-4 w-full">
                    <Label htmlFor="horario">Horário Preferido</Label>
                    <Select>
                        <SelectTrigger id="horario">
                            <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="08:00">08:00 - 09:00</SelectItem>
                            <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                            <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                            <SelectItem value="11:00">11:00 - 12:00</SelectItem>
                            <SelectItem value="14:00">14:00 - 15:00</SelectItem>
                            <SelectItem value="15:00">15:00 - 16:00</SelectItem>
                            <SelectItem value="16:00">16:00 - 17:00</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" className="w-full text-lg py-6">
              <CheckCircle className="mr-2 h-5 w-5" /> Confirmar Agendamento
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
