
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, CarIcon, ArrowRight, Edit, FilePlus, ClipboardList, ImageIcon } from "lucide-react";
import { Cliente, addCliente as addClienteDB, getClientes as getClientesDB, getClienteById as getClienteDBById } from "@/lib/mockData/clientes";
import { Veiculo, addVeiculo as addVeiculoDB, getVeiculosByClienteId as getVeiculosDBByClienteId, getVeiculoById as getVeiculoDBById } from "@/lib/mockData/veiculos";

// --- Interfaces ---
export type StatusProgressoEntrada = "Aguardando Cliente" | "Aguardando Veículo" | "Aguardando Orçamento" | "Orçamento Iniciado";

export interface EntradaEmProgresso {
  id: string;
  cliente?: Cliente;
  veiculo?: Veiculo;
  statusProgressoEntrada: StatusProgressoEntrada;
  dataCriacao: string;
  entradaId?: string;
}

// --- Schemas Zod ---
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
  anoFabricacao: z.coerce.number().int().min(1900).max(anoAtual).optional(),
  anoModelo: z.coerce.number().int().min(1900).max(anoAtual + 1).optional(),
  cor: z.string().min(2).optional(),
  chassi: z.string().length(17, { message: "Chassi deve ter 17 caracteres." }).optional().or(z.literal('')),
  renavam: z.string().min(9).max(11).optional().or(z.literal('')),
  quilometragem: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().url({ message: "URL da imagem inválido." }).optional().or(z.literal('')),
  observacoes: z.string().optional(),
});
type VeiculoFormValuesDialog = z.infer<typeof veiculoFormSchemaDialog>;

interface NovaEntradaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEntradaFinalizada: (entrada: EntradaEmProgresso | null, action?: 'goToOrcamento' | 'addToList') => void;
  entradaInicial?: Partial<EntradaEmProgresso>; // Para continuar uma entrada
}

export default function NovaEntradaDialog({ isOpen, onOpenChange, onEntradaFinalizada, entradaInicial }: NovaEntradaDialogProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [dialogStep, setDialogStep] = useState<"cliente" | "veiculo" | "confirmarEntradaEOrcamento">("cliente");
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
    if (isOpen) {
      setClientesDataSource(getClientesDB()); // Recarregar clientes ao abrir o dialog
      if (entradaInicial) {
        setDialogEntradaId(entradaInicial.id || `ENT-${Date.now()}`);
        setDialogSelectedCliente(entradaInicial.cliente || null);
        setDialogSelectedVeiculo(entradaInicial.veiculo || null);
        setDialogStep(entradaInicial.cliente ? (entradaInicial.veiculo ? "confirmarEntradaEOrcamento" : "veiculo") : "cliente");
        formClienteDialog.reset(entradaInicial.cliente ? { nomeCompleto: entradaInicial.cliente.nomeCompleto, cpfCnpj: entradaInicial.cliente.cpfCnpj, telefone: entradaInicial.cliente.telefone, email: entradaInicial.cliente.email || "", cep: entradaInicial.cliente.cep || "", logradouro: entradaInicial.cliente.logradouro || "", numero: entradaInicial.cliente.numero || "", complemento: entradaInicial.cliente.complemento || "", bairro: entradaInicial.cliente.bairro || "", cidade: entradaInicial.cliente.cidade || "", estado: entradaInicial.cliente.estado || "", observacoes: entradaInicial.cliente.observacoes || ""} : {});
        formVeiculoDialog.reset(entradaInicial.veiculo || {});

      } else {
        setDialogEntradaId(`ENT-${Date.now()}`);
        setDialogSelectedCliente(null);
        setDialogSelectedVeiculo(null);
        setDialogStep("cliente");
        formClienteDialog.reset();
        formVeiculoDialog.reset();
      }
      setSearchTermCliente("");
      setSearchTermVeiculo("");
      setShowNovoClienteForm(false);
      setShowNovoVeiculoForm(false);
    }
  }, [isOpen, entradaInicial, formClienteDialog, formVeiculoDialog]);


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
    setDialogStep("confirmarEntradaEOrcamento");
  };

  const handleCadastrarVeiculoDialog = (data: VeiculoFormValuesDialog) => {
    if (!dialogSelectedCliente) return;
    const novoVeiculo = addVeiculoDB({ ...data, clienteId: dialogSelectedCliente.id });
    setVeiculosDataSource(getVeiculosDBByClienteId(dialogSelectedCliente.id));
    setDialogSelectedVeiculo(novoVeiculo);
    setShowNovoVeiculoForm(false);
    setDialogStep("confirmarEntradaEOrcamento");
    toast({ title: "Veículo Cadastrado!", description: `${novoVeiculo.marca} ${novoVeiculo.modelo} (${novoVeiculo.placa}) foi adicionado.` });
    formVeiculoDialog.reset();
  };

  const criarEntradaData = (status: StatusProgressoEntrada): EntradaEmProgresso | null => {
     if (!dialogEntradaId || !dialogSelectedCliente || !dialogSelectedVeiculo) {
      toast({ variant: "destructive", title: "Erro", description: "Cliente e Veículo devem ser definidos." });
      return null;
    }
    return {
      id: dialogEntradaId,
      cliente: dialogSelectedCliente,
      veiculo: dialogSelectedVeiculo,
      statusProgressoEntrada: status,
      dataCriacao: entradaInicial?.dataCriacao || new Date().toISOString(),
      entradaId: dialogEntradaId,
    };
  }

  const handleProsseguirParaOrcamentoDialog = () => {
    const entrada = criarEntradaData("Orçamento Iniciado");
    if (entrada) {
      onOpenChange(false);
      onEntradaFinalizada(entrada, 'goToOrcamento');
      router.push(`/dashboard/orcamentos/novo?clienteId=${entrada.cliente!.id}&veiculoId=${entrada.veiculo!.id}&entradaId=${entrada.id}`);
    }
  };

  const handleAdicionarAListaSemOrcamentoDialog = () => {
    const entrada = criarEntradaData("Aguardando Orçamento");
     if (entrada) {
      onOpenChange(false);
      onEntradaFinalizada(entrada, 'addToList');
    }
  };
  
  const handleCloseDialog = () => {
    onEntradaFinalizada(null); // Sinaliza que foi cancelado ou fechado sem finalizar
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Nova Entrada de Veículo (ID: {dialogEntradaId || "..."}) - Etapa: {
            dialogStep === "cliente" ? "1. Cliente" : dialogStep === "veiculo" ? "2. Veículo" : "3. Criar Orçamento?"
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
                        {searchResultsCliente.map((c) => (<Button key={c.id} variant="ghost" className="w-full justify-start p-2 h-auto" onClick={() => handleSelecionarClienteDialog(c)}>{c.nomeCompleto} ({c.cpfCnpj})</Button>))}
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
                            <Button type="button" variant="outline" onClick={() => setShowNovoClienteForm(false)}>Cancelar Cadastro</Button>
                            <Button type="submit">Salvar Cliente</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-primary/10 text-primary-foreground rounded-md border border-primary">
                    <p className="font-semibold text-primary">{dialogSelectedCliente.nomeCompleto}</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary-foreground/80 hover:text-primary-foreground" onClick={() => { setDialogSelectedCliente(null); setSearchTermCliente(""); }}>Trocar Cliente</Button>
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
                        {searchResultsVeiculo.map((v) => (<Button key={v.id} variant="ghost" className="w-full justify-start p-2 h-auto" onClick={() => handleSelecionarVeiculoDialog(v)}>{v.marca} {v.modelo} ({v.placa})</Button>))}
                      </div>
                    )}
                    {searchTermVeiculo.length > 1 && searchResultsVeiculo.length === 0 && !showNovoVeiculoForm && (<p className="text-sm text-muted-foreground">Nenhum veículo encontrado. Cadastre abaixo.</p>)}
                    <Button variant="secondary" onClick={() => { setShowNovoVeiculoForm(true); setSearchTermVeiculo(""); setSearchResultsVeiculo([]); formVeiculoDialog.reset(); }} disabled={showNovoVeiculoForm}><CarIcon className="mr-2 h-4 w-4" /> Cadastrar Novo Veículo</Button>

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
                            <Button type="button" variant="ghost" onClick={() => setShowNovoVeiculoForm(false)}>Cancelar Cadastro</Button>
                            <Button type="submit">Salvar Veículo</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    )}
                  </>
                ) : (
                  <div className="p-3 bg-primary/10 text-primary-foreground rounded-md border border-primary">
                    <p className="font-semibold text-primary">{dialogSelectedVeiculo.marca} {dialogSelectedVeiculo.modelo} ({dialogSelectedVeiculo.placa})</p>
                    <Button variant="link" size="sm" className="p-0 h-auto text-primary-foreground/80 hover:text-primary-foreground" onClick={() => { setDialogSelectedVeiculo(null); setSearchTermVeiculo(""); }}>Trocar Veículo</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {dialogStep === "confirmarEntradaEOrcamento" && dialogSelectedCliente && dialogSelectedVeiculo && (
            <Card>
              <CardHeader>
                <CardTitle>Confirmar Entrada e Próximo Passo</CardTitle>
                <CardContent className="p-0 pt-4 space-y-4">
                  <div className="p-3 border rounded-md bg-muted/30">
                    <p><strong>Cliente:</strong> {dialogSelectedCliente.nomeCompleto}</p>
                    <p><strong>Veículo:</strong> {dialogSelectedVeiculo.marca} {dialogSelectedVeiculo.modelo} ({dialogSelectedVeiculo.placa})</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button type="button" onClick={handleProsseguirParaOrcamentoDialog} className="flex-1">
                      <FilePlus className="mr-2 h-4 w-4" /> Sim, criar orçamento agora
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleAdicionarAListaSemOrcamentoDialog} className="flex-1">
                      <ClipboardList className="mr-2 h-4 w-4" /> Não, adicionar à lista para depois
                    </Button>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          )}
        </div>

        <DialogFooter className="mt-auto pt-4 border-t">
          {dialogStep === "cliente" && (
            <>
              <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
              <Button type="button" onClick={() => setDialogStep("veiculo")} disabled={!dialogSelectedCliente}>Próximo: Veículo <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </>
          )}
          {dialogStep === "veiculo" && (
            <>
              <Button type="button" variant="outline" onClick={() => setDialogStep("cliente")}>Voltar (Cliente)</Button>
              <Button type="button" onClick={() => setDialogStep("confirmarEntradaEOrcamento")} disabled={!dialogSelectedVeiculo}>Próximo: Confirmar <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </>
          )}
          {dialogStep === "confirmarEntradaEOrcamento" && (
            <>
              <Button type="button" variant="outline" onClick={() => setDialogStep("veiculo")}>Voltar (Veículo)</Button>
              <DialogClose asChild><Button type="button" variant="outline">Fechar</Button></DialogClose>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
