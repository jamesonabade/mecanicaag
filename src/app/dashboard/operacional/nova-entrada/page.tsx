
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Search, UserPlus, CarIcon, FilePlus, ArrowRight } from "lucide-react";

// --- Schemas e Tipos (Replicados/Adaptados de /clientes/novo e /veiculos/novo) ---

const estadosBrasil = [
  { value: "AC", label: "Acre" }, { value: "AL", label: "Alagoas" }, // ... (restante dos estados)
  { value: "AP", label: "Amapá" }, { value: "AM", label: "Amazonas" }, { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" }, { value: "DF", label: "Distrito Federal" }, { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" }, { value: "MA", label: "Maranhão" }, { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" }, { value: "MG", label: "Minas Gerais" }, { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" }, { value: "PR", label: "Paraná" }, { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" }, { value: "RJ", label: "Rio de Janeiro" }, { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" }, { value: "RO", label: "Rondônia" }, { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" }, { value: "SP", label: "São Paulo" }, { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const clienteFormSchemaDialog = z.object({
  nomeCompleto: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  cpfCnpj: z.string().min(11, { message: "CPF/CNPJ inválido." }).max(18, { message: "CPF/CNPJ inválido." }),
  telefone: z.string().min(10, { message: "Telefone inválido." }),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal('')),
  cep: z.string().length(8, { message: "CEP deve ter 8 dígitos." }).optional().or(z.literal('')),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  observacoes: z.string().optional(),
});
type ClienteFormValuesDialog = z.infer<typeof clienteFormSchemaDialog>;

const anoAtual = new Date().getFullYear();
const veiculoFormSchemaDialog = z.object({
  placa: z.string().min(7, { message: "Placa deve ter pelo menos 7 caracteres." }).max(8, {message: "Placa inválida."}),
  marca: z.string().min(2, { message: "Marca é obrigatória." }),
  modelo: z.string().min(2, { message: "Modelo é obrigatório." }),
  anoFabricacao: z.coerce.number().int().min(1900, { message: "Ano de fabricação inválido." }).max(anoAtual, { message: `Ano de fabricação não pode ser futuro (máx. ${anoAtual}).` }),
  anoModelo: z.coerce.number().int().min(1900, { message: "Ano do modelo inválido." }).max(anoAtual + 1, { message: `Ano do modelo não pode ser muito futuro (máx. ${anoAtual + 1}).` }),
  cor: z.string().min(2, { message: "Cor é obrigatória." }),
  chassi: z.string().length(17, { message: "Chassi deve ter 17 caracteres." }).optional().or(z.literal('')),
  renavam: z.string().min(9, { message: "RENAVAM inválido."}).max(11, { message: "RENAVAM inválido."}).optional().or(z.literal('')),
  quilometragem: z.coerce.number().int().min(0, { message: "Quilometragem não pode ser negativa." }).optional(),
  observacoes: z.string().optional(),
});
type VeiculoFormValuesDialog = z.infer<typeof veiculoFormSchemaDialog>;

// --- Mock Data (Gerenciado no estado desta página) ---
interface Cliente {
  id: string;
  nomeCompleto: string;
  cpfCnpj: string;
  telefone: string;
  email?: string;
}
interface Veiculo {
  id: string;
  clienteId: string;
  placa: string;
  marca: string;
  modelo: string;
  cor?: string;
  anoFabricacao?: number;
  anoModelo?: number;
}

const initialMockClientes: Cliente[] = [
  { id: "cli001", nomeCompleto: "João da Silva", cpfCnpj: "111.111.111-11", telefone: "(11)999990001", email: "joao@example.com" },
  { id: "cli002", nomeCompleto: "Maria Oliveira", cpfCnpj: "222.222.222-22", telefone: "(21)988880002", email: "maria@example.com" },
];
const initialMockVeiculos: Veiculo[] = [
  { id: "vec001", clienteId: "cli001", marca: "Honda", modelo: "Civic", placa: "ABC-1234", cor: "Prata", anoFabricacao: 2020 },
  { id: "vec002", clienteId: "cli001", marca: "Fiat", modelo: "Strada", placa: "DEF-5678", cor: "Branco", anoFabricacao: 2022 },
  { id: "vec003", clienteId: "cli002", marca: "Toyota", modelo: "Corolla", placa: "GHI-9012", cor: "Preto", anoFabricacao: 2021 },
];


export default function NovaEntradaVeiculoPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<"cliente" | "veiculo" | "orcamento">("cliente");
  
  const [clientes, setClientes] = useState<Cliente[]>(initialMockClientes);
  const [searchTermCliente, setSearchTermCliente] = useState("");
  const [searchResultsCliente, setSearchResultsCliente] = useState<Cliente[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showNovoClienteDialog, setShowNovoClienteDialog] = useState(false);

  const [veiculos, setVeiculos] = useState<Veiculo[]>(initialMockVeiculos);
  const [searchTermVeiculo, setSearchTermVeiculo] = useState("");
  const [searchResultsVeiculo, setSearchResultsVeiculo] = useState<Veiculo[]>([]);
  const [selectedVeiculo, setSelectedVeiculo] = useState<Veiculo | null>(null);
  const [showNovoVeiculoDialog, setShowNovoVeiculoDialog] = useState(false);

  const formCliente = useForm<ClienteFormValuesDialog>({
    resolver: zodResolver(clienteFormSchemaDialog),
    defaultValues: { nomeCompleto: "", cpfCnpj: "", telefone: "", email: "" },
  });

  const formVeiculo = useForm<VeiculoFormValuesDialog>({
    resolver: zodResolver(veiculoFormSchemaDialog),
    defaultValues: { placa: "", marca: "", modelo: "", cor: "" },
  });

  useEffect(() => {
    if (searchTermCliente.length > 2) {
      setSearchResultsCliente(
        clientes.filter(
          (c) =>
            c.nomeCompleto.toLowerCase().includes(searchTermCliente.toLowerCase()) ||
            c.cpfCnpj.includes(searchTermCliente)
        )
      );
    } else {
      setSearchResultsCliente([]);
    }
  }, [searchTermCliente, clientes]);

  useEffect(() => {
    if (selectedCliente && searchTermVeiculo.length >= 2) {
      setSearchResultsVeiculo(
        veiculos.filter(
          (v) =>
            v.clienteId === selectedCliente.id &&
            (v.placa.toLowerCase().includes(searchTermVeiculo.toLowerCase()) ||
              v.modelo.toLowerCase().includes(searchTermVeiculo.toLowerCase()))
        )
      );
    } else {
      setSearchResultsVeiculo([]);
    }
  }, [searchTermVeiculo, veiculos, selectedCliente]);

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setSearchTermCliente("");
    setSearchResultsCliente([]);
    setCurrentStep("veiculo");
    setSelectedVeiculo(null); // Reset veículo
  };

  const handleCadastrarCliente = (data: ClienteFormValuesDialog) => {
    const novoCliente: Cliente = {
      id: `cli${Date.now()}`,
      ...data,
    };
    setClientes((prev) => [...prev, novoCliente]);
    setSelectedCliente(novoCliente);
    setShowNovoClienteDialog(false);
    setCurrentStep("veiculo");
    toast({ title: "Cliente Cadastrado!", description: `${novoCliente.nomeCompleto} foi adicionado.` });
    formCliente.reset();
    setSelectedVeiculo(null);
  };

  const handleSelectVeiculo = (veiculo: Veiculo) => {
    setSelectedVeiculo(veiculo);
    setSearchTermVeiculo("");
    setSearchResultsVeiculo([]);
    setCurrentStep("orcamento");
  };

  const handleCadastrarVeiculo = (data: VeiculoFormValuesDialog) => {
    if (!selectedCliente) return;
    const novoVeiculo: Veiculo = {
      id: `vec${Date.now()}`,
      clienteId: selectedCliente.id,
      ...data,
    };
    setVeiculos((prev) => [...prev, novoVeiculo]);
    setSelectedVeiculo(novoVeiculo);
    setShowNovoVeiculoDialog(false);
    setCurrentStep("orcamento");
    toast({ title: "Veículo Cadastrado!", description: `${novoVeiculo.marca} ${novoVeiculo.modelo} (${novoVeiculo.placa}) foi adicionado.` });
    formVeiculo.reset();
  };

  const handleCriarOrcamento = () => {
    if (selectedCliente && selectedVeiculo) {
      router.push(`/dashboard/orcamentos/novo?clienteId=${selectedCliente.id}&veiculoId=${selectedVeiculo.id}`);
    } else {
      toast({ variant: "destructive", title: "Erro", description: "Cliente e Veículo devem ser selecionados." });
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Nova Entrada de Veículo</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard"><ChevronLeft /> Voltar ao Painel</Link>
        </Button>
      </div>

      {/* Etapa 1: Cliente */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="text-primary" /> Etapa 1: Identificar Cliente
          </CardTitle>
          <CardDescription>Busque por um cliente existente ou cadastre um novo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="buscaCliente">Buscar Cliente (Nome, CPF/CNPJ)</Label>
            <div className="flex gap-2">
              <Input
                id="buscaCliente"
                placeholder="Digite para buscar..."
                value={searchTermCliente}
                onChange={(e) => setSearchTermCliente(e.target.value)}
                disabled={!!selectedCliente}
              />
              {selectedCliente && (
                 <Button variant="outline" onClick={() => {setSelectedCliente(null); setCurrentStep("cliente"); setSelectedVeiculo(null);}}>Limpar</Button>
              )}
            </div>
          </div>

          {!selectedCliente && searchResultsCliente.length > 0 && (
            <div className="border rounded-md max-h-40 overflow-y-auto">
              {searchResultsCliente.map((cliente) => (
                <Button
                  key={cliente.id}
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => handleSelectCliente(cliente)}
                >
                  {cliente.nomeCompleto} ({cliente.cpfCnpj})
                </Button>
              ))}
            </div>
          )}
          
          {!selectedCliente && searchTermCliente.length > 2 && searchResultsCliente.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum cliente encontrado com "{searchTermCliente}".</p>
          )}

          {!selectedCliente && (
            <Dialog open={showNovoClienteDialog} onOpenChange={setShowNovoClienteDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary"><UserPlus className="mr-2 h-4 w-4" /> Cadastrar Novo Cliente</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                  <DialogDescription>Preencha os dados do novo cliente.</DialogDescription>
                </DialogHeader>
                <Form {...formCliente}>
                  <form onSubmit={formCliente.handleSubmit(handleCadastrarCliente)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                    <FormField control={formCliente.control} name="nomeCompleto" render={({ field }) => (<FormItem><FormLabel>Nome Completo*</FormLabel><FormControl><Input placeholder="João da Silva" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={formCliente.control} name="cpfCnpj" render={({ field }) => (<FormItem><FormLabel>CPF/CNPJ*</FormLabel><FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={formCliente.control} name="telefone" render={({ field }) => (<FormItem><FormLabel>Telefone*</FormLabel><FormControl><Input type="tel" placeholder="(00) 90000-0000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={formCliente.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="joao@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    {/* Endereço (opcional) */}
                    <h3 className="text-md font-medium pt-2 border-t">Endereço (Opcional)</h3>
                    <FormField control={formCliente.control} name="cep" render={({ field }) => (<FormItem><FormLabel>CEP</FormLabel><FormControl><Input placeholder="00000-000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={formCliente.control} name="logradouro" render={({ field }) => (<FormItem><FormLabel>Logradouro</FormLabel><FormControl><Input placeholder="Rua das Palmeiras" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={formCliente.control} name="numero" render={({ field }) => (<FormItem><FormLabel>Número</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={formCliente.control} name="complemento" render={({ field }) => (<FormItem><FormLabel>Complemento</FormLabel><FormControl><Input placeholder="Apto 101" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={formCliente.control} name="bairro" render={({ field }) => (<FormItem><FormLabel>Bairro</FormLabel><FormControl><Input placeholder="Centro" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={formCliente.control} name="cidade" render={({ field }) => (<FormItem><FormLabel>Cidade</FormLabel><FormControl><Input placeholder="São Paulo" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={formCliente.control} name="estado" render={({ field }) => (<FormItem><FormLabel>Estado</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger></FormControl><SelectContent>{estadosBrasil.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={formCliente.control} name="observacoes" render={({ field }) => (<FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea placeholder="Preferências, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <DialogFooter className="pt-4">
                        <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                        <Button type="submit">Salvar Cliente</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}

          {selectedCliente && (
            <div className="p-3 bg-primary/10 text-primary-foreground rounded-md border border-primary">
              <p className="font-semibold text-lg text-primary">{selectedCliente.nomeCompleto}</p>
              <p className="text-sm">CPF/CNPJ: {selectedCliente.cpfCnpj}</p>
              <p className="text-sm">Telefone: {selectedCliente.telefone}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Etapa 2: Veículo */}
      {selectedCliente && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CarIcon className="text-primary" /> Etapa 2: Identificar Veículo de {selectedCliente.nomeCompleto.split(" ")[0]}
            </CardTitle>
            <CardDescription>Busque por um veículo deste cliente ou cadastre um novo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="buscaVeiculo">Buscar Veículo (Placa, Modelo)</Label>
               <div className="flex gap-2">
                    <Input
                        id="buscaVeiculo"
                        placeholder="Digite para buscar..."
                        value={searchTermVeiculo}
                        onChange={(e) => setSearchTermVeiculo(e.target.value)}
                        disabled={!!selectedVeiculo}
                    />
                     {selectedVeiculo && (
                        <Button variant="outline" onClick={() => {setSelectedVeiculo(null); setCurrentStep("veiculo");}}>Limpar</Button>
                    )}
               </div>
            </div>

            {!selectedVeiculo && searchResultsVeiculo.length > 0 && (
              <div className="border rounded-md max-h-40 overflow-y-auto">
                {searchResultsVeiculo.map((veiculo) => (
                  <Button
                    key={veiculo.id}
                    variant="ghost"
                    className="w-full justify-start p-2 h-auto"
                    onClick={() => handleSelectVeiculo(veiculo)}
                  >
                    {veiculo.marca} {veiculo.modelo} ({veiculo.placa})
                  </Button>
                ))}
              </div>
            )}
            {!selectedVeiculo && searchTermVeiculo.length > 1 && searchResultsVeiculo.length === 0 && (
                 <p className="text-sm text-muted-foreground">Nenhum veículo encontrado para "{searchTermVeiculo}".</p>
            )}

            {!selectedVeiculo && (
                <Dialog open={showNovoVeiculoDialog} onOpenChange={setShowNovoVeiculoDialog}>
                <DialogTrigger asChild>
                    <Button variant="secondary"><CarIcon className="mr-2 h-4 w-4" /> Cadastrar Novo Veículo</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                    <DialogTitle>Cadastrar Novo Veículo para {selectedCliente.nomeCompleto}</DialogTitle>
                    <DialogDescription>Preencha os dados do novo veículo.</DialogDescription>
                    </DialogHeader>
                    <Form {...formVeiculo}>
                    <form onSubmit={formVeiculo.handleSubmit(handleCadastrarVeiculo)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                        <FormField control={formVeiculo.control} name="placa" render={({ field }) => (<FormItem><FormLabel>Placa*</FormLabel><FormControl><Input placeholder="AAA-0000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={formVeiculo.control} name="marca" render={({ field }) => (<FormItem><FormLabel>Marca*</FormLabel><FormControl><Input placeholder="Ex: Honda" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formVeiculo.control} name="modelo" render={({ field }) => (<FormItem><FormLabel>Modelo*</FormLabel><FormControl><Input placeholder="Ex: Civic" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                         <div className="grid grid-cols-3 gap-4">
                            <FormField control={formVeiculo.control} name="anoFabricacao" render={({ field }) => (<FormItem><FormLabel>Ano Fab.*</FormLabel><FormControl><Input type="number" placeholder="2020" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formVeiculo.control} name="anoModelo" render={({ field }) => (<FormItem><FormLabel>Ano Mod.*</FormLabel><FormControl><Input type="number" placeholder="2021" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={formVeiculo.control} name="cor" render={({ field }) => (<FormItem><FormLabel>Cor*</FormLabel><FormControl><Input placeholder="Prata" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        <FormField control={formVeiculo.control} name="chassi" render={({ field }) => (<FormItem><FormLabel>Chassi (Opcional)</FormLabel><FormControl><Input placeholder="17 caracteres" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={formVeiculo.control} name="renavam" render={({ field }) => (<FormItem><FormLabel>RENAVAM (Opcional)</FormLabel><FormControl><Input placeholder="9 a 11 dígitos" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={formVeiculo.control} name="quilometragem" render={({ field }) => (<FormItem><FormLabel>Quilometragem (Opcional)</FormLabel><FormControl><Input type="number" placeholder="55000" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={formVeiculo.control} name="observacoes" render={({ field }) => (<FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea placeholder="Detalhes do veículo..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <DialogFooter className="pt-4">
                            <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                            <Button type="submit">Salvar Veículo</Button>
                        </DialogFooter>
                    </form>
                    </Form>
                </DialogContent>
                </Dialog>
            )}

            {selectedVeiculo && (
              <div className="p-3 bg-primary/10 text-primary-foreground rounded-md border border-primary">
                <p className="font-semibold text-lg text-primary">{selectedVeiculo.marca} {selectedVeiculo.modelo}</p>
                <p className="text-sm">Placa: {selectedVeiculo.placa}</p>
                <p className="text-sm">Cor: {selectedVeiculo.cor || "N/A"} | Ano: {selectedVeiculo.anoFabricacao || "N/A"}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Etapa 3: Orçamento */}
      {selectedCliente && selectedVeiculo && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <FilePlus className="text-primary" /> Etapa 3: Orçamento
            </CardTitle>
            <CardDescription>
                Cliente e veículo identificados. Prossiga para a criação do orçamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Cliente:</strong> {selectedCliente.nomeCompleto}</p>
            <p><strong>Veículo:</strong> {selectedVeiculo.marca} {selectedVeiculo.modelo} ({selectedVeiculo.placa})</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCriarOrcamento} className="w-full sm:w-auto">
              Criar Orçamento para este Veículo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Futura listagem de entradas recentes aqui */}

    </div>
  );
}
