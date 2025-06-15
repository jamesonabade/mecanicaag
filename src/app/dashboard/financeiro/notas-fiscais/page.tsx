
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileArchive, Download, Search, Filter, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function NotasFiscaisPage() {
  const { toast } = useToast();

  const handleAction = (action: string, id?: string) => {
    toast({
      title: `Ação em Desenvolvimento (${action})`,
      description: id ? `A funcionalidade para ${action.toLowerCase()} a NF-e ${id} será implementada.` : `A funcionalidade de ${action.toLowerCase()} será implementada.`,
    });
  };

  // Mock data for display
  const mockNFe = [
    { id: "NFE001", cliente: "João da Silva", data: "2024-07-20", valor: "R$ 450,00", status: "Emitida" },
    { id: "NFE002", cliente: "Maria Oliveira", data: "2024-07-18", valor: "R$ 1200,75", status: "Emitida" },
    { id: "NFE003", cliente: "Carlos Pereira", data: "2024-07-15", valor: "R$ 85,30", status: "Cancelada" },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <FileArchive /> Gerenciamento de Notas Fiscais (NF-e)
        </h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleAction("Nova NF-e de Venda Direta")}>
                <PlusCircle className="mr-2 h-4 w-4" /> Nova NF-e (Venda)
            </Button>
             <Button variant="outline" asChild>
                <Link href="/dashboard/financeiro">
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Financeiro
                </Link>
            </Button>
        </div>
       
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Consultar Notas Fiscais Emitidas</CardTitle>
          <CardDescription>Busque e filtre as NF-e de venda e compra.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow">
                <label htmlFor="searchNFe" className="block text-sm font-medium text-muted-foreground mb-1">
                Buscar por Cliente, Número da NF-e ou Chave
                </label>
                <Input id="searchNFe" type="text" placeholder="Digite para buscar..." />
            </div>
            <Button onClick={() => handleAction("Buscar NF-e")}>
                <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
            <Button variant="outline" onClick={() => handleAction("Filtrar NF-e")}>
                <Filter className="mr-2 h-4 w-4" /> Filtrar
            </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Notas Fiscais Emitidas (Venda)</CardTitle>
          <CardDescription>
            Visualize, baixe XML/DANFE ou cancele NF-e (funcionalidades simuladas).
            A emissão real de NF-e de venda ocorreria após uma OS ou venda de balcão e integração com sistema emissor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockNFe.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Número</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Emissão</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {mockNFe.map((nfe) => (
                    <tr key={nfe.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{nfe.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{nfe.cliente}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{nfe.data}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{nfe.valor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${nfe.status === "Emitida" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {nfe.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleAction("Visualizar", nfe.id)}>Visualizar</Button>
                        <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleAction("Baixar XML", nfe.id)}>XML</Button>
                        <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleAction("Baixar DANFE", nfe.id)}>DANFE</Button>
                        {nfe.status === "Emitida" && <Button variant="link" size="sm" className="text-destructive p-0 h-auto" onClick={() => handleAction("Cancelar", nfe.id)}>Cancelar</Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg h-64 flex flex-col items-center justify-center">
            <FileArchive className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="mb-2">Nenhuma Nota Fiscal para exibir.</p>
            <p>Utilize os filtros acima ou registre novas transações fiscais.</p>
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    