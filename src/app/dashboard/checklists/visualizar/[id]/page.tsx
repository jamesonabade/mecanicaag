
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Printer, Edit, FileText, CheckSquare, Camera } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation"; // Use next/navigation for App Router
import React from "react";
// Import next/image
import Image from "next/image";


// Mock data for demonstration - replace with actual data fetching
const mockChecklistData = {
  id: "chk001",
  nome: "Checklist de Inspeção Veicular Pré-Serviço",
  descricao: "Usado para registrar as condições do veículo ao chegar na oficina.",
  aplicavelPara: "entrada_veiculo",
  itens: [
    { id: "item01", texto: "Condição da pintura (arranhões, amassados)", tipoResposta: "texto_longo", obrigatorio: true, resposta: "Arranhões leves no para-choque traseiro." },
    { id: "item02", texto: "Nível do óleo do motor", tipoResposta: "unica_escolha", opcoesResposta: "Abaixo,Normal,Acima", obrigatorio: true, resposta: "Normal" },
    { id: "item03", texto: "Nível do fluido de freio", tipoResposta: "sim_nao", obrigatorio: true, resposta: "Sim" },
    { id: "item04", texto: "Calibragem dos pneus (PSI)", tipoResposta: "texto_curto", obrigatorio: false, resposta: "32 PSI" },
    { id: "item05", texto: "Itens deixados no veículo pelo cliente", tipoResposta: "multipla_escolha", opcoesResposta: "Documentos,Estepe,Macaco,Chave de Roda,Pertences Pessoais", obrigatorio: false, resposta: "Documentos,Estepe" },
    { id: "item06", texto: "Foto da frente do veículo", tipoResposta: "upload_foto", obrigatorio: true, resposta: "https://placehold.co/300x200.png" },
    { id: "item07", texto: "Foto da traseira do veículo", tipoResposta: "upload_foto", obrigatorio: false, resposta: "https://placehold.co/300x200.png" },
  ],
  dataPreenchimento: "2024-07-25T10:30:00Z",
  responsavel: "Carlos Alberto (Mecânico)",
  veiculo: "Honda Civic - ABC-1234",
  cliente: "João da Silva",
};

type ChecklistItem = typeof mockChecklistData.itens[0];

// Helper for rendering response inputs based on type (currently displays stored answer)
const tiposResposta = [
    { value: "texto_curto", label: "Texto Curto" },
    { value: "texto_longo", label: "Texto Longo" },
    { value: "sim_nao", label: "Sim/Não" },
    { value: "multipla_escolha", label: "Múltipla Escolha (Checkbox)" },
    { value: "unica_escolha", label: "Única Escolha (Radio)" },
    { value: "upload_foto", label: "Upload de Foto" },
];

const renderRespostaInput = (item: ChecklistItem) => {
    if (item.resposta === undefined || item.resposta === null || item.resposta === "") {
        return <p className="text-sm text-muted-foreground italic">Não respondido</p>;
    }

    switch (item.tipoResposta) {
        case "texto_curto":
        case "texto_longo":
            return <p className="text-sm p-2 border rounded-md bg-muted/20">{item.resposta}</p>;
        case "sim_nao":
            return <p className="text-sm font-medium">{item.resposta === "Sim" ? "Sim" : (item.resposta === "Não" ? "Não" : item.resposta)}</p>;
        case "unica_escolha":
            return <p className="text-sm font-medium">{item.resposta}</p>;
        case "multipla_escolha":
            return <p className="text-sm">{item.resposta.split(',').join(', ')}</p>;
        case "upload_foto":
            return (
                <Image 
                    src={item.resposta} 
                    alt={`Foto para ${item.texto}`} 
                    width={300} 
                    height={200} 
                    className="max-w-xs max-h-48 rounded-md border object-contain" 
                    data-ai-hint={item.id === "item06" ? "vehicle front" : item.id === "item07" ? "vehicle rear" : "vehicle detail"}
                />
            );
        default:
            return <p className="text-sm text-muted-foreground">Tipo de resposta não suportado para visualização.</p>;
    }
};


export default function VisualizarChecklistPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  // In a real app, you would fetch checklist data based on the id
  const checklist = { ...mockChecklistData, id: id }; 

  if (!checklist) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Checklist não encontrado.</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard/checklists">Voltar para Checklists</Link>
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    toast({ title: "Imprimir Checklist", description: "Funcionalidade de impressão em desenvolvimento." });
    // window.print();
  };

  const handleEdit = () => {
    toast({ title: "Editar Checklist", description: `A edição de checklists preenchidos/modelos ainda será implementada.` });
    // router.push(`/dashboard/checklists/editar/${id}`); // If editing model
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <FileText className="h-7 w-7"/> Visualizar Checklist
          </h1>
          <p className="text-muted-foreground">{checklist.nome}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Editar Modelo (Dev)
          </Button>
          <Button variant="default" asChild>
            <Link href="/dashboard/checklists">
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detalhes do Checklist Preenchido</CardTitle>
          <CardDescription>
            {checklist.descricao || "Visualização das respostas do checklist."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 text-sm p-4 border rounded-md bg-muted/30">
            <p><strong>ID do Checklist:</strong> {checklist.id}</p>
            <p><strong>Veículo:</strong> {checklist.veiculo}</p>
            <p><strong>Cliente:</strong> {checklist.cliente}</p>
            <p><strong>Data Preenchimento:</strong> {new Date(checklist.dataPreenchimento).toLocaleString('pt-BR')}</p>
            <p className="md:col-span-2"><strong>Responsável:</strong> {checklist.responsavel}</p>
          </div>

          <h3 className="text-xl font-semibold pt-4 border-t mt-4">Itens e Respostas:</h3>
          <div className="space-y-6">
            {checklist.itens.map((item, index) => (
              <Card key={item.id || index} className="p-4">
                <div className="mb-2">
                  <Label htmlFor={`item-${index}`} className="font-semibold text-base flex items-center gap-2">
                    {item.tipoResposta === "upload_foto" ? <Camera className="h-4 w-4 text-primary"/> : <CheckSquare className="h-4 w-4 text-primary"/>}
                    {item.texto}
                    {item.obrigatorio && <span className="text-destructive text-xs">(Obrigatório)</span>}
                  </Label>
                   <p className="text-xs text-muted-foreground ml-6">Tipo: {tiposResposta.find(tr => tr.value === item.tipoResposta)?.label || item.tipoResposta}</p>
                </div>
                <div className="pl-6">
                    {renderRespostaInput(item)}
                </div>
                 {item.tipoResposta === "multipla_escolha" || item.tipoResposta === "unica_escolha" ? (
                    <p className="text-xs text-muted-foreground mt-1 pl-6">Opções disponíveis: {item.opcoesResposta}</p>
                ) : null}
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
            <p className="text-xs text-muted-foreground">Checklist preenchido em {new Date(checklist.dataPreenchimento).toLocaleDateString('pt-BR')}.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
