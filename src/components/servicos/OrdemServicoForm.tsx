
"use client";

import React, { useEffect, useState }  from "react"; 
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
import { ChevronLeft, Save, CalendarIcon, Wrench, User, Car, PlusCircle } from "lucide-react";
import { getClientes, Cliente } from "@/lib/mockData/clientes";
import { getVeiculosByClienteId, Veiculo } from "@/lib/mockData/veiculos";
import { getMecanicos, Funcionario } from "@/lib/mockData/funcionarios";


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
  { id: "rev_simples", nome: "Revisão Simples (Óleo + Filtros)", valorPadrao: 250, checklistModeloIdObrigatorio: "chk_model_003", nomeChecklistObrigatorio: "Checklist de Troca de Óleo", categoria: "Revisão" },
  { id: "rev_completa", nome: "Revisão Completa (Preventiva)", valorPadrao: 650, checklistModeloIdObrigatorio: "chk_model_001", nomeChecklistObrigatorio: "Checklist de Inspeção Pré-Serviço", categoria: "Revisão" },
  { id: "troca_oleo", nome: "Troca de Óleo e Filtro de Óleo", valorPadrao: 180, checklistModeloIdObrigatorio: "chk_model_003", nomeChecklistObrigatorio: "Checklist de Troca de Óleo", categoria: "Mecânica Geral" },
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
  tipoServicoId: z.string({ required_error: "Selecione o tipo de serviço principal do catálogo." }), 
  descricaoProblema: z.string().min(10, { message: "Descreva o problema com pelo menos 10 caracteres." }),
  servicosPecasPlanejadas: z.string().optional(),
  valorEstimado: z.coerce.number().min(0, {message: "Valor estimado deve ser positivo ou zero."}).optional(),
  dataEntrada: z.date({ required_error: "Data de entrada é obrigatória." }),
  dataPrevisaoEntrega: z.date().optional(),
  observacoesInternas: z.string().optional(),
  statusInicial: z.string().default("Aguardando Diagnóstico"),
});

type OsFormValues = z.infer<typeof osFormSchema>;

export default function OrdemServicoForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clientes, setClientesState] = React.useState<Cliente[]>([]);
  const [veiculosCliente, setVeiculosCliente] = React.useState<Veiculo[]>([]);
  const [checklistRecomendado, setChecklistRecomendado] = React.useState<string | null>(null);
  const [mecanicos, setMecanicos] = React.useState<Funcionario[]>([]);

  const [searchTermServicoPrincipal, setSearchTermServicoPrincipal] = useState("");
  const [searchResultsServicoPrincipal, setSearchResultsServicoPrincipal] = useState<TipoServicoPadrao[]>([]);
  const [selectedServicoPrincipalDisplay, setSelectedServicoPrincipalDisplay] = useState<string | null>(null);


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
      statusInicial: "Aguardando Diagnóstico",
    },
  });


  const selectedClienteId = form.watch("clienteId");

  React.useEffect(() => {
    setClientesState(getClientes());
    setMecanicos(getMecanicos());
  }, []);

   useEffect(() => {
    const queryClienteId = searchParams.get("clienteId");
    const queryVeiculoId = searchParams.get("veiculoId");
    const queryOrcamentoId = searchParams.get("orcamentoId"); 

    if (queryClienteId) {
      form.setValue("clienteId", queryClienteId);
       if (queryVeiculoId) {
        setTimeout(() => {
          form.setValue("veiculoId", queryVeiculoId);
        }, 50);
      }
    }
    if (queryOrcamentoId) {
        const currentObs = form.getValues("observacoesInternas") || "";
        form.setValue("observacoesInternas", `Baseado no Orçamento ID: ${queryOrcamentoId}${currentObs ? `\n${currentObs}` : ""}`);
        toast({ title: "Info", description: `OS iniciada a partir do Orçamento ${queryOrcamentoId}.`});
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
    if (searchTermServicoPrincipal.trim().length > 1) {
      const lowerSearchTerm = searchTermServicoPrincipal.toLowerCase();
      const results = mockTiposServicoPadrao.filter(
        (servico) =>
          servico.nome.toLowerCase().includes(lowerSearchTerm) ||
          (servico.descricaoCurta && servico.descricaoCurta.toLowerCase().includes(lowerSearchTerm)) ||
          (servico.categoria && servico.categoria.toLowerCase().includes(lowerSearchTerm))
      );
      setSearchResultsServicoPrincipal(results);
    } else {
      setSearchResultsServicoPrincipal([]);
    }
  }, [searchTermServicoPrincipal]);

  const handleSelectServicoPrincipal = (servico: TipoServicoPadrao) => {
    form.setValue("tipoServicoId", servico.id);
    setSelectedServicoPrincipalDisplay(servico.nome + (servico.valorPadrao && servico.valorPadrao > 0 ? ` (R$ ${servico.valorPadrao.toFixed(2)})` : (servico.valorPadrao === 0 && servico.id === "outro" ? ' (Valor a definir)' : '')));
    
    if (servico.valorPadrao !== undefined && servico.valorPadrao >= 0) {
      form.setValue("valorEstimado", servico.valorPadrao);
    } else {
      form.setValue("valorEstimado", undefined);
    }
    if (servico.checklistModeloIdObrigatorio && servico.nomeChecklistObrigatorio) {
      setChecklistRecomendado(`Checklist recomendado/obrigatório: ${servico.nomeChecklistObrigatorio} (ID: ${servico.checklistModeloIdObrigatorio})`);
    } else {
      setChecklistRecomendado(null);
    }
    if (servico.descricaoCurta && !form.getValues("servicosPecasPlanejadas")) {
        form.setValue("servicosPecasPlanejadas", servico.descricaoCurta);
    }
  
    setSearchTermServicoPrincipal(""); 
    setSearchResultsServicoPrincipal([]); 
  };
  
  const clearSelectedServicoPrincipal = () => {
      form.setValue("tipoServicoId", "");
      setSelectedServicoPrincipalDisplay(null);
      setSearchTermServicoPrincipal(""); 
      form.setValue("valorEstimado", undefined);
      setChecklistRecomendado(null);
      form.trigger("tipoServicoId"); 
  };


  async function onSubmit(data: OsFormValues) {
    const servicoSelecionado = mockTiposServicoPadrao.find(s => s.id === data.tipoServicoId);
    const dataToSubmit = {
        ...data,
        tipoServico: servicoSelecionado?.nome || "Não especificado" 
    }
    console.log("Dados da OS para salvar:", dataToSubmit);
    toast({
      title: "Ordem de Serviço Criada (Simulado)",
      description: "A OS foi salva com sucesso (simulação).",
    });
  }

  const handleAdicionarServicoCatalogo = () => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: "Para adicionar um novo serviço ao catálogo, por favor, acesse a seção 'Cadastros > Catálogo de Serviços'.",
      duration: 7000,
      action: (
        <Button variant="outline" size="sm" asChild onClick={() => router.push('/dashboard/cadastros/catalogo-servicos')}>
          Ir para Catálogo
        </Button>
      )
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-2">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Wrench /> Nova Ordem de Serviço
        </h1>
        <Button variant="outline" asChild className="w-full md:w-auto">
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
                    <FormLabel>Tipo de Serviço Principal (Catálogo)*</FormLabel>
                    {!selectedServicoPrincipalDisplay ? (
                      <>
                        <div className="flex gap-2 items-end">
                          <div className="flex-grow">
                            <Input
                              id="searchServicoPrincipal"
                              placeholder="Buscar serviço no catálogo..."
                              value={searchTermServicoPrincipal}
                              onChange={(e) => setSearchTermServicoPrincipal(e.target.value)}
                              className="h-10"
                            />
                          </div>
                          <Button type="button" variant="outline" onClick={handleAdicionarServicoCatalogo} className="whitespace-nowrap h-10">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Serviço Catálogo
                          </Button>
                        </div>
                        {searchTermServicoPrincipal && searchResultsServicoPrincipal.length > 0 && (
                          <Card className="mt-1 max-h-48 overflow-y-auto border shadow-md">
                            <CardContent className="p-1 space-y-0.5">
                              {searchResultsServicoPrincipal.map((servico) => (
                                <Button
                                  key={servico.id}
                                  type="button"
                                  variant="ghost"
                                  className="w-full justify-start h-auto p-2 text-left hover:bg-muted/80"
                                  onClick={() => handleSelectServicoPrincipal(servico)}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-sm">{servico.nome}</span>
                                    <span className="text-xs text-muted-foreground">
                                      Cat: {servico.categoria || 'N/A'} | Preço Padrão: R$ {(servico.valorPadrao || 0).toFixed(2)}
                                    </span>
                                  </div>
                                </Button>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                        {searchTermServicoPrincipal && searchResultsServicoPrincipal.length === 0 && (
                          <p className="text-sm text-muted-foreground mt-1">Nenhum serviço encontrado com "{searchTermServicoPrincipal}".</p>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50 h-10">
                        <Wrench className="h-4 w-4 text-primary"/>
                        <span className="text-sm font-medium flex-grow">{selectedServicoPrincipalDisplay}</span>
                        <Button type="button" variant="outline" size="sm" onClick={clearSelectedServicoPrincipal}>Alterar</Button>
                      </div>
                    )}
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
                                date > new Date() || date < new Date("2000-01-01")
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
                    <FormLabel>Peças e Serviços Planejados (Detalhes Iniciais - Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Liste peças e serviços adicionais planejados para o orçamento inicial. Ex: 1x Filtro de óleo; 1x Alinhamento..." {...field} rows={4} />
                    </FormControl>
                    <FormDescription>Este campo ajuda na elaboração do orçamento inicial. Será preenchido automaticamente com a descrição curta se o serviço principal do catálogo tiver uma.</FormDescription>
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
                        <Input type="number" placeholder="Ex: 350.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || undefined)} />
                      </FormControl>
                      <FormDescription>Preenchido automaticamente se o serviço do catálogo tiver valor padrão.</FormDescription>
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
                          {mecanicos.map(mecanico => (
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
                          <SelectItem value="Aguardando Diagnóstico">Aguardando Diagnóstico</SelectItem>
                          <SelectItem value="Aguardando Orçamento">Aguardando Orçamento</SelectItem>
                           <SelectItem value="Aguardando Aprovação">Aguardando Aprovação do Cliente</SelectItem>
                          <SelectItem value="Em Andamento">Em Andamento</SelectItem>
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

