
"use client";

import React, { useEffect } from "react"; 
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, FilePlus, User, Car, CalendarIcon, PlusCircle, Trash2, DollarSign, Percent, ListPlus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getClientes, Cliente } from "@/lib/mockData/clientes";
import { getVeiculosByClienteId, Veiculo } from "@/lib/mockData/veiculos";


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


// Schemas para itens e formulário principal
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
  dataOrcamento: z.date({ required_error: "Data do orçamento é obrigatória." }),
  validadeDias: z.coerce.number().int().min(1, "Validade (mín. 1 dia).").optional().default(7),
  servicos: z.array(orcamentoItemServicoSchema).optional(),
  pecas: z.array(orcamentoItemPecaSchema).optional(),
  observacoes: z.string().optional(),
  descontoValor: z.coerce.number().min(0).optional().default(0),
  servicoPreCadastradoSelecionado: z.string().optional(), 
}).refine(data => (data.servicos && data.servicos.length > 0) || (data.pecas && data.pecas.length > 0), {
  message: "Adicione pelo menos um serviço ou peça ao orçamento.",
  path: ["servicos"], 
});

type OrcamentoFormValues = z.infer<typeof orcamentoFormSchema>;

export default function NovoOrcamentoPage() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [clientes, setClientesState] = React.useState<Cliente[]>([]);
  const [veiculosCliente, setVeiculosCliente] = React.useState<Veiculo[]>([]);

  const form = useForm<OrcamentoFormValues>({
    resolver: zodResolver(orcamentoFormSchema),
    defaultValues: {
      clienteId: "",
      veiculoId: "",
      dataOrcamento: new Date(),
      validadeDias: 7,
      servicos: [], 
      pecas: [],
      observacoes: "",
      descontoValor: 0,
      servicoPreCadastradoSelecionado: "",
    },
  });

  const { fields: servicoFields, append: appendServico, remove: removeServico, update: updateServico } = useFieldArray({
    control: form.control,
    name: "servicos",
  });

  const { fields: pecaFields, append: appendPeca, remove: removePeca } = useFieldArray({
    control: form.control,
    name: "pecas",
  });

  const selectedClienteId = form.watch("clienteId");

  React.useEffect(() => {
    setClientesState(getClientes());
  }, []);

  // Preencher cliente e veículo se vierem da query
  useEffect(() => {
    const queryClienteId = searchParams.get("clienteId");
    const queryVeiculoId = searchParams.get("veiculoId");
    const queryEntradaId = searchParams.get("entradaId");

    if (queryClienteId) {
      form.setValue("clienteId", queryClienteId);
      // A lógica de carregar veículos do cliente será ativada pelo watch de selectedClienteId
      if (queryVeiculoId) {
         // Necessário um timeout pequeno para garantir que os veículos do cliente sejam carregados ANTES de tentar setar o veiculoId
         // Isso ocorre porque o useEffect que carrega os veículos do cliente depende de selectedClienteId, que é setado aqui.
        setTimeout(() => {
          form.setValue("veiculoId", queryVeiculoId);
        }, 100); // Aumentado ligeiramente o timeout para garantir
      }
    }
    if (queryEntradaId) {
        const currentObs = form.getValues("observacoes") || "";
        form.setValue("observacoes", `Baseado na Entrada ID: ${queryEntradaId}${currentObs ? `\n${currentObs}` : ""}`);
    }
  }, [searchParams, form]);


  React.useEffect(() => {
    if (selectedClienteId) {
      const clienteTemVeiculos = getVeiculosByClienteId(selectedClienteId);
      setVeiculosCliente(clienteTemVeiculos);
      
      const veiculoAtualValor = form.getValues("veiculoId");
      const veiculoAtualPertenceAoCliente = clienteTemVeiculos.some(v => v.id === veiculoAtualValor);

      // Só limpa o veiculoId se ele não pertencer ao novo cliente E não for o veiculoId vindo da URL (para evitar limpar antes de preencher)
      const queryVeiculoId = searchParams.get("veiculoId");
      if (!veiculoAtualPertenceAoCliente && veiculoAtualValor !== queryVeiculoId) {
          form.setValue("veiculoId", "");
      }

    } else {
      setVeiculosCliente([]);
      form.setValue("veiculoId", "");
    }
  }, [selectedClienteId, form, searchParams]);


  const watchServicos = form.watch("servicos");
  const watchPecas = form.watch("pecas");
  const watchDesconto = form.watch("descontoValor");
  const watchServicoPreCadastrado = form.watch("servicoPreCadastradoSelecionado");


  React.useEffect(() => {
    if (watchServicoPreCadastrado) {
      const servico = mockTiposServicoPadrao.find(s => s.id === watchServicoPreCadastrado);
      if (servico && servico.id !== "outro_serv") { 
        const novoServico: OrcamentoItemServicoValues = {
            id: crypto.randomUUID(),
            servicoId: servico.id,
            descricao: servico.nome,
            valor: servico.valorPadrao || 0,
        };
        appendServico(novoServico);
        form.setValue("servicoPreCadastradoSelecionado", ""); 
      } else if (servico && servico.id === "outro_serv") {
         appendServico({ id: crypto.randomUUID(), servicoId: "outro_serv", descricao: "", valor: 0 });
         form.setValue("servicoPreCadastradoSelecionado", ""); 
      }
    }
  }, [watchServicoPreCadastrado, appendServico, form]);


  const totalServicos = React.useMemo(() => {
    return watchServicos?.reduce((acc, servico) => acc + (servico.valor || 0), 0) || 0;
  }, [watchServicos]);

  const totalPecas = React.useMemo(() => {
    return watchPecas?.reduce((acc, peca) => acc + (peca.valorUnitario || 0) * (peca.quantidade || 0), 0) || 0;
  }, [watchPecas]);
  
  const subTotalGeral = totalServicos + totalPecas;
  const totalGeral = subTotalGeral - (watchDesconto || 0);


  async function onSubmit(data: OrcamentoFormValues) {
    console.log({ ...data, totalServicos, totalPecas, subTotalGeral, totalGeral });
    toast({
      title: "Orçamento Criado (Simulado)",
      description: "O orçamento foi salvo com sucesso (simulação).",
    });
    // form.reset(); // Opcional
    // router.push("/dashboard/orcamentos");
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
              <CardDescription>Dados do cliente, veículo e validade do orçamento.</CardDescription>
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

          {/* Itens de Serviço */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Serviços (Mão de Obra)</CardTitle>
              <CardDescription>Adicione os serviços a serem realizados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <FormField
                  control={form.control}
                  name="servicoPreCadastradoSelecionado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><ListPlus className="h-4 w-4"/> Adicionar Serviço Pré-Cadastrado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione um serviço para adicionar..." /></SelectTrigger></FormControl>
                        <SelectContent>
                          {mockTiposServicoPadrao.map(serv => (
                            <SelectItem key={serv.id} value={serv.id}>
                              {serv.nome} {serv.valorPadrao ? `(R$ ${serv.valorPadrao.toFixed(2)})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Selecionar um serviço aqui o adicionará à lista abaixo. "Outro Serviço" adiciona um item em branco.</FormDescription>
                    </FormItem>
                  )}
                />

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
                <p className="text-sm text-muted-foreground text-center py-2">Nenhum serviço adicionado. Use o seletor acima ou adicione um serviço manual.</p>
              )}
              <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => appendServico({ id: crypto.randomUUID(), descricao: "", valor: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Serviço Manualmente
              </Button>
               <FormMessage>{form.formState.errors.servicos?.message || form.formState.errors.servicos?.root?.message}</FormMessage>
            </CardContent>
          </Card>

          {/* Itens de Peças */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Peças</CardTitle>
              <CardDescription>Adicione as peças necessárias para o serviço.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pecaFields.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-md space-y-3 bg-muted/30 relative">
                   <div className="flex justify-between items-center">
                        <FormLabel className="font-semibold">Peça {index + 1}</FormLabel>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removePeca(index)} className="text-destructive hover:text-destructive absolute top-2 right-2 h-7 w-7">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                   </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name={`pecas.${index}.codigo`}
                      render={({ field }) => (
                        <FormItem><FormLabel>Código da Peça (Opcional)</FormLabel><FormControl><Input placeholder="Ex: XYZ-123" {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField control={form.control} name={`pecas.${index}.nome`}
                      render={({ field }) => (
                        <FormItem><FormLabel>Nome da Peça*</FormLabel><FormControl><Input placeholder="Ex: Pastilha de Freio Dianteira XPTO" {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name={`pecas.${index}.quantidade`}
                      render={({ field }) => (
                        <FormItem><FormLabel>Quantidade*</FormLabel><FormControl><Input type="number" placeholder="Ex: 2" {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                    <FormField control={form.control} name={`pecas.${index}.valorUnitario`}
                      render={({ field }) => (
                        <FormItem><FormLabel>Valor Unit. (R$)*</FormLabel><FormControl><Input type="number" placeholder="Ex: 85.50" {...field} /></FormControl><FormMessage /></FormItem>
                      )}
                    />
                     <FormItem>
                        <FormLabel>Valor Total Peça (R$)</FormLabel>
                        <Input readOnly disabled value={((form.watch(`pecas.${index}.valorUnitario`) || 0) * (form.watch(`pecas.${index}.quantidade`) || 0)).toFixed(2)} />
                    </FormItem>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => appendPeca({ id: crypto.randomUUID(), nome: "", quantidade: 1, valorUnitario: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Peça
              </Button>
              <FormMessage>{form.formState.errors.pecas?.message || form.formState.errors.pecas?.root?.message}</FormMessage>
            </CardContent>
          </Card>
          
          {/* Totais e Observações */}
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
                <FormMessage>{form.formState.errors.root?.message}</FormMessage> {/* Para o refine geral */}
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
