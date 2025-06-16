
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, PlusCircle, FileText, Edit, Search, Filter as FilterIcon } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useMemo } from "react";

// Sample checklist data
type AplicavelParaType = "entrada_veiculo" | "saida_veiculo" | "servico_especifico" | "geral" | "Todos";

const sampleChecklistsData = [
  { id: "chk001", name: "Checklist de Inspeção Veicular Pré-Serviço", items: 15, lastUsed: "2024-07-20", aplicavelPara: "entrada_veiculo" as AplicavelParaType },
  { id: "chk002", name: "Checklist de Entrega de Veículo", items: 8, lastUsed: "2024-07-18", aplicavelPara: "saida_veiculo" as AplicavelParaType },
  { id: "chk003", name: "Checklist de Troca de Óleo", items: 10, lastUsed: "2024-07-15", aplicavelPara: "servico_especifico" as AplicavelParaType },
  { id: "chk004", name: "Checklist Geral de Verificação", items: 20, lastUsed: "2024-07-10", aplicavelPara: "geral" as AplicavelParaType },
];

const aplicavelParaOptions: { value: AplicavelParaType; label: string }[] = [
  { value: "Todos", label: "Todas as Aplicabilidades" },
  { value: "entrada_veiculo", label: "Inspeção de Entrada" },
  { value: "saida_veiculo", label: "Inspeção de Saída" },
  { value: "servico_especifico", label: "Serviço Específico" },
  { value: "geral", label: "Geral / Outro" },
];


export default function ChecklistsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [aplicavelParaFilter, setAplicavelParaFilter] = useState<AplicavelParaType>("Todos");

  const handleEditClick = (id: string) => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: `A edição do checklist ${id} será implementada em breve.`,
    });
  };

  const handleAdvancedFilter = () => {
    toast({
      title: "Filtros Avançados (Em Desenvolvimento)",
      description: "Mais opções de filtro serão adicionadas aqui.",
    });
  };

  const filteredChecklists = useMemo(() => {
    return sampleChecklistsData.filter(checklist => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = checklist.name.toLowerCase().includes(searchTermLower);
      const matchesAplicavelPara = aplicavelParaFilter === "Todos" || checklist.aplicavelPara === aplicavelParaFilter;
      return matchesSearchTerm && matchesAplicavelPara;
    });
  }, [searchTerm, aplicavelParaFilter]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">Checklists Digitais</h1>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/checklists/novo">
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Checklist
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Filtrar Modelos de Checklist</CardTitle>
          <CardDescription>Busque por nome ou filtre por aplicabilidade.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="searchChecklist" className="block text-sm font-medium text-muted-foreground mb-1">
                Buscar por Nome
              </label>
              <Input
                id="searchChecklist"
                type="text"
                placeholder="Digite o nome do checklist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <label htmlFor="filterAplicavelPara" className="block text-sm font-medium text-muted-foreground mb-1">
                Aplicável Para
              </label>
              <Select value={aplicavelParaFilter} onValueChange={(value) => setAplicavelParaFilter(value as AplicavelParaType)}>
                <SelectTrigger id="filterAplicavelPara" className="h-9">
                  <SelectValue placeholder="Todas as Aplicabilidades" />
                </SelectTrigger>
                <SelectContent>
                  {aplicavelParaOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
           <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            <Button onClick={() => toast({title: "Filtros Aplicados"})} className="h-9 flex-1 sm:flex-initial">
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
            <Button variant="outline" onClick={handleAdvancedFilter} className="h-9 flex-1 sm:flex-initial">
              <FilterIcon className="mr-2 h-4 w-4" /> Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Modelos de Checklist</CardTitle>
          <CardDescription>Gerencie e utilize checklists padronizados para os serviços.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredChecklists.length > 0 ? (
            <div className="space-y-4">
              {filteredChecklists.map((checklist) => (
                <Card key={checklist.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      {checklist.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/checklists/visualizar/${checklist.id}`}>
                          <FileText className="mr-1 h-3 w-3" /> Visualizar
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(checklist.id)}>
                        <Edit className="mr-1 h-3 w-3" /> Editar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {checklist.items} itens | Aplicável para: {aplicavelParaOptions.find(o => o.value === checklist.aplicavelPara)?.label || 'N/A'} | Último uso: {new Date(checklist.lastUsed).toLocaleDateString('pt-BR', {year: 'numeric', month: '2-digit', day: '2-digit'})}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <CheckSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="mb-2">Nenhum modelo de checklist encontrado com os filtros atuais.</p>
               {searchTerm === "" && aplicavelParaFilter === "Todos" && <p>Clique em "Criar Novo Checklist" para começar.</p>}
            </div>
          )}
        </CardContent>
         <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Total de {filteredChecklists.length} checklists listados.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
