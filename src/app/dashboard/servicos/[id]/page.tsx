
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChevronLeft,
  Wrench,
  User,
  Car,
  CalendarIcon,
  Clock,
  DollarSign,
  Edit,
  Printer,
  Paperclip,
  Camera,
  PlusCircle,
  Trash2,
  FileText,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { mockOrdensServico, OSStatus } from "../page"; // Importando mock e tipo da página de listagem

// Mock data - Em uma aplicação real, isso viria de uma API
const mockClientes = [
  { id: "cli001", nome: "João da Silva", telefone: "(11) 98765-4321", email: "joao.silva@example.com" },
  { id: "cli002", nome: "Maria Oliveira", telefone: "(21) 91234-5678", email: "maria.oliveira@example.com" },
  { id: "cli003", nome: "Carlos Pereira", telefone: "(31) 95555-5555", email: "carlos.p@example.com" },
  { id: "cli004", nome: "Ana Costa", telefone: "(41) 94444-4444", email: "ana.c@example.com" },
];

const mockVeiculos = [
  { id: "vec001", clienteId: "cli001", marca: "Honda", modelo: "Civic", placa: "ABC-1234", ano: "2020", cor: "Prata", km: "40500" },
  { id: "vec002", clienteId: "cli001", marca: "Fiat", modelo: "Strada", placa: "DEF-5678", ano: "2022", cor: "Branco", km: "15200" },
  { id: "vec003", clienteId: "cli002", marca: "Toyota", modelo: "Corolla", placa: "GHI-9012", ano: "2021", cor: "Preto", km: "33000" },
  { id: "vec004", clienteId: "cli003", marca: "VW", modelo: "Nivus", placa: "JKL-3456", ano: "2023", cor: "Cinza", km: "8900" },
  { id: "vec005", clienteId: "cli004", marca: "Hyundai", modelo: "HB20", placa: "MNO-7890", ano: "2019", cor: "Vermelho", km: "55100" },
];

const mockMecanicos = [
  { id: "mec001", nome: "Carlos Alberto" },
  { id: "mec002", nome: "Pedro Henrique" },
  { id: "mec003", nome: "Ana Beatriz" },
];

const statusOptions: { value: OSStatus; label: string }[] = [
    { value: "Aguardando Diagnóstico", label: "Aguardando Diagnóstico" },
    { value: "Aguardando Orçamento", label: "Aguardando Orçamento" },
    { value: "Aguardando Aprovação", label: "Aguardando Aprovação" },
    { value: "Aguardando Peças", label: "Aguardando Peças" },
    { value: "Em Andamento", label: "Em Andamento" },
    { value: "Concluída", label: "Concluída" },
    { value: "Cancelada", label: "Cancelada" },
];


export default function OrdemServicoDetalhesPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  // Encontra a OS pelos mocks. Em uma app real, faria fetch da API.
  const osData = React.useMemo(() => {
    const data = mockOrdensServico.find(o => o.id === id);
    if (!data) return null;
    const cliente = mockClientes.find(c => c.id === data.clienteId);
    const veiculo = mockVeiculos.find(v => v.id === data.veiculoId);
    const mecanico = data.mecanicoId ? mockMecanicos.find(m => m.id === data.mecanicoId) : null;
    return { ...data, cliente, veiculo, mecanico };
  }, [id]);

  const [currentStatus, setCurrentStatus] = React.useState<OSStatus | undefined>(osData?.status as OSStatus);
  const [diagnostico, setDiagnostico] = React.useState(osData?.diagnosticoTecnico || "");
  const [itensServico, setItensServico] = React.useState(osData?.itensExecutados || []);

  React.useEffect(() => {
    if (osData) {
      setCurrentStatus(osData.status as OSStatus);
      setDiagnostico(osData.diagnosticoTecnico || "");
      setItensServico(osData.itensExecutados || []);
    }
  }, [osData]);


  if (!osData) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Ordem de Serviço não encontrada.</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard/servicos">Voltar para Lista de OS</Link>
        </Button>
      </div>
    );
  }

  const { cliente, veiculo, mecanico } = osData;

  const handleStatusChange = (newStatus: OSStatus) => {
    setCurrentStatus(newStatus);
    toast({ title: "Status da OS Atualizado", description: `Status alterado para: ${newStatus} (Simulado)` });
  };

  const handleSaveDiagnostico = () => {
    toast({ title: "Diagnóstico Salvo", description: "Diagnóstico técnico salvo com sucesso (Simulado)"});
  };
  
  const handleAddItem = (tipo: 'servico' | 'peca') => {
    const newItem = {
        id: `new_${tipo}_${Date.now()}`,
        descricao: tipo === 'servico' ? "Novo Serviço" : "Nova Peça",
        valor: 0,
        quantidade: tipo === 'peca' ? 1 : undefined,
        tipo: tipo
    };
    // @ts-ignore
    setItensServico(prev => [...prev, newItem]);
    toast({title: `${tipo === 'servico' ? 'Serviço' : 'Peça'} Adicionado(a)`, description: "Item adicionado para edição."});
  }

  const handleRemoveItem = (itemId: string) => {
    setItensServico(prev => prev.filter(item => item.id !== itemId));
    toast({title: "Item Removido", description: "Item removido da OS."});
  }

  const handleItemChange = (itemId: string, field: string, value: string | number) => {
    setItensServico(prev => prev.map(item => {
        if (item.id === itemId) {
            return {...item, [field]: field === 'valor' || field === 'quantidade' ? Number(value) : value};
        }
        return item;
    }));
  }
  
  const totalOs = React.useMemo(() => {
    return itensServico.reduce((acc, item) => acc + (item.valor || 0) * (item.tipo === 'peca' ? (item.quantidade || 1) : 1) , 0);
  }, [itensServico]);


  const getStatusBadgeVariant = (status: OSStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Concluída": return "default";
      case "Em Andamento": return "outline";
      case "Aguardando Aprovação": case "Aguardando Diagnóstico": case "Aguardando Orçamento": case "Aguardando Peças": return "secondary";
      case "Cancelada": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Wrench /> Detalhes da OS: #{osData.id}
          </h1>
          <p className="text-muted-foreground">Gerencie e acompanhe esta Ordem de Serviço.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => toast({title: "Impressão da OS em desenvolvimento"})}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir OS
          </Button>
          <Button variant="default" asChild>
            <Link href="/dashboard/servicos">
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista
            </Link>
          </Button>
        </div>
      </div>

      {/* Status e Ações Rápidas */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Status Atual e Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="statusOs">Alterar Status da OS</Label>
            <Select value={currentStatus} onValueChange={(value) => handleStatusChange(value as OSStatus)}>
              <SelectTrigger id="statusOs">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Badge variant={getStatusBadgeVariant(currentStatus!)} className="text-lg px-4 py-2 mt-2 sm:mt-5 whitespace-nowrap">
            {currentStatus}
          </Badge>
          {currentStatus === "Aguardando Orçamento" && (
             <Button onClick={() => toast({title: "Gerar Orçamento (Simulado)"})} className="mt-2 sm:mt-5 w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4"/> Gerar Orçamento
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Informações Gerais */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
          <div>
            <p className="font-semibold flex items-center gap-1 mb-0.5"><User className="h-4 w-4 text-primary"/> Cliente:</p>
            <p className="ml-1">{cliente?.nome || "N/A"}</p>
            <p className="ml-1 text-xs text-muted-foreground">Tel: {cliente?.telefone || "N/A"} | Email: {cliente?.email || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold flex items-center gap-1 mb-0.5"><Car className="h-4 w-4 text-primary"/> Veículo:</p>
            <p className="ml-1">{veiculo?.marca} {veiculo?.modelo} ({veiculo?.placa})</p>
            <p className="ml-1 text-xs text-muted-foreground">Ano: {veiculo?.ano} | Cor: {veiculo?.cor} | KM: {veiculo?.km}</p>
          </div>
           <div>
            <p className="font-semibold flex items-center gap-1 mb-0.5"><User className="h-4 w-4 text-primary"/> Mecânico Responsável:</p>
            <p className="ml-1">{mecanico?.nome || "Não atribuído"}</p>
          </div>
          <div>
            <p className="font-semibold flex items-center gap-1 mb-0.5"><CalendarIcon className="h-4 w-4 text-primary"/> Data de Entrada:</p>
            <p className="ml-1">{format(parseISO(osData.dataEntrada), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
          </div>
          <div>
            <p className="font-semibold flex items-center gap-1 mb-0.5"><Clock className="h-4 w-4 text-primary"/> Previsão de Entrega:</p>
            <p className="ml-1">{osData.dataPrevisaoEntrega ? format(parseISO(osData.dataPrevisaoEntrega), "dd/MM/yyyy HH:mm", { locale: ptBR }) : "Não definida"}</p>
          </div>
          <div>
            <p className="font-semibold flex items-center gap-1 mb-0.5"><Wrench className="h-4 w-4 text-primary"/> Tipo de Serviço Principal:</p>
            <p className="ml-1">{osData.tipoServico}</p>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <p className="font-semibold flex items-center gap-1 mb-0.5"><MessageSquare className="h-4 w-4 text-primary"/> Solicitação do Cliente / Problema Reportado:</p>
            <p className="ml-1 text-muted-foreground bg-muted/30 p-2 rounded-md whitespace-pre-wrap">{osData.descricaoProblema}</p>
          </div>
          {osData.servicosPecasPlanejadas && (
            <div className="md:col-span-2 lg:col-span-3">
                <p className="font-semibold flex items-center gap-1 mb-0.5"><FileText className="h-4 w-4 text-primary"/> Serviços/Peças Planejados (Orçamento Inicial):</p>
                <p className="ml-1 text-muted-foreground bg-muted/30 p-2 rounded-md whitespace-pre-wrap">{osData.servicosPecasPlanejadas}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Serviços e Peças */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Serviços Realizados e Peças Utilizadas</CardTitle>
          <CardDescription>Liste todos os itens executados e seus valores.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {itensServico.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_120px_auto] gap-2 items-center p-2 border rounded-md bg-muted/20">
                <Input 
                    value={item.descricao} 
                    onChange={(e) => handleItemChange(item.id, 'descricao', e.target.value)}
                    placeholder={item.tipo === 'servico' ? "Descrição do Serviço" : "Nome da Peça"}
                    className="bg-background"
                />
                {item.tipo === 'peca' && (
                     <Input 
                        type="number" 
                        value={item.quantidade || 1} 
                        onChange={(e) => handleItemChange(item.id, 'quantidade', e.target.value)}
                        className="text-center bg-background"
                        min="1"
                    />
                )}
                {item.tipo === 'servico' && <div className="hidden sm:block"></div>} {/* Placeholder for quantity on service */}
                <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
                    <Input 
                        type="number" 
                        value={item.valor} 
                        onChange={(e) => handleItemChange(item.id, 'valor', e.target.value)}
                        placeholder="Valor"
                        className="pl-7 bg-background"
                        min="0"
                    />
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-destructive hover:text-destructive h-8 w-8 justify-self-end sm:justify-self-center">
                    <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
           <div className="flex gap-2 mb-4">
             <Button variant="outline" size="sm" onClick={() => handleAddItem('servico')}><PlusCircle className="mr-2 h-4 w-4"/>Adicionar Serviço</Button>
             <Button variant="outline" size="sm" onClick={() => handleAddItem('peca')}><PlusCircle className="mr-2 h-4 w-4"/>Adicionar Peça</Button>
           </div>
           <Separator />
           <div className="text-right mt-4">
                <p className="text-muted-foreground">Subtotal Mão de Obra: <span className="font-semibold text-foreground">R$ {itensServico.filter(i=>i.tipo === 'servico').reduce((acc,item) => acc + (item.valor || 0),0).toFixed(2)}</span></p>
                <p className="text-muted-foreground">Subtotal Peças: <span className="font-semibold text-foreground">R$ {itensServico.filter(i=>i.tipo === 'peca').reduce((acc,item) => acc + (item.valor || 0) * (item.quantidade || 1) ,0).toFixed(2)}</span></p>
                <p className="text-xl font-bold">Total da OS: <span className="text-primary">R$ {totalOs.toFixed(2)}</span></p>
           </div>
        </CardContent>
      </Card>

      {/* Diagnóstico Técnico */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Diagnóstico Técnico e Observações Internas</CardTitle>
        </CardHeader>
        <CardContent>
            <Label htmlFor="diagnosticoOs">Relatório do Mecânico / Diagnóstico</Label>
            <Textarea 
                id="diagnosticoOs"
                placeholder="Descreva o diagnóstico, os procedimentos realizados, recomendações futuras, etc." 
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                rows={5} 
                className="mb-2"
            />
            <Button onClick={handleSaveDiagnostico} size="sm">Salvar Diagnóstico</Button>

            {osData.observacoesInternas && (
                <>
                <Separator className="my-4"/>
                <Label>Observações Internas da Entrada</Label>
                <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/20 whitespace-pre-wrap">{osData.observacoesInternas}</p>
                </>
            )}
        </CardContent>
      </Card>

      {/* Fotos e Anexos */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Fotos e Anexos</CardTitle>
          <CardDescription>Registre imagens do serviço ou anexe documentos relevantes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {osData.fotos.map((foto, index) => (
              <div key={index} className="group relative">
                <Image src={foto.url} alt={foto.legenda} width={200} height={150} className="rounded-md object-cover aspect-video" data-ai-hint={foto.dataAiHint} />
                <p className="text-xs text-center mt-1 text-muted-foreground">{foto.legenda}</p>
              </div>
            ))}
             <Button variant="outline" className="aspect-video h-auto flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary border-dashed" onClick={() => toast({title: "Upload de fotos em desenvolvimento"})}>
                <Camera className="h-8 w-8" />
                <span className="text-xs">Adicionar Foto</span>
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast({title: "Anexar arquivos em desenvolvimento"})}>
            <Paperclip className="mr-2 h-4 w-4" /> Anexar Documento
          </Button>
        </CardContent>
      </Card>
      
      <CardFooter className="border-t pt-6 flex justify-end">
         <Button onClick={() => toast({title: "Finalizar OS (Simulado)", description: "A OS seria marcada como finalizada e o cliente notificado."})} disabled={currentStatus !== "Concluída" && currentStatus !== "Cancelada"}>
            Finalizar e Faturar OS
        </Button>
      </CardFooter>
    </div>
  );
}

