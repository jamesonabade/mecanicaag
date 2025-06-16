
"use client";

import React, { useState, useMemo } from "react"; // Added useState, useMemo
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Added Table
import { ChevronLeft, FileArchive, Download, Search, Filter, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select
import { format, parseISO } from "date-fns"; // Added date-fns
import { ptBR } from "date-fns/locale";

interface NFe {
  id: string;
  numero: string;
  serie: string;
  clienteFornecedor: string;
  dataEmissao: string; // ISO string
  valorTotal: number;
  status: "Emitida" | "Cancelada" | "Recebida" | "Pendente";
  tipo: "Venda" | "Compra";
}

const mockNFeData: NFe[] = [
  { id: "nfe001", numero: "000123", serie: "1", clienteFornecedor: "João da Silva", dataEmissao: "2024-07-20T10:00:00Z", valorTotal: 450.00, status: "Emitida", tipo: "Venda" },
  { id: "nfe002", numero: "000124", serie: "1", clienteFornecedor: "Maria Oliveira", dataEmissao: "2024-07-18T14:30:00Z", valorTotal: 1200.75, status: "Emitida", tipo: "Venda" },
  { id: "nfe003", numero: "000125", serie: "1", clienteFornecedor: "Carlos Pereira", dataEmissao: "2024-07-15T09:00:00Z", valorTotal: 85.30, status: "Cancelada", tipo: "Venda" },
  { id: "nfe004", numero: "005678", serie: "1", clienteFornecedor: "Distribuidora AutoPeças Alfa", dataEmissao: "2024-07-10T11:00:00Z", valorTotal: 1850.60, status: "Recebida", tipo: "Compra" },
  { id: "nfe005", numero: "000126", serie: "1", clienteFornecedor: "Empresa XYZ Ltda", dataEmissao: "2024-07-22T16:00:00Z", valorTotal: 3200.00, status: "Pendente", tipo: "Venda" },
];

type NFeStatusFilter = "Todas" | NFe["status"];
type NFeTipoFilter = "Ambos" | NFe["tipo"];

const statusNFeOptions: { value: NFeStatusFilter; label: string }[] = [
  { value: "Todas", label: "Todos os Status" },
  { value: "Emitida", label: "Emitida (Saída)" },
  { value: "Cancelada", label: "Cancelada (Saída)" },
  { value: "Pendente", label: "Pendente (Saída)" },
  { value: "Recebida", label: "Recebida (Entrada)" },
];

const tipoNFeOptions: { value: NFeTipoFilter; label: string }[] = [
  { value: "Ambos", label: "Ambos Tipos (Venda/Compra)"},
  { value: "Venda", label: "NF-e de Venda"},
  { value: "Compra", label: "NF-e de Compra"},
];


export default function NotasFiscaisPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<NFeStatusFilter>("Todas");
  const [tipoFilter, setTipoFilter] = useState<NFeTipoFilter>("Ambos");

  const handleAction = (action: string, id?: string) => {
    toast({
      title: `Ação em Desenvolvimento (${action})`,
      description: id ? `A funcionalidade para ${action.toLowerCase()} a NF-e ${id} será implementada.` : `A funcionalidade de ${action.toLowerCase()} será implementada.`,
    });
  };
  
  const handleAdvancedFilter = () => {
    toast({
      title: "Filtros Avançados (Em Desenvolvimento)",
      description: "Mais opções de filtro serão adicionadas aqui.",
    });
  };

  const filteredNFe = useMemo(() => {
    return mockNFeData.filter(nfe => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = 
        nfe.numero.includes(searchTermLower) ||
        nfe.clienteFornecedor.toLowerCase().includes(searchTermLower) ||
        nfe.id.toLowerCase().includes(searchTermLower);
      
      const matchesStatus = statusFilter === "Todas" || nfe.status === statusFilter;
      const matchesTipo = tipoFilter === "Ambos" || nfe.tipo === tipoFilter;

      return matchesSearchTerm && matchesStatus && matchesTipo;
    });
  }, [searchTerm, statusFilter, tipoFilter]);


  const getStatusBadgeVariant = (status: NFe["status"]): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Emitida": return "default";
      case "Recebida": return "default";
      case "Pendente": return "secondary";
      case "Cancelada": return "destructive";
      default: return "outline";
    }
  };


  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <FileArchive /> Gerenciamento de Notas Fiscais (NF-e)
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" onClick={() => handleAction("Nova NF-e de Venda Direta")} className="flex-1 md:flex-initial">
                <PlusCircle className="mr-2 h-4 w-4" /> Nova NF-e (Venda)
            </Button>
             <Button variant="outline" asChild className="flex-1 md:flex-initial">
                <Link href="/dashboard/financeiro">
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Financeiro
                </Link>
            </Button>
        </div>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Consultar Notas Fiscais</CardTitle>
          <CardDescription>Busque e filtre as NF-e de venda e compra.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="searchNFe" className="block text-sm font-medium text-muted-foreground mb-1">
                    Buscar (Nº, Cliente/Fornecedor, Chave)
                    </label>
                    <Input 
                        id="searchNFe" 
                        type="text" 
                        placeholder="Digite para buscar..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-9"
                    />
                </div>
                <div>
                    <label htmlFor="filterStatusNFe" className="block text-sm font-medium text-muted-foreground mb-1">
                        Status da NF-e
                    </label>
                    <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as NFeStatusFilter)}>
                        <SelectTrigger id="filterStatusNFe" className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {statusNFeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label htmlFor="filterTipoNFe" className="block text-sm font-medium text-muted-foreground mb-1">
                        Tipo da NF-e
                    </label>
                    <Select value={tipoFilter} onValueChange={(val) => setTipoFilter(val as NFeTipoFilter)}>
                        <SelectTrigger id="filterTipoNFe" className="h-9"><SelectValue /></SelectTrigger>
                        <SelectContent>
                             {tipoNFeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <Button onClick={() => toast({title: "Filtros Aplicados"})} className="h-9 flex-1 sm:flex-initial">
                    <Search className="mr-2 h-4 w-4" /> Buscar
                </Button>
                <Button variant="outline" onClick={handleAdvancedFilter} className="h-9 flex-1 sm:flex-initial">
                    <Filter className="mr-2 h-4 w-4" /> Filtros Avançados
                </Button>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Notas Fiscais</CardTitle>
          <CardDescription>
            Visualize, baixe XML/DANFE ou cancele NF-e (funcionalidades simuladas).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNFe.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número/Série</TableHead>
                    <TableHead>Cliente/Fornecedor</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor (R$)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNFe.map((nfe) => (
                    <TableRow key={nfe.id}>
                      <TableCell className="font-medium">{nfe.numero}/{nfe.serie}</TableCell>
                      <TableCell>{nfe.clienteFornecedor}</TableCell>
                      <TableCell>{format(parseISO(nfe.dataEmissao), "dd/MM/yyyy HH:mm", {locale: ptBR})}</TableCell>
                      <TableCell><Badge variant={nfe.tipo === "Venda" ? "secondary" : "outline"}>{nfe.tipo}</Badge></TableCell>
                      <TableCell className="text-right">{nfe.valorTotal.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(nfe.status)} className="text-xs">
                          {nfe.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleAction("Visualizar", nfe.id)}>Visualizar</Button>
                        <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleAction("Baixar XML", nfe.id)}>XML</Button>
                        <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleAction("Baixar DANFE", nfe.id)}>DANFE</Button>
                        {nfe.status === "Emitida" && nfe.tipo === "Venda" && <Button variant="link" size="sm" className="text-destructive p-0 h-auto" onClick={() => handleAction("Cancelar", nfe.id)}>Cancelar</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center">
            <FileArchive className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="mb-2">Nenhuma Nota Fiscal para exibir com os filtros atuais.</p>
            {searchTerm === "" && statusFilter === "Todas" && tipoFilter === "Ambos" && (
                <p>Utilize os filtros acima ou registre novas transações fiscais.</p>
            )}
          </div>
          )}
        </CardContent>
         <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Total de {filteredNFe.length} NF-e listada(s).</p>
        </CardFooter>
      </Card>
    </div>
  );
}
