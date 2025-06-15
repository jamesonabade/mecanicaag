
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  Filter,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getClientes, deleteCliente, Cliente } from "@/lib/mockData/clientes"; // Import from centralized mock
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function ClientesPage() {
  const { toast } = useToast();
  const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setListaClientes(getClientes());
    setIsLoading(false);
  }, []);

  const handleDeleteCliente = (clienteId: string) => {
    const success = deleteCliente(clienteId);
    if (success) {
      setListaClientes(getClientes()); // Atualiza a lista
      toast({
        title: "Cliente Excluído",
        description: "O cliente foi removido com sucesso.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao Excluir",
        description: "Não foi possível encontrar o cliente para exclusão.",
      });
    }
  };

  const filteredClientes = useMemo(() => {
    if (!searchTerm) return listaClientes;
    return listaClientes.filter(
      (cliente) =>
        cliente.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpfCnpj.includes(searchTerm) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cliente.telefone && cliente.telefone.includes(searchTerm))
    );
  }, [listaClientes, searchTerm]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <p>Carregando clientes...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Users className="h-7 w-7" /> Gestão de Clientes
        </h1>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/clientes/novo">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Cliente
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Filtrar e Buscar Clientes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow">
            <label
              htmlFor="searchCliente"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Buscar por Nome, CPF/CNPJ, Email ou Telefone
            </label>
            <Input
              id="searchCliente"
              type="text"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>
          <Button onClick={() => toast({title: "Filtro em Desenvolvimento"})} variant="outline" className="w-full sm:w-auto h-9">
            <Filter className="mr-2 h-4 w-4" /> Filtros Avançados
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Clientes Cadastrados</CardTitle>
          <CardDescription>
            Gerencie os clientes da sua oficina.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredClientes.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Data Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/clientes/${cliente.id}`} className="hover:underline text-primary">
                            {cliente.nomeCompleto}
                        </Link>
                      </TableCell>
                      <TableCell>{cliente.cpfCnpj}</TableCell>
                      <TableCell>{cliente.telefone}</TableCell>
                      <TableCell>{cliente.email || "-"}</TableCell>
                      <TableCell>
                        {format(new Date(cliente.dataCadastro), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Visualizar Cliente"
                        >
                          <Link href={`/dashboard/clientes/${cliente.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Editar Cliente"
                        >
                          <Link href={`/dashboard/clientes/editar/${cliente.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              title="Excluir Cliente"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar Exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cliente{" "}
                                <span className="font-semibold">{cliente.nomeCompleto}</span>? Esta
                                ação não pode ser desfeita e removerá todos os dados associados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCliente(cliente.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Excluir Permanentemente
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p>
                {searchTerm ? "Nenhum cliente encontrado com os termos da busca." : "Nenhum cliente cadastrado ainda."}
              </p>
              {!searchTerm && (
                <p className="text-sm">
                  Clique em "Novo Cliente" para começar.
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Total de {filteredClientes.length} cliente(s) listados.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
