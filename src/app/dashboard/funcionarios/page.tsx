
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Search, Filter as FilterIcon, Edit, Trash2, Eye, UserCog } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect, useMemo } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


interface FuncionarioDetalhado {
  id: string;
  nomeCompleto: string;
  cpf: string;
  cargoId: string; // Corresponde ao 'value' de mockCargosSistemaFiltro
  cargoNome?: string; // Nome do cargo para exibição
  email?: string;
  telefone?: string;
  dataAdmissao?: string; // ISO Date string
}

const mockCargosSistemaFiltro = [
  { value: "todos", label: "Todos os Cargos" },
  { value: "mecanico_chefe", label: "Mecânico Chefe" },
  { value: "mecanico_junior", label: "Mecânico Júnior" },
  { value: "atendente", label: "Atendente" },
  { value: "gerente_oficina", label: "Gerente da Oficina" },
  { value: "auxiliar_servicos", label: "Auxiliar de Serviços Gerais" },
  { value: "orcamentista", label: "Orçamentista" },
];

const mockFuncionariosLista: FuncionarioDetalhado[] = [
  { id: "func001", nomeCompleto: "Ana Beatriz Silva", cpf: "111.222.333-44", cargoId: "atendente", email: "ana.b@mecanica.com", telefone: "(11) 98888-1111", dataAdmissao: "2022-05-10" },
  { id: "func002", nomeCompleto: "Carlos Alberto Pereira", cpf: "222.333.444-55", cargoId: "mecanico_chefe", email: "carlos.p@mecanica.com", telefone: "(11) 98888-2222", dataAdmissao: "2020-01-15" },
  { id: "func003", nomeCompleto: "Pedro Henrique Costa", cpf: "333.444.555-66", cargoId: "mecanico_junior", email: "pedro.h@mecanica.com", telefone: "(11) 98888-3333", dataAdmissao: "2023-08-01" },
  { id: "func004", nomeCompleto: "Sofia Dias Rocha", cpf: "444.555.666-77", cargoId: "gerente_oficina", email: "sofia.d@mecanica.com", telefone: "(11) 98888-4444", dataAdmissao: "2019-03-20" },
  { id: "func005", nomeCompleto: "Marcos Vinicius Lima", cpf: "555.666.777-88", cargoId: "orcamentista", email: "marcos.v@mecanica.com", telefone: "(11) 98888-5555", dataAdmissao: "2021-11-05" },
];

export default function FuncionariosPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [cargoFilter, setCargoFilter] = useState<string>("todos");

  const mappedFuncionarios = useMemo(() => {
    return mockFuncionariosLista.map(func => ({
      ...func,
      cargoNome: mockCargosSistemaFiltro.find(c => c.value === func.cargoId)?.label || func.cargoId,
    }));
  }, []);

  const filteredFuncionarios = useMemo(() => {
    return mappedFuncionarios.filter(func => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm = 
        func.nomeCompleto.toLowerCase().includes(searchTermLower) ||
        func.cpf.includes(searchTermLower) ||
        (func.email && func.email.toLowerCase().includes(searchTermLower));
      
      const matchesCargo = cargoFilter === "todos" || func.cargoId === cargoFilter;

      return matchesSearchTerm && matchesCargo;
    });
  }, [mappedFuncionarios, searchTerm, cargoFilter]);

  const handleAdvancedFilter = () => {
    toast({
      title: "Filtros Avançados (Em Desenvolvimento)",
      description: "Mais opções de filtro serão adicionadas aqui.",
    });
  };
  
  const handleDelete = (id: string, nome: string) => {
    toast({
      title: `Exclusão de ${nome} (Simulada)`,
      description: `O funcionário ${nome} seria excluído aqui.`,
      variant: "destructive"
    });
    // Lógica de exclusão real iria aqui, atualizando o estado.
  };


  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <UserCog className="h-7 w-7"/> Gestão de Funcionários
        </h1>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/funcionarios/novo">
            <UserPlus className="mr-2 h-4 w-4" /> Novo Funcionário
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Filtrar Funcionários</CardTitle>
          <CardDescription>Busque por nome, CPF, email ou filtre por cargo.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="searchFuncionario" className="block text-sm font-medium text-muted-foreground mb-1">
                Buscar por Nome, CPF ou Email
              </label>
              <Input
                id="searchFuncionario"
                type="text"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <label htmlFor="filterCargoFuncionario" className="block text-sm font-medium text-muted-foreground mb-1">
                Cargo
              </label>
              <Select value={cargoFilter} onValueChange={setCargoFilter}>
                <SelectTrigger id="filterCargoFuncionario" className="h-9">
                  <SelectValue placeholder="Todos os Cargos" />
                </SelectTrigger>
                <SelectContent>
                  {mockCargosSistemaFiltro.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
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
          <CardTitle>Equipe</CardTitle>
          <CardDescription>Gerencie os dados dos funcionários e seus acessos.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFuncionarios.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome Completo</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFuncionarios.map(func => (
                  <TableRow key={func.id}>
                    <TableCell className="font-medium">{func.nomeCompleto}</TableCell>
                    <TableCell>{func.cpf}</TableCell>
                    <TableCell>{func.cargoNome}</TableCell>
                    <TableCell>{func.email || "-"}</TableCell>
                    <TableCell>{func.telefone || "-"}</TableCell>
                    <TableCell className="text-right space-x-1">
                       <Button variant="ghost" size="icon" title="Visualizar" onClick={() => toast({title: `Visualizar ${func.nomeCompleto}`})}>
                         <Eye className="h-4 w-4"/>
                       </Button>
                       <Button variant="ghost" size="icon" title="Editar" onClick={() => toast({title: `Editar ${func.nomeCompleto}`})}>
                         <Edit className="h-4 w-4"/>
                       </Button>
                       <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir">
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o funcionário {func.nomeCompleto}? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(func.id, func.nomeCompleto)} className="bg-destructive hover:bg-destructive/90">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <UserCog className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p>Nenhum funcionário encontrado com os filtros atuais.</p>
              {searchTerm === "" && cargoFilter === "todos" && <p className="text-sm">Clique em "Novo Funcionário" para começar.</p>}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">Total de {filteredFuncionarios.length} funcionários listados.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
