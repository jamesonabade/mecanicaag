
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, FilePlus, User, Car, CalendarIcon, PlusCircle, Trash2, DollarSign, Percent, ListPlus, UserCheck, UserCog, Search as SearchIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getClientes, Cliente } from "@/lib/mockData/clientes";
import { getVeiculosByClienteId, Veiculo } from "@/lib/mockData/veiculos";
import { getAtendentes, getMecanicos, Funcionario } from "@/lib/mockData/funcionarios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


interface TipoServicoPadrao {
  id: string;
  nome: string;
  descricaoCurta?: string;
  valorPadrao?: number;
  checklistModeloIdObrigatorio?: string;
  nomeChecklistObrigatorio?: string;
  categoria?: string;
}
const mockTiposServicoPadrao: TipoServicoPadrao[] = [
  { id: "rev_simples", nome: "Revisão Simples (Óleo + Filtros)", valorPadrao: 250, checklistModeloIdObrigatorio: "chk003", nomeChecklistObrigatorio: "Checklist de Troca de Óleo", categoria: "Revisão" },
  { id: "rev_completa", nome: "Revisão Completa (Preventiva)", valorPadrao: 650, checklistModeloIdObrigatorio: "chk001", nomeChecklistObrigatorio: "Checklist de Inspeção Pré-Serviço", categoria: "Revisão" },
  { id: "troca_oleo", nome: "Troca de Óleo e Filtro de Óleo", valorPadrao: 180, checklistModeloIdObrigatorio: "chk003", nomeChecklistObrigatorio: "Checklist de Troca de Óleo", categoria: "Mecânica Geral" },
  { id: "freio_diant", nome: "Serviço Freios Dianteiros (Pastilhas)", valorPadrao: 220, categoria: "Mecânica Geral" },
  { id: "diag_scanner", nome: "Diagnóstico com Scanner", valorPadrao: 150, categoria: "Diagnóstico" },
  { id: "alinh_balanc", nome: "Alinhamento e Balanceamento (4 rodas)", valorPadrao: 120, categoria: "Mecânica Geral" },
  { id: "outro_serv", nome: "Outro Serviço (Manual)", valorPadrao: 0, categoria: "Diversos"},
];

interface Produto {
  id: string;
  nome: string;
  codigoSku: string;
  precoVenda: number;
  estoqueAtual: number;
}

const mockProdutosCatalogo: Produto[] = [
  { id: "prod001", nome: "Óleo Motor 5W30 Sintético (Litro)", codigoSku: "SKU001", precoVenda: 45.00, estoqueAtual: 50 },
  { id: "prod002", nome: "Filtro de Óleo Original Honda Civic", codigoSku: "SKU002", precoVenda: 35.00, estoqueAtual: 30 },
  { id: "prod003", nome: "Pastilha de Freio Dianteira XYZ", codigoSku: "SKU003", precoVenda: 120.00, estoqueAtual: 15 },
  { id: "prod004", nome: "Lâmpada H4 Super Branca (Par)", codigoSku: "SKU004", precoVenda: 60.00, estoqueAtual: 25 },
  { id: "prod005", nome: "Aditivo Radiador Concentrado (Litro)", codigoSku: "SKU005", precoVenda: 25.00, estoqueAtual: 40 },
  { id: "prod006", nome: "Kit Correia Dentada (Tensor + Correia)", codigoSku: "SKU006", precoVenda: 280.00, estoqueAtual: 10 },
  { id: "prod007", nome: "Amortecedor Dianteiro (Unidade)", codigoSku: "SKU007", precoVenda: 180.00, estoqueAtual: 8 },
  { id: "prod008", nome: "Vela de Ignição NGK (Unidade)", codigoSku: "SKU008", precoVenda: 22.50, estoqueAtual: 100 },
];


const orcamentoItemServicoSchema = z.object({
  id: z.string().optional(),
  servicoId: z.string().optional(),
  descricao: z.string().min(3, "Descrição do serviço (mín. 3 caracteres)."),
  valor: z.coerce.number().min(0, "Valor do serviço deve ser positivo ou zero."),
});
type OrcamentoItemServicoValues = z.infer<typeof orcamentoItemServicoSchema>;

const orcamentoItemPecaSchema = z.object({
  id: z.string().optional(),
  codigo: z.string().optional(),
  nome: z.string().min(3, "Nome da peça (mín. 3 caracteres)."),
  quantidade: z.coerce.number().int().min(1, "Quantidade deve ser pelo menos 1."),
  valorUnitario: z.coerce.number().min(0, "Valor unitário deve ser positivo ou zero."),
});
type OrcamentoItemPecaValues = z.infer<typeof orcamentoItemPecaSchema>;

const orcamentoFormSchema = z.object({
  clienteId: z.string({ required_error: "Selecione um cliente." }),
  veiculoId: z.string({ required_error: "Selecione um veículo." }),
  atendenteId: z.string().optional(),
  mecanicoOrcamentistaId: z.string().optional(),
  dataOrcamento: z.date({ required_error: "Data do orçamento é obrigatória." }),
  validadeDias: z.coerce.number().int().min(1, "Validade (mín. 1 dia).").optional().default(7),
  servicos: z.array(orcamentoItemServicoSchema).optional(),
  pecas: z.array(orcamentoItemPecaSchema).optional(),
  observacoes: z.string().optional(),
  descontoValor: z.coerce.number().min(0).optional().default(0),
}).refine(data => (data.servicos && data.servicos.length > 0) || (data.pecas && data.pecas.length > 0), {
  message: "Adicione pelo menos um serviço ou peça ao orçamento.",
  path: ["servicos"], 
});
type OrcamentoFormValues = z.infer<typeof orcamentoFormSchema>;


export default function OrcamentoForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clientes, setClientesState] = React.useState<Cliente[]>([]);
  const [veiculosCliente, setVeiculosCliente] = React.useState<Veiculo[]>([]);
  const [atendentes, setAtendentes] = React.useState<Funcionario[]>([]);
  const [mecanicosOrcamentistas, setMecanicosOrcamentistas] = React.useState<Funcionario[]>([]);
  const [atendenteLogado, setAtendenteLogado] = React.useState<Funcionario | null>(null);

  const [searchTermPeca, setSearchTermPeca] = useState("");
  const [searchResultsPeca, setSearchResultsPeca] = useState<Produto[]>([]);
  const [availableProdutos, setAvailableProdutos] = useState<Produto[]>(mockProdutosCatalogo);

  const [searchTermServico, setSearchTermServico] = useState("");
  const [searchResultsServico, setSearchResultsServico] = useState<TipoServicoPadrao[]>([]);


  const form = useForm<OrcamentoFormValues>({
    resolver: zodResolver(orcamentoFormSchema),
    defaultValues: {
      clienteId: "",
      veiculoId: "",
      atendenteId: "",
      mecanicoOrcamentistaId: "",
      dataOrcamento: new Date(),
      validadeDias: 7,
      servicos: [],
      pecas: [],
      observacoes: "",
      descontoValor: 0,
    },
  });

  const { fields: servicoFields, append: appendServico, remove: removeServico } = useFieldArray({
    control: form.control,
    name: "servicos",
  });

  const { fields: pecaFields, append: appendPeca, remove: removePeca } = useFieldArray({
    control: form.control,
    name: "pecas",
  });

  const selectedClienteId = form.watch("clienteId");

  useEffect(() => {
    setClientesState(getClientes());
    const todosAtendentes = getAtendentes();
    setAtendentes(todosAtendentes);
    setMecanicosOrcamentistas(getMecanicos());
    setAvailableProdutos(mockProdutosCatalogo);

    if (todosAtendentes.length > 0) {
      const primeiroAtendente = todosAtendentes[0];
      setAtendenteLogado(primeiroAtendente);
      form.setValue("atendenteId", primeiroAtendente.id);
    }
  }, [form]);

 useEffect(() => {
    const queryClienteId = searchParams.get("clienteId");
    const queryEntradaId = searchParams.get("entradaId");

    if (queryClienteId) {
      form.setValue("clienteId", queryClienteId);
    }
    if (queryEntradaId) {
        const currentObs = form.getValues("observacoes") || "";
        form.setValue("observacoes", `Baseado na Entrada ID: ${queryEntradaId}${currentObs ? `\n${currentObs}` : ""}`);
    }
  }, [searchParams, form]);


  useEffect(() => {
    const queryVeiculoId = searchParams.get("veiculoId");
    if (selectedClienteId) {
      const clienteTemVeiculos = getVeiculosByClienteId(selectedClienteId);
      setVeiculosCliente(clienteTemVeiculos);

      const veiculoIdAtual = form.getValues("veiculoId");

      if (queryVeiculoId && clienteTemVeiculos.some(v => v.id === queryVeiculoId)) {
        setTimeout(() => form.setValue("veiculoId", queryVeiculoId), 50);
      } else if (veiculoIdAtual && !clienteTemVeiculos.some(v => v.id === veiculoIdAtual)) {
        form.setValue("veiculoId", "");
      }
    } else {
      setVeiculosCliente([]);
      form.setValue("veiculoId", "");
    }
  }, [selectedClienteId, searchParams, form]);


  useEffect(() => {
    if (searchTermPeca.trim().length > 1) {
      const lowerSearchTerm = searchTermPeca.toLowerCase();
      const results = availableProdutos.filter(
        (produto) =>
          produto.nome.toLowerCase().includes(lowerSearchTerm) ||
          produto.codigoSku.toLowerCase().includes(lowerSearchTerm)
      );
      setSearchResultsPeca(results);
    } else {
      setSearchResultsPeca([]);
    }
  }, [searchTermPeca, availableProdutos]);

  const handleSelectProduto = (produto: Produto) => {
    appendPeca({
      id: crypto.randomUUID(),
      codigo: produto.codigoSku,
      nome: produto.nome,
      quantidade: 1,
      valorUnitario: produto.precoVenda,
    });
    setSearchTermPeca("");
    setSearchResultsPeca([]);
  };

  useEffect(() => {
    if (searchTermServico.trim().length > 1) {
      const lowerSearchTerm = searchTermServico.toLowerCase();
      const results = mockTiposServicoPadrao.filter(
        (servico) =>
          servico.nome.toLowerCase().includes(lowerSearchTerm) ||
          (servico.descricaoCurta && servico.descricaoCurta.toLowerCase().includes(lowerSearchTerm)) ||
          (servico.categoria && servico.categoria.toLowerCase().includes(lowerSearchTerm))
      );
      setSearchResultsServico(results);
    } else {
      setSearchResultsServico([]);
    }
  }, [searchTermServico]);

  const handleSelectServico = (servico: TipoServicoPadrao) => {
    if (servico.id === "outro_serv") {
        appendServico({ id: crypto.randomUUID(), servicoId: "outro_serv", descricao: "", valor: 0 });
    } else {
        appendServico({
        id: crypto.randomUUID(),
        servicoId: servico.id,
        descricao: servico.nome,
        valor: servico.valorPadrao || 0,
        });
    }
    setSearchTermServico("");
    setSearchResultsServico([]);
  };


  const watchServicos = form.watch("servicos");
  const watchPecas = form.watch("pecas");
  const watchDesconto = form.watch("descontoValor");

  const totalServicos = useMemo(() => {
    return watchServicos?.reduce((acc, servico) => acc + (servico.valor || 0), 0) || 0;
  }, [watchServicos]);

  const totalPecas = useMemo(() => {
    return watchPecas?.reduce((acc, peca) => acc + (peca.valorUnitario || 0) * (peca.quantidade || 0), 0) || 0;
  }, [watchPecas]);

  const subTotalGeral = totalServicos + totalPecas;
  const totalGeral = subTotalGeral - (watchDesconto || 0);

  async function onSubmit(data: OrcamentoFormValues) {
    console.log("Dados do Orçamento para Salvar:", { ...data, totalServicos, totalPecas, subTotalGeral, totalGeral });
    toast({
      title: "Orçamento Criado (Simulado)",
      description: "O orçamento foi salvo com sucesso (simulação).",
    });
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <FilePlus /> Novo Orçamento
        </h1>
        <Button variant="outline" asChild className="w-full md:w-auto">
          <Link href="/dashboard/orcamentos">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Orçamentos
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Informações Principais</CardTitle>
              <CardDescription>Dados do cliente, veículo, responsáveis e validade do orçamento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="clienteId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><User className="h-4 w-4" /> Cliente*</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione o cliente" /></SelectTrigger></FormControl>
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
                        <FormControl><SelectTrigger><SelectValue placeholder={!selectedClienteId ? "Selecione um cliente" : (veiculosCliente.length === 0 ? "Nenhum veículo" : "Selecione o veículo")} /></SelectTrigger></FormControl>
                        <SelectContent>
                          {veiculosCliente.map(veiculo => (
                            <SelectItem key={veiculo.id} value={veiculo.id}>{veiculo.marca} {veiculo.modelo} - {veiculo.placa}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedClienteId && veiculosCliente.length === 0 && (
                        <FormDescription className="text-xs text-destructive">
                          Este cliente não possui veículos cadastrados. <Link href={`/dashboard/veiculos/novo?clienteId=${selectedClienteId}`} className="underline">Cadastrar veículo?</Link>
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6 items-end">
                 <div>
                    <FormLabel className="flex items-center gap-1 text-sm font-medium"><UserCheck className="h-4 w-4"/> Atendente</FormLabel>
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50 h-10">
                        {atendenteLogado ? (
                            <>
                            <UserCheck className="h-4 w-4 text-muted-foreground"/>
                            <span className="text-sm text-muted-foreground">{atendenteLogado.nome} (Automático)</span>
                            </>
                        ) : (
                            <span className="text-sm text-muted-foreground">Carregando atendente...</span>
                        )}
                    </div>
                    <FormDescription className="text-xs">Atendente logado no sistema.</FormDescription>
                 </div>
                <FormField
                  control={form.control}
                  name="mecanicoOrcamentistaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><UserCog className="h-4 w-4" /> Mecânico Orçamentista (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione o mecânico" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {mecanicosOrcamentistas.map(mecanico => (
                            <SelectItem key={mecanico.id} value={mecanico.id}>{mecanico.nome}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="dataOrcamento"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data do Orçamento*</FormLabel>
                      <Popover><PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={ptBR}/>
                      </PopoverContent></Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="validadeDias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validade do Orçamento (dias)*</FormLabel>
                      <FormControl><Input type="number" placeholder="Ex: 7" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Serviços (Mão de Obra)</CardTitle>
              <CardDescription>Adicione os serviços a serem realizados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2 mb-4">
                    <Label htmlFor="searchServico" className="flex items-center gap-1"><SearchIcon className="h-4 w-4"/> Buscar e Adicionar Serviço</Label>
                    <div className="flex gap-2">
                        <Input
                        id="searchServico"
                        placeholder="Digite nome, categoria ou descrição do serviço..."
                        value={searchTermServico}
                        onChange={(e) => setSearchTermServico(e.target.value)}
                        />
                    </div>
                    {searchTermServico && searchResultsServico.length > 0 && (
                        <Card className="mt-2 max-h-48 overflow-y-auto border shadow-md">
                        <CardContent className="p-1 space-y-0.5">
                            {searchResultsServico.map((servico) => (
                            <Button
                                key={servico.id}
                                type="button"
                                variant="ghost"
                                className="w-full justify-start h-auto p-2 text-left hover:bg-muted/80"
                                onClick={() => handleSelectServico(servico)}
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
                    {searchTermServico && searchResultsServico.length === 0 && (
                        <p className="text-sm text-muted-foreground mt-1">Nenhum serviço encontrado com "{searchTermServico}".</p>
                    )}
                </div>
                
              {servicoFields.length > 0 && <Separator className="my-4" />}
              {servicoFields.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-md space-y-3 bg-muted/30 relative">
                  <div className="flex justify-between items-center">
                    <FormLabel className="font-semibold">Serviço {index + 1}</FormLabel>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeServico(index)} className="text-destructive hover:text-destructive absolute top-2 right-2 h-7 w-7">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormField control={form.control} name={`servicos.${index}.descricao`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição do Serviço*</FormLabel>
                        <FormControl><Input placeholder="Ex: Troca de pastilhas de freio dianteiras" {...field} disabled={item.servicoId !== undefined && item.servicoId !== "outro_serv"} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name={`servicos.${index}.valor`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor do Serviço (R$)*</FormLabel>
                        <FormControl><Input type="number" placeholder="Ex: 120.00" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              {servicoFields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">Nenhum serviço adicionado. Use a busca acima ou adicione manualmente.</p>
              )}
              <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => appendServico({ id: crypto.randomUUID(), descricao: "", valor: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Serviço Manualmente
              </Button>
               <FormMessage>{form.formState.errors.servicos?.message || form.formState.errors.servicos?.root?.message}</FormMessage>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Peças</CardTitle>
              <CardDescription>Adicione as peças necessárias para o serviço.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 mb-4">
                <Label htmlFor="searchPeca" className="flex items-center gap-1"><SearchIcon className="h-4 w-4"/> Buscar e Adicionar Peça</Label>
                <div className="flex gap-2">
                  <Input
                    id="searchPeca"
                    placeholder="Digite nome ou código da peça..."
                    value={searchTermPeca}
                    onChange={(e) => setSearchTermPeca(e.target.value)}
                  />
                </div>
                {searchTermPeca && searchResultsPeca.length > 0 && (
                  <Card className="mt-2 max-h-48 overflow-y-auto border shadow-md">
                    <CardContent className="p-1 space-y-0.5">
                      {searchResultsPeca.map((produto) => (
                        <Button
                          key={produto.id}
                          type="button"
                          variant="ghost"
                          className="w-full justify-start h-auto p-2 text-left hover:bg-muted/80"
                          onClick={() => handleSelectProduto(produto)}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{produto.nome}</span>
                            <span className="text-xs text-muted-foreground">
                              SKU: {produto.codigoSku || 'N/A'} | Preço: R$ {produto.precoVenda.toFixed(2)} | Estoque: {produto.estoqueAtual ?? 'N/A'}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </CardContent>
                  </Card>
                )}
                {searchTermPeca && searchResultsPeca.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">Nenhuma peça encontrada com "{searchTermPeca}".</p>
                )}
              </div>

              {pecaFields.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Nome da Peça*</TableHead>
                        <TableHead>Código (Opc.)</TableHead>
                        <TableHead className="w-[100px] text-center">Qtd.*</TableHead>
                        <TableHead className="w-[120px] text-right">Vlr. Unit.*</TableHead>
                        <TableHead className="w-[120px] text-right">Vlr. Total</TableHead>
                        <TableHead className="w-[60px] text-center">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pecaFields.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <FormField control={form.control} name={`pecas.${index}.nome`}
                              render={({ field }) => (<FormItem><FormControl><Input placeholder="Ex: Pastilha XPTO" {...field} className="h-9"/></FormControl><FormMessage className="text-xs"/></FormItem>)}
                            />
                          </TableCell>
                          <TableCell>
                             <FormField control={form.control} name={`pecas.${index}.codigo`}
                              render={({ field }) => (<FormItem><FormControl><Input placeholder="Ex: XYZ-123" {...field} className="h-9"/></FormControl><FormMessage className="text-xs"/></FormItem>)}
                            />
                          </TableCell>
                          <TableCell>
                             <FormField control={form.control} name={`pecas.${index}.quantidade`}
                              render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="1" {...field} className="h-9 text-center"/></FormControl><FormMessage className="text-xs"/></FormItem>)}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField control={form.control} name={`pecas.${index}.valorUnitario`}
                              render={({ field }) => (<FormItem><FormControl><Input type="number" placeholder="85.50" {...field} className="h-9 text-right"/></FormControl><FormMessage className="text-xs"/></FormItem>)}
                            />
                          </TableCell>
                          <TableCell className="text-right h-9 leading-9">
                            R$ {((form.watch(`pecas.${index}.valorUnitario`) || 0) * (form.watch(`pecas.${index}.quantidade`) || 0)).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button type="button" variant="ghost" size="icon" onClick={() => removePeca(index)} className="text-destructive hover:text-destructive h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {pecaFields.length === 0 && (
                 <p className="text-sm text-muted-foreground text-center py-2">Nenhuma peça adicionada. Use a busca acima.</p>
              )}
              <FormMessage>{form.formState.errors.pecas?.message || form.formState.errors.pecas?.root?.message}</FormMessage>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader><CardTitle>Resumo e Finalização</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6 items-end">
                    <FormField
                        control={form.control}
                        name="descontoValor"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1"><Percent className="h-4 w-4"/> Desconto (R$)</FormLabel>
                            <FormControl><Input type="number" placeholder="Ex: 50.00" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Subtotal Serviços: <span className="font-bold text-foreground">R$ {totalServicos.toFixed(2)}</span></p>
                        <p className="text-sm font-medium text-muted-foreground">Subtotal Peças: <span className="font-bold text-foreground">R$ {totalPecas.toFixed(2)}</span></p>
                    </div>
                     <div className="text-right md:text-left">
                        <p className="text-lg font-semibold text-muted-foreground">Total Geral:</p>
                        <p className="text-3xl font-bold text-primary">R$ {totalGeral.toFixed(2)}</p>
                    </div>
                </div>
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Adicionais (Opcional)</FormLabel>
                    <FormControl><Textarea placeholder="Condições de pagamento, detalhes do serviço, garantias, etc." {...field} rows={3} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6 border-t">
                <FormMessage>{form.formState.errors.root?.message}</FormMessage>
                <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/dashboard/orcamentos">Cancelar</Link>
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" /> Salvar Orçamento
                </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}

