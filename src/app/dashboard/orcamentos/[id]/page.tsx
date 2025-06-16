
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Printer, Edit, FileText, CheckCircle, XCircle, Mail, FileSpreadsheet, User, Car, CalendarIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getClienteById, Cliente } from "@/lib/mockData/clientes";
import { getVeiculoById, Veiculo } from "@/lib/mockData/veiculos";


// Mock data - Mover para um arquivo central no futuro
const mockOrcamentosFullData = [
  {
    id: "ORC001",
    clienteId: "cli_modelo_001", // Alterado para usar o cliente modelo
    veiculoId: "vec_modelo_001", // Alterado para usar o veículo modelo
    dataOrcamento: "2024-07-28T10:00:00Z",
    validadeDias: 15,
    servicos: [
      { id: "s1", descricao: "Troca de óleo e filtro de óleo do motor", valor: 150.00 },
      { id: "s2", descricao: "Alinhamento computadorizado e Balanceamento das 4 rodas", valor: 120.00 },
    ],
    pecas: [
      { id: "p1", codigo: "XYZ-123", nome: "Óleo Motor 5W30 Sintético Mobil (Litro)", quantidade: 4, valorUnitario: 45.00 },
      { id: "p2", codigo: "FIL-001", nome: "Filtro de Óleo Original Exemplo", quantidade: 1, valorUnitario: 35.00 },
    ],
    descontoValor: 20.00,
    observacoes: "Cliente solicitou urgência. Verificar disponibilidade das peças. Pagamento em 3x no cartão.",
    status: "Aprovado",
  },
  {
    id: "ORC002",
    clienteId: "cli_002_maria", 
    veiculoId: "vec_003_corolla", 
    dataOrcamento: "2024-07-29T14:30:00Z",
    validadeDias: 7,
    servicos: [
      { id: "s1_orc2", descricao: "Diagnóstico completo do sistema de injeção", valor: 250.00 },
      { id: "s2_orc2", descricao: "Substituição da bomba de combustível", valor: 450.00 },
    ],
    pecas: [
      { id: "p1_orc2", codigo: "BC-555", nome: "Bomba de Combustível Bosch", quantidade: 1, valorUnitario: 550.75 },
    ],
    descontoValor: 0,
    observacoes: "Veículo falhando em baixas rotações. Cliente ciente do prazo de entrega da peça.",
    status: "Pendente",
  },
   {
    id: "ORC003",
    clienteId: "cli_modelo_001", 
    veiculoId: "vec_002_strada", 
    dataOrcamento: "2024-07-30T09:15:00Z",
    validadeDias: 10,
    servicos: [ { id: "s1_orc3", descricao: "Verificação e recarga do ar condicionado", valor: 320.00 } ],
    pecas: [],
    descontoValor: 0,
    observacoes: "Ar condicionado não está gelando.",
    status: "Rejeitado",
  },
   {
    id: "ORC004",
    clienteId: "cli_003_carlos", 
    veiculoId: "vec_004_nivus", 
    dataOrcamento: "2024-07-30T11:00:00Z",
    validadeDias: 5,
    servicos: [ { id: "s1_orc4", descricao: "Instalação de kit multimídia", valor: 300.00 } ],
    pecas: [ { id: "p1_orc4", codigo: "KM-NAVPRO", nome: "Kit Multimídia NavPro 9pol", quantidade: 1, valorUnitario: 580.50 } ],
    descontoValor: 0,
    observacoes: "",
    status: "ConvertidoOS",
  },
];

export default function VisualizarOrcamentoPage() {
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();

  const orcamento = React.useMemo(() => {
    const data = mockOrcamentosFullData.find(o => o.id === id);
    if (!data) return null;

    const totalServicos = data.servicos.reduce((acc, s) => acc + s.valor, 0);
    const totalPecas = data.pecas.reduce((acc, p) => acc + (p.valorUnitario * p.quantidade), 0);
    const subTotalGeral = totalServicos + totalPecas;
    const totalGeral = subTotalGeral - (data.descontoValor || 0);
    
    const cliente = getClienteById(data.clienteId);
    const veiculo = getVeiculoById(data.veiculoId);

    return { ...data, totalServicos, totalPecas, subTotalGeral, totalGeral, cliente, veiculo };
  }, [id]);

  if (!orcamento) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Orçamento não encontrado.</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard/orcamentos">Voltar para Lista de Orçamentos</Link>
        </Button>
      </div>
    );
  }
  
  const { cliente, veiculo } = orcamento;

  const handlePrint = () => {
    toast({ title: "Imprimir Orçamento", description: "Funcionalidade de impressão em desenvolvimento." });
    // window.print(); // Descomentar para habilitar impressão real
  };
  
  const handleSendEmail = () => {
    toast({ title: "Enviar por Email", description: `Simulando envio do orçamento ${orcamento.id} para ${orcamento.cliente?.email}.` });
  };
  
  const handleConvertToOS = () => {
    if (orcamento.status === "Aprovado" || orcamento.status === "Pendente") {
       toast({ title: "Converter em OS", description: `Simulando conversão do orçamento ${orcamento.id} em Ordem de Serviço.` });
       // Aqui iria a lógica para mudar status e/ou redirecionar para nova OS
    } else {
       toast({ variant: "destructive", title: "Ação Inválida", description: `Orçamento com status "${orcamento.status}" não pode ser convertido diretamente.` });
    }
  };
  
  const handleChangeStatus = (newStatus: string) => {
      toast({ title: "Status Alterado", description: `Status do orçamento ${orcamento.id} alterado para ${newStatus} (simulado).` });
      // Atualizar o mockOrcamentos (ou fazer chamada API)
      // Forçar re-renderização ou atualizar estado local se necessário
  };


  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    // Esta função precisa ser consistente com a da página de listagem
    switch (status) {
      case "Aprovado": return "default";
      case "Pendente": return "secondary";
      case "Rejeitado": case "Cancelado": return "destructive";
      case "ConvertidoOS": return "outline"; 
      default: return "secondary";
    }
  };
  
  const getStatusLabel = (status: string): string => {
     switch (status) {
      case "Aprovado": return "Aprovado";
      case "Pendente": return "Pendente";
      case "Rejeitado": return "Rejeitado";
      case "Cancelado": return "Cancelado";
      case "ConvertidoOS": return "Convertido em OS";
      default: return status;
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <FileText className="h-7 w-7"/> Orçamento #{orcamento.id}
          </h1>
          <p className="text-muted-foreground">Detalhes do orçamento e ações disponíveis.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={handlePrint} className="flex-grow md:flex-grow-0"><Printer className="mr-2 h-4 w-4" /> Imprimir</Button>
          <Button variant="outline" onClick={handleSendEmail} className="flex-grow md:flex-grow-0"><Mail className="mr-2 h-4 w-4" /> Enviar por Email</Button>
          <Button asChild className="flex-grow md:flex-grow-0">
            <Link href={`/dashboard/orcamentos/novo?id=${orcamento.id}`}><Edit className="mr-2 h-4 w-4" /> Editar</Link>
          </Button>
           <Button variant="default" asChild className="flex-grow md:flex-grow-0">
            <Link href="/dashboard/orcamentos"><ChevronLeft className="mr-2 h-4 w-4" /> Voltar</Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle className="text-2xl mb-1">Orçamento Rápido</CardTitle>
              <CardDescription>Mecânica Ágil - Soluções Automotivas</CardDescription>
            </div>
            <div className="text-left md:text-right">
              <p className="font-semibold text-lg">ORÇAMENTO Nº: {orcamento.id}</p>
              <Badge variant={getStatusBadgeVariant(orcamento.status)} className="text-sm px-3 py-1 mt-1">{getStatusLabel(orcamento.status)}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            {/* Informações Cliente e Veículo */}
            <div className="grid md:grid-cols-2 gap-6 p-4 border rounded-lg">
                 <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><User className="h-5 w-5 text-primary"/> Cliente</h3>
                    <p><strong>Nome:</strong> {cliente?.nomeCompleto || 'N/A'}</p>
                    <p><strong>Telefone:</strong> {cliente?.telefone || 'N/A'}</p>
                    <p><strong>Email:</strong> {cliente?.email || 'N/A'}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Car className="h-5 w-5 text-primary"/> Veículo</h3>
                    <p><strong>Marca/Modelo:</strong> {veiculo?.marca} {veiculo?.modelo || 'N/A'}</p>
                    <p><strong>Placa:</strong> {veiculo?.placa || 'N/A'}</p>
                    <p><strong>Ano Fab/Mod:</strong> {veiculo?.anoFabricacao || 'N/A'}/{veiculo?.anoModelo || 'N/A'}</p>
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/20">
                 <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary"/>
                    <p><strong>Data do Orçamento:</strong> {format(new Date(orcamento.dataOrcamento), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
                <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-primary"/>
                    <p><strong>Validade:</strong> {orcamento.validadeDias} dias (até {format(new Date(new Date(orcamento.dataOrcamento).setDate(new Date(orcamento.dataOrcamento).getDate() + orcamento.validadeDias)), "dd/MM/yyyy", { locale: ptBR })})</p>
                </div>
            </div>
          
          {/* Serviços */}
          {orcamento.servicos.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Serviços (Mão de Obra)</h3>
              <Table>
                <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead className="text-right">Valor (R$)</TableHead></TableRow></TableHeader>
                <TableBody>
                  {orcamento.servicos.map(servico => (
                    <TableRow key={servico.id}><TableCell>{servico.descricao}</TableCell><TableCell className="text-right">{servico.valor.toFixed(2)}</TableCell></TableRow>
                  ))}
                   <TableRow className="bg-muted/40 hover:bg-muted/40"><TableCell className="font-bold">Subtotal Serviços</TableCell><TableCell className="text-right font-bold">{orcamento.totalServicos.toFixed(2)}</TableCell></TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Peças */}
          {orcamento.pecas.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Peças</h3>
              <Table>
                <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Nome</TableHead><TableHead className="text-center">Qtd.</TableHead><TableHead className="text-right">Vlr. Unit. (R$)</TableHead><TableHead className="text-right">Vlr. Total (R$)</TableHead></TableRow></TableHeader>
                <TableBody>
                  {orcamento.pecas.map(peca => (
                    <TableRow key={peca.id}>
                      <TableCell>{peca.codigo || "-"}</TableCell><TableCell>{peca.nome}</TableCell><TableCell className="text-center">{peca.quantidade}</TableCell>
                      <TableCell className="text-right">{peca.valorUnitario.toFixed(2)}</TableCell><TableCell className="text-right">{(peca.quantidade * peca.valorUnitario).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/40 hover:bg-muted/40"><TableCell colSpan={4} className="font-bold">Subtotal Peças</TableCell><TableCell className="text-right font-bold">{orcamento.totalPecas.toFixed(2)}</TableCell></TableRow>
                </TableBody>
              </Table>
            </div>
          )}
          
          <Separator className="my-6"/>

          {/* Totais */}
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 p-4 border rounded-lg">
            <div className="space-y-1 self-end">
                 <p className="text-md flex justify-between">Subtotal Serviços: <span className="font-semibold">R$ {orcamento.totalServicos.toFixed(2)}</span></p>
                 <p className="text-md flex justify-between">Subtotal Peças: <span className="font-semibold">R$ {orcamento.totalPecas.toFixed(2)}</span></p>
                 {orcamento.descontoValor > 0 && (
                    <p className="text-md flex justify-between text-destructive">Desconto: <span className="font-semibold">- R$ {orcamento.descontoValor.toFixed(2)}</span></p>
                 )}
            </div>
            <div className="text-left md:text-right self-end mt-2 md:mt-0">
                <p className="text-xl font-bold text-muted-foreground">TOTAL DO ORÇAMENTO:</p>
                <p className="text-4xl font-extrabold text-primary">R$ {orcamento.totalGeral.toFixed(2)}</p>
            </div>
          </div>

          {/* Observações */}
          {orcamento.observacoes && (
            <div>
              <h3 className="text-lg font-semibold mb-1">Observações</h3>
              <p className="text-sm text-muted-foreground p-3 border rounded-md bg-muted/20 whitespace-pre-wrap">{orcamento.observacoes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex gap-2 flex-wrap">
                {orcamento.status === "Pendente" && (
                    <>
                    <Button onClick={() => handleChangeStatus("Aprovado")} variant="default" size="sm"><CheckCircle className="mr-2 h-4 w-4"/> Marcar como Aprovado</Button>
                    <Button onClick={() => handleChangeStatus("Rejeitado")} variant="destructive" size="sm"><XCircle className="mr-2 h-4 w-4"/> Marcar como Rejeitado</Button>
                    </>
                )}
                {(orcamento.status === "Aprovado" || orcamento.status === "Pendente") && (
                    <Button onClick={handleConvertToOS} variant="outline" size="sm"><FileSpreadsheet className="mr-2 h-4 w-4"/> Converter em OS</Button>
                )}
           </div>
           <p className="text-xs text-muted-foreground">Orçamento gerado em {format(new Date(orcamento.dataOrcamento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
