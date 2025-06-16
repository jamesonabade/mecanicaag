
"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  MessageSquare,
  ListChecks,
  ClipboardCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { mockOrdensServico, OSStatus, ItemOS, FilledChecklistInfo } from "../page"; 
import { getClienteById, Cliente } from "@/lib/mockData/clientes";
import { getVeiculoById, Veiculo } from "@/lib/mockData/veiculos";
import { getFuncionarioById, Funcionario } from "@/lib/mockData/funcionarios";


const statusOptions: { value: OSStatus; label: string }[] = [
    { value: "Aguardando Diagnóstico", label: "Aguardando Diagnóstico" },
    { value: "Aguardando Orçamento", label: "Aguardando Orçamento" },
    { value: "Aguardando Aprovação", label: "Aguardando Aprovação" },
    { value: "Aguardando Peças", label: "Aguardando Peças" },
    { value: "Em Andamento", label: "Em Andamento" },
    { value: "Concluída", label: "Concluída" },
    { value: "Cancelada", label: "Cancelada" },
];

// Estrutura para itens de checklist e modelos de checklist
interface ChecklistItemModel {
  id: string;
  texto: string;
  tipoResposta: "texto_curto" | "texto_longo" | "sim_nao" | "multipla_escolha" | "unica_escolha" | "upload_foto";
  opcoesResposta?: string; // "Op1,Op2,Op3"
  obrigatorio: boolean;
}

interface ChecklistModel {
  id: string;
  nome: string;
  descricao?: string;
  aplicavelPara?: string;
  itens: ChecklistItemModel[];
}

const mockChecklistModelsData: ChecklistModel[] = [
  {
    id: "chk_model_001",
    nome: "Checklist de Inspeção Veicular Pré-Serviço",
    descricao: "Padrão para entrada de veículos na oficina.",
    itens: [
      { id: "chk001_item01", texto: "Condição da pintura (arranhões, amassados)", tipoResposta: "texto_longo", obrigatorio: true },
      { id: "chk001_item02", texto: "Nível do óleo do motor", tipoResposta: "unica_escolha", opcoesResposta: "Abaixo,Normal,Acima", obrigatorio: true },
      { id: "chk001_item03", texto: "Nível do fluido de freio OK?", tipoResposta: "sim_nao", obrigatorio: true },
      { id: "chk001_item04", texto: "Calibragem dos pneus (PSI)", tipoResposta: "texto_curto", obrigatorio: false },
      { id: "chk001_item05", texto: "Itens deixados no veículo", tipoResposta: "multipla_escolha", opcoesResposta: "Documentos,Estepe,Macaco,Chave de Roda,Pertences Pessoais", obrigatorio: false },
      { id: "chk001_item06", texto: "Foto da frente do veículo (URL)", tipoResposta: "upload_foto", obrigatorio: true },
    ],
  },
  {
    id: "chk_model_002",
    nome: "Checklist de Entrega de Veículo",
    itens: [
      { id: "chk002_item01", texto: "Limpeza interna e externa realizada?", tipoResposta: "sim_nao", obrigatorio: true },
      { id: "chk002_item02", texto: "Serviços conferidos com o cliente?", tipoResposta: "sim_nao", obrigatorio: true },
      { id: "chk002_item03", texto: "Observações finais do cliente", tipoResposta: "texto_longo", obrigatorio: false },
    ],
  },
  {
    id: "chk_model_003",
    nome: "Checklist de Troca de Óleo",
    itens: [
      { id: "chk003_item01", texto: "Tipo de óleo utilizado", tipoResposta: "texto_curto", obrigatorio: true },
      { id: "chk003_item02", texto: "Quantidade de óleo (litros)", tipoResposta: "texto_curto", obrigatorio: true },
      { id: "chk003_item03", texto: "Filtro de óleo substituído?", tipoResposta: "sim_nao", obrigatorio: true },
      { id: "chk003_item04", texto: "Etiqueta de próxima troca preenchida?", tipoResposta: "sim_nao", obrigatorio: true },
    ],
  },
];

const tiposRespostaLabels = {
    "texto_curto": "Texto Curto",
    "texto_longo": "Texto Longo",
    "sim_nao": "Sim/Não/N/A",
    "multipla_escolha": "Múltipla Escolha",
    "unica_escolha": "Única Escolha",
    "upload_foto": "Upload de Foto (URL)"
};

interface FilledChecklistItemAnswer {
  itemId: string;
  resposta: any; // string | boolean | string[] | null
  texto?: string; // Adicionado para facilitar a visualização
}

interface FilledChecklist extends FilledChecklistInfo { // Reutiliza e estende a Info
  respostas: FilledChecklistItemAnswer[];
}


export default function OrdemServicoDetalhesPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const osDataFound = React.useMemo(() => {
    const data = mockOrdensServico.find(o => o.id === id);
    if (!data) return null;
    const cliente = getClienteById(data.clienteId);
    const veiculo = getVeiculoById(data.veiculoId);
    const mecanico = data.mecanicoId ? getFuncionarioById(data.mecanicoId) : null;
    return { ...data, cliente, veiculo, mecanico, checklistsPreenchidos: data.checklistsPreenchidos || [] };
  }, [id]);

  const [osData, setOsData] = useState(osDataFound);
  const [currentStatus, setCurrentStatus] = React.useState<OSStatus | undefined>(osDataFound?.status as OSStatus);
  const [diagnostico, setDiagnostico] = React.useState(osDataFound?.diagnosticoTecnico || "");
  const [itensServico, setItensServico] = React.useState<ItemOS[]>(osDataFound?.itensExecutados || []);

  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [selectedChecklistModelId, setSelectedChecklistModelId] = useState<string>("");
  const [currentChecklistItemsToFill, setCurrentChecklistItemsToFill] = useState<ChecklistItemModel[]>([]);
  const [checklistResponses, setChecklistResponses] = useState<Record<string, any>>({});
  const [checklistResponsavel, setChecklistResponsavel] = useState("");
  const [filledChecklistsForOS, setFilledChecklistsForOS] = useState<FilledChecklist[]>(
    // Se mockOrdensServico tiver a estrutura completa, podemos usar diretamente
    // Por agora, vamos assumir que `checklistsPreenchidos` em `mockOrdensServico` é apenas `FilledChecklistInfo[]`
    // e precisaremos simular o preenchimento ou buscar de outro local no futuro.
    // Para esta demo, vamos simular que a OS pode já ter checklists com respostas.
    osDataFound?.checklistsPreenchidos.map(info => ({
        ...info,
        respostas: mockChecklistModelsData.find(m => m.id === info.modelId)?.itens.map(item => ({
            itemId: item.id,
            texto: item.texto,
            // Resposta mockada aqui para visualização, em um caso real viria do DB
            resposta: item.tipoResposta === 'sim_nao' ? 'Sim' : item.tipoResposta === 'texto_curto' ? 'Ok' : null 
        })) || []
    })) || []
  );


  useEffect(() => {
    if (osDataFound) {
      setOsData(osDataFound);
      setCurrentStatus(osDataFound.status as OSStatus);
      setDiagnostico(osDataFound.diagnosticoTecnico || "");
      setItensServico(osDataFound.itensExecutados || []);
      // Atualizar filledChecklistsForOS com base nos dados carregados da OS
      // Isso simula que a OS já pode ter checklists preenchidos com respostas
       const loadedFilledChecklists = osDataFound.checklistsPreenchidos.map(info => {
        const model = mockChecklistModelsData.find(m => m.id === info.modelId);
        return {
          ...info,
          respostas: model?.itens.map(item => {
            // Simulação de busca de resposta, em um caso real viria do DB/OS
            const mockResposta = `Resposta para ${item.texto.substring(0,10)}...`; 
            return {
              itemId: item.id,
              texto: item.texto,
              resposta: item.tipoResposta === 'upload_foto' ? 'https://placehold.co/100x75.png' : (Math.random() > 0.5 ? "Sim" : mockResposta)
            };
          }) || []
        };
      });
      setFilledChecklistsForOS(loadedFilledChecklists);
    }
  }, [osDataFound]);

  useEffect(() => {
    if (selectedChecklistModelId) {
      const model = mockChecklistModelsData.find(m => m.id === selectedChecklistModelId);
      setCurrentChecklistItemsToFill(model ? model.itens : []);
      setChecklistResponses({}); 
    } else {
      setCurrentChecklistItemsToFill([]);
    }
  }, [selectedChecklistModelId]);


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
    console.log("Diagnóstico salvo:", diagnostico);
    // Aqui, atualizaria o mockOrdensServico ou faria uma chamada API
    const osIndex = mockOrdensServico.findIndex(os => os.id === osData.id);
    if (osIndex > -1) {
      mockOrdensServico[osIndex].diagnosticoTecnico = diagnostico;
    }
    toast({ title: "Diagnóstico Salvo", description: "Diagnóstico técnico salvo com sucesso (Simulado)"});
  };
  
  const handleAddItem = (tipo: 'servico' | 'peca') => {
    const newItem: ItemOS = {
        id: `new_${tipo}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        descricao: "", 
        valor: 0,
        tipo: tipo,
        ...(tipo === 'peca' && { quantidade: 1 }),
    };
    setItensServico(prev => [...prev, newItem]);
    toast({title: `${tipo === 'servico' ? 'Serviço' : 'Peça'} Adicionado(a)`, description: "Preencha os detalhes do novo item."});
  }

  const handleRemoveItem = (itemId: string) => {
    setItensServico(prev => prev.filter(item => item.id !== itemId));
    toast({title: "Item Removido", description: "Item removido da OS."});
  }

  const handleItemChange = (itemId: string, field: keyof ItemOS, value: string | number) => {
    setItensServico(prevItems => 
        prevItems.map(item => {
            if (item.id === itemId) {
                const updatedItem = { ...item, [field]: value };
                if (field === 'valor' || field === 'quantidade') {
                    updatedItem[field] = parseFloat(value as string) || 0;
                    if (field === 'quantidade' && updatedItem[field] < 0) updatedItem[field] = 0;
                }
                return updatedItem;
            }
            return item;
        })
    );
  }
  
  const totalOs = React.useMemo(() => {
    return itensServico.reduce((acc, item) => {
        const itemValue = item.valor || 0;
        const itemQuantity = item.tipo === 'peca' ? (item.quantidade || 1) : 1;
        return acc + (itemValue * itemQuantity);
    }, 0);
  }, [itensServico]);

  const totalServicos = React.useMemo(() => {
    return itensServico
      .filter(item => item.tipo === 'servico')
      .reduce((acc, item) => acc + (item.valor || 0), 0);
  }, [itensServico]);

  const totalPecas = React.useMemo(() => {
    return itensServico
      .filter(item => item.tipo === 'peca')
      .reduce((acc, item) => acc + (item.valor || 0) * (item.quantidade || 1), 0);
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

  const handleChecklistResponseChange = (itemId: string, value: any) => {
    setChecklistResponses(prev => ({ ...prev, [itemId]: value }));
  };
  
  const handleSaveFilledChecklist = () => {
    if (!selectedChecklistModelId || !checklistResponsavel.trim()) {
        toast({ variant: "destructive", title: "Erro", description: "Selecione um modelo de checklist e informe o responsável."});
        return;
    }
    const model = mockChecklistModelsData.find(m => m.id === selectedChecklistModelId);
    if (!model) return;

    const newFilledChecklist: FilledChecklist = {
        id: `filled_${Date.now()}`,
        modelId: model.id,
        modelName: model.nome,
        dataPreenchimento: new Date().toISOString(),
        responsavel: checklistResponsavel,
        respostas: model.itens.map(item => ({
            itemId: item.id,
            texto: item.texto, 
            resposta: checklistResponses[item.id] !== undefined ? checklistResponses[item.id] : null,
        })),
    };

    setFilledChecklistsForOS(prev => [...prev, newFilledChecklist]);
    
    // Atualizar o mockOrdensServico global (simulação)
    const osIndex = mockOrdensServico.findIndex(os => os.id === osData.id);
    if (osIndex > -1) {
      const currentChecklistsInfo = mockOrdensServico[osIndex].checklistsPreenchidos || [];
      // Adicionamos apenas a info, já que 'respostas' seria grande para o mock da lista
      const newChecklistInfo: FilledChecklistInfo = {
        id: newFilledChecklist.id,
        modelId: newFilledChecklist.modelId,
        modelName: newFilledChecklist.modelName,
        dataPreenchimento: newFilledChecklist.dataPreenchimento,
        responsavel: newFilledChecklist.responsavel,
      };
      mockOrdensServico[osIndex].checklistsPreenchidos = [...currentChecklistsInfo, newChecklistInfo];
    }

    toast({title: "Checklist Salvo", description: `Checklist "${model.nome}" preenchido e salvo para esta OS.`});
    setIsChecklistModalOpen(false);
    setSelectedChecklistModelId("");
    setChecklistResponsavel("");
    setChecklistResponses({});
  };
  
  const renderChecklistItemInput = (item: ChecklistItemModel) => {
    const responseValue = checklistResponses[item.id];

    switch (item.tipoResposta) {
        case "texto_curto":
            return <Input value={responseValue || ""} onChange={(e) => handleChecklistResponseChange(item.id, e.target.value)} placeholder="Resposta curta" />;
        case "texto_longo":
            return <Textarea value={responseValue || ""} onChange={(e) => handleChecklistResponseChange(item.id, e.target.value)} placeholder="Resposta detalhada" rows={2} />;
        case "sim_nao":
            return (
                <RadioGroup value={responseValue} onValueChange={(value) => handleChecklistResponseChange(item.id, value)} className="flex space-x-2">
                    <div className="flex items-center space-x-1"><RadioGroupItem value="Sim" id={`${item.id}_sim`} /><Label htmlFor={`${item.id}_sim`}>Sim</Label></div>
                    <div className="flex items-center space-x-1"><RadioGroupItem value="Não" id={`${item.id}_nao`} /><Label htmlFor={`${item.id}_nao`}>Não</Label></div>
                    <div className="flex items-center space-x-1"><RadioGroupItem value="N/A" id={`${item.id}_na`} /><Label htmlFor={`${item.id}_na`}>N/A</Label></div>
                </RadioGroup>
            );
        case "multipla_escolha": {
            const options = item.opcoesResposta?.split(',') || [];
            const currentSelection = Array.isArray(responseValue) ? responseValue : [];
            return (
                <div className="space-y-2">
                    {options.map(opt => (
                        <div key={opt} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`${item.id}_${opt}`} 
                                checked={currentSelection.includes(opt)}
                                onCheckedChange={(checked) => {
                                    const newSelection = checked 
                                        ? [...currentSelection, opt] 
                                        : currentSelection.filter(val => val !== opt);
                                    handleChecklistResponseChange(item.id, newSelection);
                                }}
                            />
                            <Label htmlFor={`${item.id}_${opt}`}>{opt}</Label>
                        </div>
                    ))}
                </div>
            );
        }
        case "unica_escolha": {
            const options = item.opcoesResposta?.split(',') || [];
            return (
                <RadioGroup value={responseValue} onValueChange={(value) => handleChecklistResponseChange(item.id, value)} className="space-y-1">
                    {options.map(opt => (
                        <div key={opt} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`${item.id}_${opt}`} />
                            <Label htmlFor={`${item.id}_${opt}`}>{opt}</Label>
                        </div>
                    ))}
                </RadioGroup>
            );
        }
        case "upload_foto":
            return <Input value={responseValue || ""} onChange={(e) => handleChecklistResponseChange(item.id, e.target.value)} placeholder="URL da foto (ex: https://...)" />;
        default:
            return <p className="text-xs text-muted-foreground">Tipo de resposta não configurado.</p>;
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

      <Card className="shadow-md">
        <CardHeader><CardTitle>Status Atual e Ações Rápidas</CardTitle></CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="statusOs">Alterar Status da OS</Label>
            <Select value={currentStatus} onValueChange={(value) => handleStatusChange(value as OSStatus)}>
              <SelectTrigger id="statusOs"><SelectValue placeholder="Selecione o status" /></SelectTrigger>
              <SelectContent>{statusOptions.map(option => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          <Badge variant={getStatusBadgeVariant(currentStatus!)} className="text-lg px-4 py-2 mt-2 sm:mt-5 whitespace-nowrap">{currentStatus}</Badge>
          {currentStatus === "Aguardando Orçamento" && (<Button onClick={() => toast({title: "Gerar Orçamento (Simulado)"})} className="mt-2 sm:mt-5 w-full sm:w-auto"><FileText className="mr-2 h-4 w-4"/> Gerar Orçamento</Button>)}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
          <div>
            <p className="font-semibold flex items-center gap-1 mb-0.5"><User className="h-4 w-4 text-primary"/> Cliente:</p>
            <p className="ml-1">{cliente?.nomeCompleto || "N/A"}</p>
            <p className="ml-1 text-xs text-muted-foreground">Tel: {cliente?.telefone || "N/A"} | Email: {cliente?.email || "N/A"}</p>
          </div>
          <div>
            <p className="font-semibold flex items-center gap-1 mb-0.5"><Car className="h-4 w-4 text-primary"/> Veículo:</p>
            <p className="ml-1">{veiculo?.marca} {veiculo?.modelo} ({veiculo?.placa})</p>
            <p className="ml-1 text-xs text-muted-foreground">Ano Fab/Mod: {veiculo?.anoFabricacao || '?'}/{veiculo?.anoModelo || '?'} | Cor: {veiculo?.cor || '?'} | KM: {veiculo?.quilometragem ? `${veiculo.quilometragem.toLocaleString('pt-BR')} km` : "N/A"}</p>
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
      
      <Card className="shadow-md">
        <CardHeader><CardTitle>Serviços Realizados e Peças Utilizadas</CardTitle><CardDescription>Liste todos os itens executados e seus valores.</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {itensServico.map((item) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_120px_auto] gap-2 items-center p-2 border rounded-md bg-muted/20">
                <Input value={item.descricao} onChange={(e) => handleItemChange(item.id, 'descricao', e.target.value)} placeholder={item.tipo === 'servico' ? "Descrição do Serviço" : "Nome da Peça"} className="bg-background"/>
                {item.tipo === 'peca' ? (<Input type="number" value={item.quantidade || 1} onChange={(e) => handleItemChange(item.id, 'quantidade', e.target.value)} className="text-center bg-background" min="1" placeholder="Qtd"/>): <div className="hidden sm:block"></div> }
                <div className="relative"><span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span><Input type="number" value={item.valor} onChange={(e) => handleItemChange(item.id, 'valor', e.target.value)} placeholder="Valor" className="pl-7 bg-background" min="0" step="0.01"/></div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-destructive hover:text-destructive h-8 w-8 justify-self-end sm:justify-self-center"><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
           <div className="flex gap-2 mb-4">
             <Button variant="outline" size="sm" onClick={() => handleAddItem('servico')}><PlusCircle className="mr-2 h-4 w-4"/>Adicionar Serviço</Button>
             <Button variant="outline" size="sm" onClick={() => handleAddItem('peca')}><PlusCircle className="mr-2 h-4 w-4"/>Adicionar Peça</Button>
           </div>
           <Separator />
           <div className="text-right mt-4 space-y-1">
                <p className="text-sm text-muted-foreground">Subtotal Mão de Obra: <span className="font-semibold text-foreground">R$ {totalServicos.toFixed(2)}</span></p>
                <p className="text-sm text-muted-foreground">Subtotal Peças: <span className="font-semibold text-foreground">R$ {totalPecas.toFixed(2)}</span></p>
                <p className="text-xl font-bold">Total da OS: <span className="text-primary">R$ {totalOs.toFixed(2)}</span></p>
           </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader><CardTitle>Diagnóstico Técnico e Observações Internas</CardTitle></CardHeader>
        <CardContent>
            <Label htmlFor="diagnosticoOs">Relatório do Mecânico / Diagnóstico</Label>
            <Textarea id="diagnosticoOs" placeholder="Descreva o diagnóstico, os procedimentos realizados, recomendações futuras, etc." value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} rows={5} className="mb-2"/>
            <Button onClick={handleSaveDiagnostico} size="sm">Salvar Diagnóstico</Button>
            {osData.observacoesInternas && (<><Separator className="my-4"/><Label>Observações Internas da Entrada</Label><p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/20 whitespace-pre-wrap">{osData.observacoesInternas}</p></>)}
        </CardContent>
      </Card>

      {/* Checklists Vinculados à OS */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ListChecks /> Checklists Vinculados à OS</CardTitle>
          <CardDescription>Adicione e visualize checklists preenchidos para esta Ordem de Serviço.</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isChecklistModalOpen} onOpenChange={setIsChecklistModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mb-4"><PlusCircle className="mr-2 h-4 w-4"/> Adicionar Checklist Preenchido</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Preencher Novo Checklist</DialogTitle>
                <DialogDescription>Selecione um modelo e preencha os itens.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2 flex-grow overflow-y-auto pr-2">
                <div className="space-y-2">
                  <Label htmlFor="checklistModelSelect">Modelo de Checklist</Label>
                  <Select value={selectedChecklistModelId} onValueChange={setSelectedChecklistModelId}>
                    <SelectTrigger id="checklistModelSelect"><SelectValue placeholder="Selecione um modelo" /></SelectTrigger>
                    <SelectContent>
                      {mockChecklistModelsData.map(model => (
                        <SelectItem key={model.id} value={model.id}>{model.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {currentChecklistItemsToFill.length > 0 && (
                  <>
                    <div className="space-y-2">
                        <Label htmlFor="checklistResponsavel">Responsável pelo Preenchimento</Label>
                        <Input id="checklistResponsavel" value={checklistResponsavel} onChange={(e) => setChecklistResponsavel(e.target.value)} placeholder="Nome do mecânico/inspetor" />
                    </div>
                    <Separator className="my-3"/>
                    <h4 className="font-medium text-md mb-2">Itens do Checklist: {mockChecklistModelsData.find(m=>m.id === selectedChecklistModelId)?.nome}</h4>
                  </>
                )}
                <div className="space-y-5">
                  {currentChecklistItemsToFill.map(item => (
                    <div key={item.id} className="p-3 border rounded-md bg-muted/30 space-y-1.5">
                      <Label htmlFor={`item_${item.id}`} className="text-sm font-medium">
                        {item.texto} {item.obrigatorio && <span className="text-destructive">*</span>}
                      </Label>
                      <p className="text-xs text-muted-foreground">Tipo: {tiposRespostaLabels[item.tipoResposta]}</p>
                      {renderChecklistItemInput(item)}
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter className="mt-auto pt-4 border-t">
                <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                <Button type="button" onClick={handleSaveFilledChecklist} disabled={!selectedChecklistModelId || !checklistResponsavel.trim()}>Salvar Checklist Preenchido</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {filledChecklistsForOS.length > 0 ? (
            <div className="space-y-3">
              {filledChecklistsForOS.map(filled => (
                <Card key={filled.id} className="bg-muted/40">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-md flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary"/> {filled.modelName}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground px-4 pb-3">
                    <p>Preenchido por: {filled.responsavel}</p>
                    <p>Data: {format(parseISO(filled.dataPreenchimento), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                  </CardContent>
                  <CardFooter className="px-4 pb-3 pt-0">
                    <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => toast({ title: "Visualização em desenvolvimento", description: `Exibiria detalhes do checklist ${filled.modelName} (ID: ${filled.id})` })}>
                      Visualizar Preenchimento
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum checklist preenchido para esta OS.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader><CardTitle>Fotos e Anexos</CardTitle><CardDescription>Registre imagens do serviço ou anexe documentos relevantes.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {osData.fotos.map((foto, index) => (<div key={index} className="group relative"><Image src={foto.url} alt={foto.legenda} width={200} height={150} className="rounded-md object-cover aspect-video" data-ai-hint={foto.dataAiHint || 'vehicle service'} /><p className="text-xs text-center mt-1 text-muted-foreground">{foto.legenda}</p></div>))}
             <Button variant="outline" className="aspect-video h-auto flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary border-dashed" onClick={() => toast({title: "Upload de fotos em desenvolvimento"})}>
                <Camera className="h-8 w-8" /><span className="text-xs">Adicionar Foto</span>
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast({title: "Anexar arquivos em desenvolvimento"})}><Paperclip className="mr-2 h-4 w-4" /> Anexar Documento</Button>
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
