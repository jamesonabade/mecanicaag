
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Search, UserPlus, CarIcon, FilePlus, ArrowRight, LogIn, Edit, Trash2, PlusCircle, ImageIcon } from "lucide-react"; 
import { Cliente, addCliente as addClienteDB, getClientes as getClientesDB, getClienteById as getClienteDBById } from "@/lib/mockData/clientes";
import { Veiculo, addVeiculo as addVeiculoDB, getVeiculosByClienteId as getVeiculosDBByClienteId, getVeiculoById as getVeiculoDBById } from "@/lib/mockData/veiculos";


// --- Interfaces (Locais ou importadas, se necessário) ---
type StatusProgressoEntrada = "Aguardando Cliente" | "Aguardando Veículo" | "Aguardando Orçamento" | "Orçamento Iniciado";

interface EntradaEmProgresso {
  id: string;
  cliente?: Cliente;
  veiculo?: Veiculo;
  statusProgressoEntrada: StatusProgressoEntrada;
  dataCriacao: string;
  entradaId?: string; // Adicionado para referenciar a entrada original, se aplicável
}

// --- Schemas Zod (para os formulários do Dialog) ---
const estadosBrasil = [
  { value: "AC", label: "Acre" }, { value: "AL", label: "Alagoas" }, { value: "AP", label: "Amapá" }, 
  { value: "AM", label: "Amazonas" }, { value: "BA", label: "Bahia" }, { value: "CE", label: "Ceará" }, 
  { value: "DF", label: "Distrito Federal" }, { value: "ES", label: "Espírito Santo" }, { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" }, { value: "MT", label: "Mato Grosso" }, { value: "MS", label: "Mato Grosso do Sul" }, 
  { value: "MG", label: "Minas Gerais" }, { value: "PA", label: "Pará" }, { value: "PB", label: "Paraíba" }, 
  { value: "PR", label: "Paraná" }, { value: "PE", label: "Pernambuco" }, { value: "PI", label: "Piauí" }, 
  { value: "RJ", label: "Rio de Janeiro" }, { value: "RN", label: "Rio Grande do Norte" }, { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" }, { value: "RR", label: "Roraima" }, { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" }, { value: "SE", label: "Sergipe" }, { value: "TO", label: "Tocantins" },
];

const clienteFormSchemaDialog = z.object({
  nomeCompleto: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  cpfCnpj: z.string().min(11, { message: "CPF/CNPJ inválido." }).max(18, { message: "CPF/CNPJ inválido." }),
  telefone: z.string().min(10, { message: "Telefone inválido." }),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal('')),
  cep: z.string().length(8, { message: "CEP deve ter 8 dígitos." }).optional().or(z.literal('')),
  logradouro: z.string().optional(), numero: z.string().optional(), complemento: z.string().optional(),
  bairro: z.string().optional(), cidade: z.string().optional(), estado: z.string().optional(), observacoes: z.string().optional(),
});
type ClienteFormValuesDialog = z.infer<typeof clienteFormSchemaDialog>;

const anoAtual = new Date().getFullYear();
const veiculoFormSchemaDialog = z.object({
  placa: z.string().min(7, { message: "Placa deve ter pelo menos 7 caracteres." }).max(8, {message: "Placa inválida."}),
  marca: z.string().min(2, { message: "Marca é obrigatória." }),
  modelo: z.string().min(2, { message: "Modelo é obrigatório." }),
  anoFabricacao: z.coerce.number().int().min(1900, { message: "Ano de fabricação inválido." }).max(anoAtual, { message: `Ano de fabricação não pode ser futuro (máx. ${anoAtual}).` }).optional(),
  anoModelo: z.coerce.number().int().min(1900, { message: "Ano do modelo inválido." }).max(anoAtual + 1, { message: `Ano do modelo não pode ser muito futuro (máx. ${anoAtual + 1}).` }).optional(),
  cor: z.string().min(2, { message: "Cor é obrigatória." }).optional(),
  chassi: z.string().length(17, { message: "Chassi deve ter 17 caracteres." }).optional().or(z.literal('')),
  renavam: z.string().min(9, { message: "RENAVAM inválido (mín 9 dígitos)."}).max(11, { message: "RENAVAM inválido (máx 11 dígitos)."}).optional().or(z.literal('')),
  quilometragem: z.coerce.number().int().min(0, { message: "Quilometragem não pode ser negativa." }).optional(),
  imageUrl: z.string().url({ message: "URL da imagem inválido. Ex: https://exemplo.com/imagem.png" }).optional().or(z.literal('')),
  observacoes: z.string().optional(),
});
type VeiculoFormValuesDialog = z.infer<typeof veiculoFormSchemaDialog>;

const mockEntradasIniciais: EntradaEmProgresso[] = [
  {
    id: `ENT-${Date.now() - 10000}`,
    cliente: getClienteDBById("cli_modelo_001"),
    veiculo: getVeiculoDBById("vec_modelo_001"),
    statusProgressoEntrada: "Aguardando Orçamento",
    dataCriacao: new Date(Date.now() - 10000).toISOString(),
  },
  {
    id: `ENT-${Date.now() - 20000}`,
    cliente: getClienteDBById("cli_002_maria"),
    veiculo: undefined, 
    statusProgressoEntrada: "Aguardando Veículo",
    dataCriacao: new Date(Date.now() - 20000).toISOString(),
  },
  {
    id: `ENT-${Date.now() - 5000}`,
    cliente: getClienteDBById("cli_modelo_001"),
    veiculo: getVeiculoDBById("vec_002_strada"),
    statusProgressoEntrada: "Orçamento Iniciado", 
    dataCriacao: new Date(Date.now() - 5000).toISOString(),
    entradaId: `ENT-${Date.now() - 5000}`
  },
    {
    id: `ENT-${Date.now() - 30000}`,
    cliente: undefined, 
    veiculo: undefined,
    statusProgressoEntrada: "Aguardando Cliente",
    dataCriacao: new Date(Date.now() - 30000).toISOString(),
  },
];


export default function PaginaEntradasVeiculos() {
  const { toast } = useToast();
  const router = useRouter();

  const [listaEntradas, setListaEntradas] = useState<EntradaEmProgresso[]>(mockEntradasIniciais.sort((a,b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()));
  const [showNovaEntradaDialog, setShowNovaEntradaDialog] = useState(false);
  
  const [dialogStep, setDialogStep] = useState<"cliente" | "veiculo" | "finalizar">("cliente");
  const [dialogEntradaId, setDialogEntradaId] = useState<string | null>(null);
  const [dialogSelectedCliente, setDialogSelectedCliente] = useState<Cliente | null>(null);
  const [dialogSelectedVeiculo, setDialogSelectedVeiculo] = useState<Veiculo | null>(null);
  
  const [clientesDataSource, setClientesDataSource] = useState<Cliente[]>(getClientesDB());
  const [veiculosDataSource, setVeiculosDataSource] = useState<Veiculo[]>([]);
  
  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [searchResultsCliente, setSearchResultsCliente] = useState<Cliente[]>([]);
  const [showNovoClienteForm, setShowNovoClienteForm] = useState(false);

  const [searchTermVeiculo, setSearchTermVeiculo] = useState("");
  const [searchResultsVeiculo, setSearchResultsVeiculo] = useState<Veiculo[]>([]);
  const [showNovoVeiculoForm, setShowNovoVeiculoForm] = useState(false);

  const formClienteDialog = useForm<ClienteFormValuesDialog>({ resolver: zodResolver(clienteFormSchemaDialog) });
  const formVeiculoDialog = useForm<VeiculoFormValuesDialog>({ resolver: zodResolver(veiculoFormSchemaDialog) });

  useEffect(() => {
    setClientesDataSource(getClientesDB());
  }, [showNovaEntradaDialog]); 

  useEffect(() => {
    if (searchTermCliente.length > 2) {
      setSearchResultsCliente(
        clientesDataSource.filter(c => c.nomeCompleto.toLowerCase().includes(searchTermCliente.toLowerCase()) || c.cpfCnpj.includes(searchTermCliente))
      );
    } else {
      setSearchResultsCliente([]);
    }
  }, [searchTermCliente, clientesDataSource]);

  useEffect(() => {
    if (dialogSelectedCliente) {
      const veiculosDoCliente = getVeiculosDBByClienteId(dialogSelectedCliente.id);
      setVeiculosDataSource(veiculosDoCliente);
      if (searchTermVeiculo.length >= 2) {
        setSearchResultsVeiculo(
          veiculosDoCliente.filter(v => v.placa.toLowerCase().includes(searchTermVeiculo.toLowerCase()) || v.modelo.toLowerCase().includes(searchTermVeiculo.toLowerCase()))
        );
      } else {
        setSearchResultsVeiculo([]);
      }
    } else {
      setVeiculosDataSource([]);
      setSearchResultsVeiculo([]);
    }
  }, [searchTermVeiculo, dialogSelectedCliente]);

  const handleIniciarNovaEntrada = () => {
    const newEntradaId = `ENT-${Date.now()}`;
    setDialogEntradaId(newEntradaId);
    setDialogSelectedCliente(null);
    setDialogSelectedVeiculo(null);
    setSearchTermCliente("");
    setSearchTermVeiculo("");
    setShowNovoClienteForm(false);
    setShowNovoVeiculoForm(false);
    formClienteDialog.reset();
    formVeiculoDialog.reset();
    setDialogStep("cliente");
    setShowNovaEntradaDialog(true);
  };
  
  const handleSelecionarClienteDialog = (cliente: Cliente) => {
    setDialogSelectedCliente(cliente);
    setSearchTermCliente("");
    setSearchResultsCliente([]);
    setShowNovoClienteForm(false);
    setDialogStep("veiculo");
  };

  const handleCadastrarClienteDialog = (data: ClienteFormValuesDialog) => {
    const novoCliente = addClienteDB(data);
    setClientesDataSource(getClientesDB()); 
    setDialogSelectedCliente(novoCliente);
    setShowNovoClienteForm(false);
    setDialogStep("veiculo");
    toast({ title: "Cliente Cadastrado!", description: `${novoCliente.nomeCompleto} foi adicionado.` });
    formClienteDialog.reset();
  };

  const handleSelecionarVeiculoDialog = (veiculo: Veiculo) => {
    setDialogSelectedVeiculo(veiculo);
    setSearchTermVeiculo("");
    setSearchResultsVeiculo([]);
    setShowNovoVeiculoForm(false);
    setDialogStep("finalizar");
  };

  const handleCadastrarVeiculoDialog = (data: VeiculoFormValuesDialog) => {
    if (!dialogSelectedCliente) return;
    const novoVeiculo = addVeiculoDB({ ...data, clienteId: dialogSelectedCliente.id });
    setVeiculosDataSource(getVeiculosDBByClienteId(dialogSelectedCliente.id)); 
    setDialogSelectedVeiculo(novoVeiculo);
    setShowNovoVeiculoForm(false);
    setDialogStep("finalizar");
    toast({ title: "Veículo Cadastrado!", description: `${novoVeiculo.marca} ${novoVeiculo.modelo} (${novoVeiculo.placa}) foi adicionado.` });
    formVeiculoDialog.reset();
  };

  const handleConcluirDialogNovaEntrada = () => {
    if (dialogEntradaId && dialogSelectedCliente && dialogSelectedVeiculo) {
      const novaEntrada: EntradaEmProgresso = {
        id: dialogEntradaId,
        cliente: dialogSelectedCliente,
        veiculo: dialogSelectedVeiculo,
        statusProgressoEntrada: "Aguardando Orçamento",
        dataCriacao: new Date().toISOString(),
        entradaId: dialogEntradaId,
      };
      setListaEntradas(prev => [...prev.filter(e => e.id !== novaEntrada.id), novaEntrada].sort((a,b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()));
      setShowNovaEntradaDialog(false);
      toast({ title: "Entrada Registrada", description: `Entrada ${novaEntrada.id} pronta para orçamento.` });
    } else {
      toast({ variant: "destructive", title: "Erro", description: "Cliente e Veículo devem ser definidos." });
    }
  };

  const handleContinuarParaOrcamento = (entradaId: string) => {
    const entrada = listaEntradas.find(e => e.id === entradaId);
    if (entrada && entrada.cliente && entrada.veiculo) {
      setListaEntradas(prev => prev.map(e => e.id === entradaId ? { ...e, statusProgressoEntrada: "Orçamento Iniciado" } : e));
      router.push(`/dashboard/orcamentos/novo?clienteId=${entrada.cliente.id}&veiculoId=${entrada.veiculo.id}&entradaId=${entrada.id}`);
    }
  };
  
  const handleRemoverEntrada = (entradaId: string) => {
    setListaEntradas(prev => prev.filter(e => e.id !== entradaId));
    toast({ title: "Entrada Removida", description: `A entrada ${entradaId} foi removida da lista.` });
  };


  const getStatusBadgeVariant = (status: StatusProgressoEntrada): "default" | "secondary" | "outline" | "destructive" => {
    if (status === "Aguardando Orçamento") return "default";
    if (status === "Orçamento Iniciado") return "outline"; // Azul
    return "secondary"; // Cinza para os outros
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><LogIn className="h-7 w-7"/> Gerenciamento de Entradas de Veículos</h1>
        <div className="flex gap-2">
            <Button onClick={handleIniciarNovaEntrada}><PlusCircle className="mr-2 h-4 w-4"/> Iniciar Nova Entrada</Button>
            <Button variant="outline" asChild><Link href="/dashboard"><ChevronLeft className="mr-2 h-4 w-4"/> Voltar ao Painel</Link></Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Entradas de Veículos em Progresso</CardTitle>
          <CardDescription>Acompanhe os veículos que deram entrada e estão aguardando os próximos passos.</CardDescription>
        </CardHeader>
        <CardContent>
          {listaEntradas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Entrada</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listaEntradas.map((entrada) => (
                  <TableRow key={entrada.id}>
                    <TableCell className="font-medium">{entrada.id}</TableCell>
                    <TableCell>{entrada.cliente?.nomeCompleto || "N/A"}</TableCell>
                    <TableCell>{entrada.veiculo ? `${entrada.veiculo.marca} ${entrada.veiculo.modelo} (${entrada.veiculo.placa})` : "N/A"}</TableCell>
                    <TableCell>{format(new Date(entrada.dataCriacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell><Badge variant={getStatusBadgeVariant(entrada.statusProgressoEntrada)}>{entrada.statusProgressoEntrada}</Badge></TableCell>
                    <TableCell className="text-right space-x-1">
                      {entrada.statusProgressoEntrada === "Aguardando Orçamento" && (
                        <Button variant="default" size="sm" onClick={() => handleContinuarParaOrcamento(entrada.id)}>
                          <FilePlus className="mr-1 h-4 w-4"/> Criar Orçamento
                        </Button>
                      )}
                       {(entrada.statusProgressoEntrada === "Aguardando Cliente" || entrada.statusProgressoEntrada === "Aguardando Veículo") && (
                         <Button variant="outline" size="sm" onClick={() => {
                            setDialogEntradaId(entrada.id);
                            setDialogSelectedCliente(entrada.cliente || null);
                            setDialogSelectedVeiculo(entrada.veiculo || null);
                            formClienteDialog.reset(entrada.cliente || {});
                            formVeiculoDialog.reset(entrada.veiculo || {});
                            setDialogStep(entrada.statusProgressoEntrada === "Aguardando Cliente" ? "cliente" : "veiculo");
                            setShowNovaEntradaDialog(true);
                         }}>
                           <Edit className="mr-1 h-4 w-4"/> Continuar
                         </Button>
                       )}
                       <Button variant="ghost" size="icon" onClick={() => handleRemoverEntrada(entrada.id)} className="text-destructive hover:text-destructive">
                           <Trash2 className="h-4 w-4"/>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <LogIn className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p>Nenhuma entrada de veículo em progresso.</p>
              <p className="text-sm">Clique em "Iniciar Nova Entrada" para começar.</p>
            </div>
          )}
        </CardContent>
         <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Total de {listaEntradas.length} entradas na lista.</p>
        </CardFooter>
      </Card>

      
      <Dialog open={showNovaEntradaDialog} onOpenChange={setShowNovaEntradaDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Nova Entrada de Veículo (ID: {dialogEntradaId || "..."}) - Etapa: {
                dialogStep === "cliente" ? "1. Cliente" : dialogStep === "veiculo" ? "2. Veículo" : "3. Concluir"
            }</DialogTitle>
          </DialogHeader>
          
          <div className="flex-grow overflow-y-auto p-1 space-y-6">
            {dialogStep === "cliente" && (
            <Card>
                <CardHeader><CardTitle>Identificar Cliente</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                {!dialogSelectedCliente ? (
                    <>
                    <div className="space-y-1">
                        <Label htmlFor="buscaClienteDialog">Buscar Cliente (Nome, CPF/CNPJ)</Label>
                        <Input id="buscaClienteDialog" placeholder="Digite para buscar..." value={searchTermCliente} onChange={(e) => setSearchTermCliente(e.target.value)} />
                    </div>
                    {searchResultsCliente.length > 0 && (
                        <div className="border rounded-md max-h-32 overflow-y-auto">
                        {searchResultsCliente.map((c) => ( <Button key={c.id} variant="ghost" className="w-full justify-start p-2 h-auto" onClick={() => handleSelecionarClienteDialog(c)}>{c.nomeCompleto} ({c.cpfCnpj})</Button> ))}
                        </div>
                    )}
                    {searchTermCliente.length > 2 && searchResultsCliente.length === 0 && !showNovoClienteForm && (<p className="text-sm text-muted-foreground">Nenhum cliente encontrado. Cadastre abaixo.</p>)}
                    <Button variant="secondary" onClick={() => { setShowNovoClienteForm(true); setSearchTermCliente(""); setSearchResultsCliente([]); formClienteDialog.reset(); }} disabled={showNovoClienteForm}><UserPlus className="mr-2 h-4 w-4" /> Cadastrar Novo Cliente</Button>
                    
                    {showNovoClienteForm && (
                        <Form {...formClienteDialog}>
                        <form onSubmit={formClienteDialog.handleSubmit(handleCadastrarClienteDialog)} className="space-y-3 pt-3 border-t">
                            <FormField control={formClienteDialog.control} name="nomeCompleto" render={({ field }) => (<FormItem><FormLabel>Nome Completo*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formClienteDialog.control} name="cpfCnpj" render={({ field }) => (<FormItem><FormLabel>CPF/CNPJ*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formClienteDialog.control} name="telefone" render={({ field }) => (<FormItem><FormLabel>Telefone*</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formClienteDialog.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formClienteDialog.control} name="observacoes" render={({ field }) => (<FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea placeholder="Preferências, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <DialogFooter className="pt-4">
                                <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                <Button type="submit">Salvar Cliente</Button>
                            </DialogFooter>
                        </form>
                        </Form>
                    )}
                    </>
                ) : (
                    <div className="p-3 bg-primary/10 text-primary-foreground rounded-md border border-primary">
                        <p className="font-semibold text-primary">{dialogSelectedCliente.nomeCompleto}</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-primary-foreground/80 hover:text-primary-foreground" onClick={() => {setDialogSelectedCliente(null); setSearchTermCliente("");}}>Trocar Cliente</Button>
                    </div>
                )}
                </CardContent>
            </Card>
            )}

            {dialogStep === "veiculo" && dialogSelectedCliente && (
            <Card>
                <CardHeader><CardTitle>Identificar Veículo de {dialogSelectedCliente.nomeCompleto.split(" ")[0]}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                {!dialogSelectedVeiculo ? (
                    <>
                    <div className="space-y-1">
                        <Label htmlFor="buscaVeiculoDialog">Buscar Veículo (Placa, Modelo)</Label>
                        <Input id="buscaVeiculoDialog" placeholder="Digite para buscar..." value={searchTermVeiculo} onChange={(e) => setSearchTermVeiculo(e.target.value)} />
                    </div>
                    {searchResultsVeiculo.length > 0 && (
                        <div className="border rounded-md max-h-32 overflow-y-auto">
                        {searchResultsVeiculo.map((v) => ( <Button key={v.id} variant="ghost" className="w-full justify-start p-2 h-auto" onClick={() => handleSelecionarVeiculoDialog(v)}>{v.marca} {v.modelo} ({v.placa})</Button> ))}
                        </div>
                    )}
                     {searchTermVeiculo.length > 1 && searchResultsVeiculo.length === 0 && !showNovoVeiculoForm && (<p className="text-sm text-muted-foreground">Nenhum veículo encontrado. Cadastre abaixo.</p>)}
                    <Button variant="secondary" onClick={() => {setShowNovoVeiculoForm(true); setSearchTermVeiculo(""); setSearchResultsVeiculo([]); formVeiculoDialog.reset();}} disabled={showNovoVeiculoForm}><CarIcon className="mr-2 h-4 w-4" /> Cadastrar Novo Veículo</Button>
                    
                    {showNovoVeiculoForm && (
                        <Form {...formVeiculoDialog}>
                        <form onSubmit={formVeiculoDialog.handleSubmit(handleCadastrarVeiculoDialog)} className="space-y-3 pt-3 border-t">
                            <FormField control={formVeiculoDialog.control} name="placa" render={({ field }) => (<FormItem><FormLabel>Placa*</FormLabel><FormControl><Input placeholder="AAA-0000 ou AAA0A00" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={formVeiculoDialog.control} name="marca" render={({ field }) => (<FormItem><FormLabel>Marca*</FormLabel><FormControl><Input placeholder="Ex: Volkswagen" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={formVeiculoDialog.control} name="modelo" render={({ field }) => (<FormItem><FormLabel>Modelo*</FormLabel><FormControl><Input placeholder="Ex: Gol" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <FormField control={formVeiculoDialog.control} name="anoFabricacao" render={({ field }) => (<FormItem><FormLabel>Ano Fab.</FormLabel><FormControl><Input type="number" placeholder="Ex: 2020" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={formVeiculoDialog.control} name="anoModelo" render={({ field }) => (<FormItem><FormLabel>Ano Mod.</FormLabel><FormControl><Input type="number" placeholder="Ex: 2021" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={formVeiculoDialog.control} name="cor" render={({ field }) => (<FormItem><FormLabel>Cor</FormLabel><FormControl><Input placeholder="Ex: Prata" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                             <div className="grid md:grid-cols-2 gap-4">
                                 <FormField control={formVeiculoDialog.control} name="chassi" render={({ field }) => (<FormItem><FormLabel>Chassi (Opcional)</FormLabel><FormControl><Input placeholder="Número do Chassi (17 caracteres)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={formVeiculoDialog.control} name="renavam" render={({ field }) => (<FormItem><FormLabel>RENAVAM (Opcional)</FormLabel><FormControl><Input placeholder="Número do RENAVAM" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                             <FormField control={formVeiculoDialog.control} name="quilometragem" render={({ field }) => (<FormItem><FormLabel>Quilometragem Atual (Opcional)</FormLabel><FormControl><Input type="number" placeholder="Ex: 55000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formVeiculoDialog.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><ImageIcon className="h-4 w-4 text-muted-foreground"/> URL da Imagem (Opcional)</FormLabel><FormControl><Input type="url" placeholder="https://exemplo.com/foto-do-carro.jpg" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formVeiculoDialog.control} name="observacoes" render={({ field }) => (<FormItem><FormLabel>Observações (Opcional)</FormLabel><FormControl><Textarea placeholder="Detalhes adicionais sobre o veículo..." className="resize-y min-h-[80px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <DialogFooter className="pt-4">
                                <Button type="button" variant="ghost" onClick={() => setShowNovoVeiculoForm(false)}>Cancelar</Button>
                                <Button type="submit">Salvar Veículo</Button>
                            </DialogFooter>
                        </form>
                        </Form>
                    )}
                    </>
                ) : (
                    <div className="p-3 bg-primary/10 text-primary-foreground rounded-md border border-primary">
                        <p className="font-semibold text-primary">{dialogSelectedVeiculo.marca} {dialogSelectedVeiculo.modelo} ({dialogSelectedVeiculo.placa})</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-primary-foreground/80 hover:text-primary-foreground" onClick={() => {setDialogSelectedVeiculo(null); setSearchTermVeiculo("");}}>Trocar Veículo</Button>
                    </div>
                )}
                </CardContent>
            </Card>
            )}
            
             {dialogStep === "finalizar" && dialogSelectedCliente && dialogSelectedVeiculo && (
                <Card>
                    <CardHeader><CardTitle>Entrada Pronta para Orçamento</CardTitle></CardHeader>
                    <CardContent>
                        <p><strong>Cliente:</strong> {dialogSelectedCliente.nomeCompleto}</p>
                        <p><strong>Veículo:</strong> {dialogSelectedVeiculo.marca} {dialogSelectedVeiculo.modelo} ({dialogSelectedVeiculo.placa})</p>
                        <p className="mt-4 text-sm text-muted-foreground">Clique em "Concluir Entrada" para adicionar à lista de entradas aguardando orçamento.</p>
                    </CardContent>
                </Card>
             )}
          </div>

          <DialogFooter className="mt-auto pt-4 border-t">
            <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
            {dialogStep === "cliente" && dialogSelectedCliente && (<Button type="button" onClick={() => setDialogStep("veiculo")}>Próximo: Veículo <ArrowRight className="ml-1 h-4 w-4"/></Button>)}
            {dialogStep === "veiculo" && dialogSelectedVeiculo && (<Button type="button" onClick={() => setDialogStep("finalizar")}>Próximo: Confirmar <ArrowRight className="ml-1 h-4 w-4"/></Button>)}
            {dialogStep === "finalizar" && (<Button type="button" onClick={handleConcluirDialogNovaEntrada}>Concluir Entrada e Adicionar à Lista</Button>)}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    
