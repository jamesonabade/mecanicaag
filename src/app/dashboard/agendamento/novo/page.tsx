
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, CalendarIcon, User, Car, Wrench, Clock } from "lucide-react";

// Mock data - Mover para um arquivo central no futuro
interface Cliente {
  id: string;
  nome: string; 
  cpfCnpj?: string; 
}
interface Veiculo {
  id: string;
  clienteId: string;
  modelo: string;
  placa: string;
  marca?: string; 
}

const mockClientes: Cliente[] = [
  { id: "cli001", nome: "João da Silva", cpfCnpj: "111.111.111-11" },
  { id: "cli002", nome: "Maria Oliveira", cpfCnpj: "222.222.222-22" },
];

const mockVeiculos: Veiculo[] = [
  { id: "vec001", clienteId: "cli001", marca: "Honda", modelo: "Honda Civic", placa: "ABC-1234" },
  { id: "vec002", clienteId: "cli001", marca: "Fiat", modelo: "Fiat Strada", placa: "DEF-5678" },
  { id: "vec003", clienteId: "cli002", marca: "Toyota", modelo: "Toyota Corolla", placa: "GHI-9012" },
];

const mockMecanicos = [
  { id: "mec001", nome: "Carlos Alberto" },
  { id: "mec002", nome: "Pedro Henrique" },
];

const tiposServicoAgendamento = [
    {value: "revisao_periodica", label: "Revisão Periódica"},
    {value: "troca_oleo_filtros", label: "Troca de Óleo e Filtros"},
    {value: "servico_freios", label: "Serviço de Freios"},
    {value: "servico_suspensao", label: "Serviço de Suspensão"},
    {value: "diagnostico_problema", label: "Diagnóstico de Problema"},
    {value: "alinhamento_balanceamento", label: "Alinhamento e Balanceamento"},
    {value: "outro", label: "Outro (descrever)"},
];

const horariosDisponiveis = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

const agendamentoFormSchema = z.object({
  clienteId: z.string({ required_error: "Selecione um cliente." }),
  veiculoId: z.string({ required_error: "Selecione um veículo." }),
  tipoServico: z.string({ required_error: "Selecione o tipo de serviço." }),
  dataAgendamento: z.date({ required_error: "Data do agendamento é obrigatória." }),
  horarioAgendamento: z.string({ required_error: "Horário do agendamento é obrigatório." }),
  mecanicoId: z.string().optional(),
  observacoes: z.string().optional(),
});

type AgendamentoFormValues = z.infer<typeof agendamentoFormSchema>;

export default function NovoAgendamentoPage() {
  const { toast } = useToast();
  const form = useForm<AgendamentoFormValues>({
    resolver: zodResolver(agendamentoFormSchema),
    defaultValues: {
      clienteId: "",
      veiculoId: "",
      tipoServico: "",
      dataAgendamento: undefined,
      horarioAgendamento: "",
      mecanicoId: "",
      observacoes: "",
    },
  });

  const [veiculosCliente, setVeiculosCliente] = React.useState<Veiculo[]>([]);
  const selectedClienteId = form.watch("clienteId");

  React.useEffect(() => {
    if (selectedClienteId) {
      setVeiculosCliente(mockVeiculos.filter(v => v.clienteId === selectedClienteId));
      form.setValue("veiculoId", ""); 
    } else {
      setVeiculosCliente([]);
    }
  }, [selectedClienteId, form]);

  async function onSubmit(data: AgendamentoFormValues) {
    console.log(data);
    toast({
      title: "Agendamento Criado (Simulado)",
      description: `O agendamento para ${data.dataAgendamento ? format(data.dataAgendamento, "PPP", {locale: ptBR}) : ''} às ${data.horarioAgendamento} foi salvo.`,
    });
    // form.reset(); 
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-2">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <CalendarIcon className="h-7 w-7"/> Novo Agendamento
        </h1>
        <Button variant="outline" asChild className="w-full md:w-auto">
          <Link href="/dashboard/agendamento">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Agenda
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Informações do Agendamento</CardTitle>
          <CardDescription>Preencha os dados para registrar um novo agendamento.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clienteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><User className="h-4 w-4" /> Cliente*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockClientes.map(cliente => (
                            <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome} {cliente.cpfCnpj ? `(${cliente.cpfCnpj})` : ''}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="veiculoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Car className="h-4 w-4" /> Veículo*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClienteId || veiculosCliente.length === 0}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={!selectedClienteId ? "Selecione um cliente primeiro" : (veiculosCliente.length === 0 ? "Nenhum veículo para este cliente" : "Selecione o veículo")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {veiculosCliente.map(veiculo => (
                            <SelectItem key={veiculo.id} value={veiculo.id}>{veiculo.marca} {veiculo.modelo} - {veiculo.placa}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                       {selectedClienteId && veiculosCliente.length === 0 && (
                        <FormDescription className="text-xs text-orange-600">
                          Este cliente não possui veículos cadastrados. <Link href={`/dashboard/veiculos/novo?clienteId=${selectedClienteId}`} className="underline">Cadastrar veículo?</Link>
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                  control={form.control}
                  name="tipoServico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Wrench className="h-4 w-4"/> Tipo de Serviço Principal*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposServicoAgendamento.map(tipo => (
                            <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="dataAgendamento"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Data do Agendamento*</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                    <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() -1)) } // Disable past dates
                                initialFocus
                                locale={ptBR}
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                <FormField
                  control={form.control}
                  name="horarioAgendamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Clock className="h-4 w-4"/> Horário*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger disabled={!form.getValues("dataAgendamento")}>
                            <SelectValue placeholder={!form.getValues("dataAgendamento") ? "Escolha uma data primeiro" : "Selecione um horário"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {horariosDisponiveis.map(horario => (
                            <SelectItem key={horario} value={horario}>{horario}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                  control={form.control}
                  name="mecanicoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mecânico (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Atribuir a um mecânico (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockMecanicos.map(mecanico => (
                            <SelectItem key={mecanico.id} value={mecanico.id}>{mecanico.nome}</SelectItem>
                          ))}
                           <SelectItem value="qualquer">Qualquer mecânico disponível</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detalhes adicionais sobre o serviço, histórico do veículo, ou pedidos específicos do cliente." {...field} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6 border-t">
              <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/dashboard/agendamento">Cancelar</Link>
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Salvar Agendamento
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

