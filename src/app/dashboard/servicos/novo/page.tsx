
"use client";

import React, { useEffect } from "react"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"; 
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
import { ChevronLeft, Save, CalendarIcon, Wrench, User, Car } from "lucide-react";
import { getClientes, Cliente } from "@/lib/mockData/clientes";
import { getVeiculosByClienteId, Veiculo } from "@/lib/mockData/veiculos";


const mockMecanicos = [
  { id: "mec001", nome: "Carlos Alberto" },
  { id: "mec002", nome: "Pedro Henrique" },
];

interface TipoServicoPadrao {
  id: string;
  nome: string;
  descricaoCurta?: string;
  valorPadrao?: number;
  tempoEstimadoHoras?: number;
  checklistModeloIdObrigatorio?: string;
  nomeChecklistObrigatorio?: string; 
  categoria?: 'Mecânica Geral' | 'Elétrica' | 'Funilaria' | 'Revisão' | 'Diagnóstico';
}

const mockTiposServicoPadrao: TipoServicoPadrao[] = [
  { id: "rev_simples", nome: "Revisão Simples (Óleo + Filtros)", valorPadrao: 250, checklistModeloIdObrigatorio: "chk003", nomeChecklistObrigatorio: "Checklist de Troca de Óleo", categoria: "Revisão" },
  { id: "rev_completa", nome: "Revisão Completa (Preventiva)", valorPadrao: 650, checklistModeloIdObrigatorio: "chk001", nomeChecklistObrigatorio: "Checklist de Inspeção Pré-Serviço", categoria: "Revisão" },
  { id: "troca_oleo", nome: "Troca de Óleo e Filtro de Óleo", valorPadrao: 180, checklistModeloIdObrigatorio: "chk003", nomeChecklistObrigatorio: "Checklist de Troca de Óleo", categoria: "Mecânica Geral" },
  { id: "freio_diant", nome: "Serviço Freios Dianteiros (Pastilhas)", valorPadrao: 220, categoria: "Mecânica Geral" },
  { id: "diag_scanner", nome: "Diagnóstico com Scanner", valorPadrao: 150, categoria: "Diagnóstico" },
  { id: "alinh_balanc", nome: "Alinhamento e Balanceamento (4 rodas)", valorPadrao: 120, categoria: "Mecânica Geral" },
  {id: "eletrica_basica", nome: "Verificação Elétrica Básica", valorPadrao: 90, categoria: "Elétrica"},
  {id: "susp_check", nome: "Diagnóstico de Suspensão", valorPadrao: 100, categoria: "Mecânica Geral"},
  {id: "outro", nome: "Outro (Descrever Manualmente)", valorPadrao: 0, categoria: "Mecânica Geral"},
];


const osFormSchema = z.object({
  clienteId: z.string({ required_error: "Selecione um cliente." }),
  veiculoId: z.string({ required_error: "Selecione um veículo." }),
  mecanicoId: z.string().optional(),
  tipoServicoId: z.string({ required_error: "Selecione o tipo de serviço." }), 
  descricaoProblema: z.string().min(10, { message: "Descreva o problema com pelo menos 10 caracteres." }),
  servicosPecasPlanejadas: z.string().optional(),
  valorEstimado: z.coerce.number().min(0, {message: "Valor estimado deve ser positivo."}).optional(),
  dataEntrada: z.date({ required_error: "Data de entrada é obrigatória." }),
  dataPrevisaoEntrega: z.date().optional(),
  observacoesInternas: z.string().optional(),
  statusInicial: z.string().default("Aguardando Análise"),
});

type OsFormValues = z.infer<typeof osFormSchema>;

export default function NovaOrdemServicoPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clientes, setClientesState] = React.useState<Cliente[]>([]);
  const [veiculosCliente, setVeiculosCliente] = React.useState<Veiculo[]>([]);
  const [checklistRecomendado, setChecklistRecomendado] = React.useState<string | null>(null);

  const form = useForm<OsFormValues>({
    resolver: zodResolver(osFormSchema),
    defaultValues: {
      clienteId: "",
      veiculoId: "",
      mecanicoId: "",
      tipoServicoId: "", 
      descricaoProblema: "",
      servicosPecasPlanejadas: "",
      valorEstimado: undefined,
      dataEntrada: new Date(),
      dataPrevisaoEntrega: undefined,
      observacoesInternas: "",
      statusInicial: "Aguardando Análise",
    },
  });


  const selectedClienteId = form.watch("clienteId");
  const selectedTipoServicoId = form.watch("tipoServicoId");

  React.useEffect(() => {
    setClientesState(getClientes());
  }, []);

   // Preencher cliente e veículo se vierem da query
   useEffect(() => {
    const queryClienteId = searchParams.get("clienteId");
    const queryVeiculoId = searchParams.get("veiculoId");
    const queryOrcamentoId = searchParams.get("orcamentoId"); // Para futura conversão de orçamento em OS

    if (queryClienteId) {
      form.setValue("clienteId", queryClienteId);
       if (queryVeiculoId) {
         // Necessário um timeout pequeno para garantir que os veículos do cliente sejam carregados ANTES de tentar setar o veiculoId
        setTimeout(() => {
          form.setValue("veiculoId", queryVeiculoId);
        }, 50);
      }
    }
    if (queryOrcamentoId) {
        // Lógica para carregar dados do orçamento e preencher o form da OS
        toast({ title: "Info", description: `Carregando dados do orçamento ${queryOrcamentoId} para nova OS.`});
    }
  }, [searchParams, form, toast]);


  React.useEffect(() => {
    if (selectedClienteId) {
      const clienteTemVeiculos = getVeiculosByClienteId(selectedClienteId);
      setVeiculosCliente(clienteTemVeiculos);
      const veiculoAtualPertenceAoCliente = clienteTemVeiculos.some(v => v.id === form.getValues("veiculoId"));
      if (!veiculoAtualPertenceAoCliente) {
         form.setValue("veiculoId", ""); 
      }
    } else {
      setVeiculosCliente([]);
       form.setValue("veiculoId", ""); 
    }
  }, [selectedClienteId, form]);

  React.useEffect(() => {
    if (selectedTipoServicoId) {
      const servicoSelecionado = mockTiposServicoPadrao.find(s => s.id === selectedTipoServicoId);
      if (servicoSelecionado) {
        if (servicoSelecionado.valorPadrao !== undefined && servicoSelecionado.valorPadrao >= 0) { // Allow 0 for "Outro"
          form.setValue("valorEstimado", servicoSelecionado.valorPadrao);
        } else {
           const currentValorEstimado = form.getValues("valorEstimado");
           const previousServicoWithValor = mockTiposServicoPadrao.find(s => s.valorPadrao === currentValorEstimado && s.id !== selectedTipoServicoId);
           if (previousServicoWithValor && !servicoSelecionado.valorPadrao) {
              form.setValue("valorEstimado", undefined);
           }
        }
        if (servicoSelecionado.checklistModeloIdObrigatorio && servicoSelecionado.nomeChecklistObrigatorio) {
          setChecklistRecomendado(`Checklist recomendado/obrigatório: ${servicoSelecionado.nomeChecklistObrigatorio} (ID: ${servicoSelecionado.checklistModeloIdObrigatorio})`);
        } else {
          setChecklistRecomendado(null);
        }
      } else {
        setChecklistRecomendado(null);
      }
    } else {
      setChecklistRecomendado(null);
    }
  }, [selectedTipoServicoId, form]);


  async function onSubmit(data: OsFormValues) {
    const servicoSelecionado = mockTiposServicoPadrao.find(s => s.id === data.tipoServicoId);
    const dataToSubmit = {
        ...data,
        tipoServicoNome: servicoSelecionado?.nome || "N/A" 
    }
    console.log(dataToSubmit);
    toast({
      title: "Ordem de Serviço Criada (Simulado)",
      description: "A OS foi salva com sucesso (simulação).",
    });
    // router.push("/dashboard/servicos"); // Redirecionar após salvar
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Wrench /> Nova Ordem de Serviço
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/servicos">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista de OS
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Dados da Ordem de Serviço</CardTitle>
          <CardDescription>Preencha as informações para registrar uma nova OS.</CardDescription>
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
                          {clientes.map(cliente => (
                            <SelectItem key={cliente.id} value={cliente.id}>{cliente.nomeCompleto} ({cliente.cpfCnpj})</SelectItem>
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
                      <FormMessage />
                       {selectedClienteId && veiculosCliente.length === 0 && (
                        <FormDescription className="text-xs text-orange-600">
                          Este cliente não possui veículos cadastrados. <Link href={`/dashboard/veiculos/novo?clienteId=${selectedClienteId}`} className="underline">Cadastrar veículo?</Link>
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                  control={form.control}
                  name="tipoServicoId" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Serviço Principal*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de serviço" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockTiposServicoPadrao.map(tipo => (
                            <SelectItem key={tipo.id} value={tipo.id}>{tipo.nome} {tipo.valorPadrao && tipo.valorPadrao > 0 ? `(R$ ${tipo.valorPadrao.toFixed(2)})` : (tipo.valorPadrao === 0 ? '(Valor a definir)' : '')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {checklistRecomendado && (
                        <FormDescription className="text-blue-600">{checklistRecomendado}</FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="descricaoProblema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Problema / Solicitação do Cliente*</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Carro não liga, barulho estranho ao frear, revisão dos 20.000km..." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="dataEntrada"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Data de Entrada*</FormLabel>
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
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
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
                    name="dataPrevisaoEntrega"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Previsão de Entrega (Opcional)</FormLabel>
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
                                disabled={(date) =>
                                 date < (form.getValues("dataEntrada") || new Date(new Date().setDate(new Date().getDate() -1))) 
                                }
                                initialFocus
                                locale={ptBR}
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="servicosPecasPlanejadas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peças e Serviços Planejados (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Liste peças e serviços adicionais planejados para o orçamento inicial. Ex: 1x Filtro de óleo; 1x Alinhamento..." {...field} rows={4} />
                    </FormControl>
                    <FormDescription>Este campo ajuda na elaboração do orçamento inicial. Será preenchido automaticamente se o serviço principal tiver itens vinculados no futuro.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="valorEstimado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Estimado Inicial (R$) (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 350.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mecanicoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mecânico Responsável (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um mecânico" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockMecanicos.map(mecanico => (
                            <SelectItem key={mecanico.id} value={mecanico.id}>{mecanico.nome}</SelectItem>
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
                name="observacoesInternas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Internas (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detalhes adicionais para a equipe, condições do veículo na chegada, etc." {...field} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="statusInicial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Inicial da OS</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status inicial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Aguardando Análise">Aguardando Análise</SelectItem>
                          <SelectItem value="Aguardando Orçamento">Aguardando Orçamento</SelectItem>
                          <SelectItem value="Aguardando Aprovação Cliente">Aguardando Aprovação Cliente</SelectItem>
                          <SelectItem value="Em Serviço">Em Serviço</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />


            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-6 border-t">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/servicos">Cancelar</Link>
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Salvar Ordem de Serviço
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
