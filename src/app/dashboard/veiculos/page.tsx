
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
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Car,
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
import { getVeiculos, deleteVeiculo, Veiculo } from "@/lib/mockData/veiculos";
import { getClienteById, Cliente } from "@/lib/mockData/clientes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function VeiculosPage() {
  const { toast } = useToast();
  const [listaVeiculos, setListaVeiculos] = useState<Veiculo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setListaVeiculos(getVeiculos());
    setIsLoading(false);
  }, []);

  const handleDeleteVeiculo = (veiculoId: string) => {
    const success = deleteVeiculo(veiculoId);
    if (success) {
      setListaVeiculos(getVeiculos());
      toast({
        title: "Veículo Excluído",
        description: "O veículo foi removido com sucesso.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao Excluir",
        description: "Não foi possível encontrar o veículo para exclusão.",
      });
    }
  };

  const getNomeProprietario = (clienteId: string): string => {
    const cliente = getClienteById(clienteId);
    return cliente ? cliente.nomeCompleto : "Proprietário Desconhecido";
  };

  const filteredVeiculos = useMemo(() => {
    if (!searchTerm) return listaVeiculos;
    return listaVeiculos.filter(
      (veiculo) =>
        veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getNomeProprietario(veiculo.clienteId).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (veiculo.chassi && veiculo.chassi.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [listaVeiculos, searchTerm]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <p>Carregando veículos...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Car className="h-7 w-7" /> Gestão de Veículos
        </h1>
        <Button asChild className="w-full md:w-auto">
          <Link href="/dashboard/veiculos/novo">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Veículo
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Filtrar e Buscar Veículos</CardTitle>
          <CardDescription>Utilize os campos abaixo para refinar sua busca na lista de veículos.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow">
            <label
              htmlFor="searchVeiculo"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Buscar por Placa, Marca, Modelo, Proprietário ou Chassi
            </label>
            <Input
              id="searchVeiculo"
              type="text"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>
           <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            <Button onClick={() => toast({title: "Filtros Aplicados"})} className="h-9 flex-1 sm:flex-initial">
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
            <Button onClick={() => toast({title: "Filtro Avançado em Desenvolvimento"})} variant="outline" className="h-9 flex-1 sm:flex-initial">
              <Filter className="mr-2 h-4 w-4" /> Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Veículos Cadastrados</CardTitle>
          <CardDescription>
            Gerencie os veículos da sua oficina.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVeiculos.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Marca/Modelo</TableHead>
                    <TableHead>Proprietário</TableHead>
                    <TableHead>Ano Fab/Mod</TableHead>
                    <TableHead>Cor</TableHead>
                    <TableHead>Data Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVeiculos.map((veiculo) => (
                    <TableRow key={veiculo.id}>
                      <TableCell className="font-medium">
                         <Link href={`/dashboard/veiculos/${veiculo.id}`} className="hover:underline text-primary">
                            {veiculo.placa}
                        </Link>
                      </TableCell>
                      <TableCell>{veiculo.marca} {veiculo.modelo}</TableCell>
                      <TableCell>{getNomeProprietario(veiculo.clienteId)}</TableCell>
                      <TableCell>{veiculo.anoFabricacao || 'N/A'} / {veiculo.anoModelo || 'N/A'}</TableCell>
                      <TableCell>{veiculo.cor || "-"}</TableCell>
                      <TableCell>
                        {format(new Date(veiculo.dataCadastro), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Visualizar Veículo"
                        >
                          <Link href={`/dashboard/veiculos/${veiculo.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Editar Veículo"
                        >
                          <Link href={`/dashboard/veiculos/editar/${veiculo.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              title="Excluir Veículo"
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
                                Tem certeza que deseja excluir o veículo{" "}
                                <span className="font-semibold">{veiculo.marca} {veiculo.modelo} ({veiculo.placa})</span>? Esta
                                ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteVeiculo(veiculo.id)}
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
              <Car className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p>
                {searchTerm ? "Nenhum veículo encontrado com os termos da busca." : "Nenhum veículo cadastrado ainda."}
              </p>
              {!searchTerm && (
                <p className="text-sm">
                  Clique em "Novo Veículo" para começar.
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Total de {filteredVeiculos.length} veículo(s) listados.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
