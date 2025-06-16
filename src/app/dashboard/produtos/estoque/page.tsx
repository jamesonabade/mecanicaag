
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, PackageSearch, Filter, Search as SearchIcon, Edit, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface ProdutoEstoque {
  id: string;
  nome: string;
  codigoSku: string;
  categoria: string;
  precoVenda: number;
  precoCusto?: number;
  estoqueAtual: number;
  estoqueMinimo?: number;
  unidadeMedida: string;
  fornecedor?: string;
  localizacao?: string;
}

const mockProdutosEstoque: ProdutoEstoque[] = [
  { id: "prod001", nome: "Óleo Motor 5W30 Sintético (Litro)", codigoSku: "SKU001", categoria: "Óleos e Lubrificantes", precoVenda: 45.00, precoCusto: 28.00, estoqueAtual: 50, estoqueMinimo: 10, unidadeMedida: "LT", fornecedor: "Lubrificantes Brasil Ltda.", localizacao: "Prat. A1" },
  { id: "prod002", nome: "Filtro de Óleo Original Honda Civic", codigoSku: "SKU002", categoria: "Filtros", precoVenda: 35.00, precoCusto: 15.00, estoqueAtual: 30, estoqueMinimo: 5, unidadeMedida: "UN", fornecedor: "Distribuidora de Peças Auto S.A.", localizacao: "Prat. B2"},
  { id: "prod003", nome: "Pastilha de Freio Dianteira XYZ", codigoSku: "SKU003", categoria: "Componentes de Freio", precoVenda: 120.00, precoCusto: 70.00, estoqueAtual: 15, estoqueMinimo: 3, unidadeMedida: "KIT", fornecedor: "Distribuidora de Peças Auto S.A.", localizacao: "Prat. C5" },
  { id: "prod004", nome: "Lâmpada H4 Super Branca (Par)", codigoSku: "SKU004", categoria: "Acessórios", precoVenda: 60.00, precoCusto: 30.00, estoqueAtual: 5, estoqueMinimo: 10, unidadeMedida: "PAR", fornecedor: "Importadora de Faróis Ltda", localizacao: "Gav. D1" }, // Estoque baixo
  { id: "prod005", nome: "Aditivo Radiador Concentrado (Litro)", codigoSku: "SKU005", categoria: "Óleos e Lubrificantes", precoVenda: 25.00, precoCusto: 12.00, estoqueAtual: 40, estoqueMinimo: 5, unidadeMedida: "LT", fornecedor: "Lubrificantes Brasil Ltda.", localizacao: "Prat. A2"},
];

const mockCategoriasFiltro = [
  { value: "Todas", label: "Todas as Categorias" },
  { value: "Óleos e Lubrificantes", label: "Óleos e Lubrificantes" },
  { value: "Filtros", label: "Filtros" },
  { value: "Componentes de Freio", label: "Componentes de Freio" },
  { value: "Acessórios", label: "Acessórios" },
];


export default function ConsultarEstoquePage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("Todas");
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoEstoque[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setProdutos(mockProdutosEstoque);
      setIsLoading(false);
    }, 700); // Simulate 0.7 second delay
    return () => clearTimeout(timer);
  }, []);


  const handleAdvancedFilter = () => {
     toast({
      title: "Filtro Avançado (Em Desenvolvimento)",
      description: "Mais opções de filtro serão adicionadas aqui.",
    });
  }

  const filteredProdutos = useMemo(() => {
    return produtos.filter(produto => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearchTerm =
        produto.nome.toLowerCase().includes(searchTermLower) ||
        produto.codigoSku.toLowerCase().includes(searchTermLower) ||
        (produto.fornecedor && produto.fornecedor.toLowerCase().includes(searchTermLower));

      const matchesCategoria = categoriaFilter === "Todas" || produto.categoria === categoriaFilter;

      const matchesLowStock = !showOnlyLowStock || (produto.estoqueMinimo !== undefined && produto.estoqueAtual <= produto.estoqueMinimo);

      return matchesSearchTerm && matchesCategoria && matchesLowStock;
    });
  }, [produtos, searchTerm, categoriaFilter, showOnlyLowStock]);

  const renderSkeletonTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          {[...Array(7)].map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            {[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}
            <TableCell className="text-center"><Skeleton className="h-8 w-8" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );


  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <PackageSearch className="mr-2 h-7 w-7" /> Consulta de Estoque
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
            <Button asChild className="flex-1 md:flex-initial">
                <Link href="/dashboard/produtos/novo"><PlusCircle className="mr-2 h-4 w-4"/> Cadastrar Produto</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1 md:flex-initial">
            <Link href="/dashboard/produtos">
                <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Produtos
            </Link>
            </Button>
        </div>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Buscar e Filtrar Produtos</CardTitle>
          <CardDescription>Encontre produtos no seu estoque rapidamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="searchProdutoEstoque" className="block text-sm font-medium text-muted-foreground mb-1">
                  Buscar (Nome, SKU, Fornecedor)
                </label>
                <Input
                    id="searchProdutoEstoque"
                    type="text"
                    placeholder="Digite para buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9"
                />
              </div>
              <div>
                <label htmlFor="filterCategoriaEstoque" className="block text-sm font-medium text-muted-foreground mb-1">
                  Categoria
                </label>
                <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                  <SelectTrigger id="filterCategoriaEstoque" className="h-9">
                    <SelectValue placeholder="Todas as Categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategoriasFiltro.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
               <div>
                <label htmlFor="filterEstoqueBaixo" className="block text-sm font-medium text-muted-foreground mb-1">
                  Nível de Estoque
                </label>
                <Select value={showOnlyLowStock ? "baixo" : "todos"} onValueChange={(val) => setShowOnlyLowStock(val === "baixo")}>
                  <SelectTrigger id="filterEstoqueBaixo" className="h-9">
                    <SelectValue placeholder="Todos os Níveis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Níveis</SelectItem>
                    <SelectItem value="baixo">Apenas Estoque Baixo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <Button onClick={() => toast({title: "Filtros Aplicados"})} className="h-9 flex-1 sm:flex-initial">
                <SearchIcon className="mr-2 h-4 w-4" /> Buscar
                </Button>
                <Button type="button" variant="outline" onClick={handleAdvancedFilter} className="h-9 flex-1 sm:flex-initial">
                <Filter className="mr-2 h-4 w-4" /> Filtros Avançados
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Resultados da Consulta</CardTitle>
          <CardDescription>Lista de produtos encontrados no estoque.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? renderSkeletonTable() :
           filteredProdutos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Produto</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Est. Atual</TableHead>
                  <TableHead className="text-right">Est. Mínimo</TableHead>
                  <TableHead className="text-right">Preço Venda (R$)</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.map(produto => (
                  <TableRow key={produto.id} className={produto.estoqueMinimo !== undefined && produto.estoqueAtual <= produto.estoqueMinimo ? "bg-destructive/10 hover:bg-destructive/20" : ""}>
                    <TableCell className="font-medium">{produto.nome}</TableCell>
                    <TableCell>{produto.codigoSku}</TableCell>
                    <TableCell>{produto.categoria}</TableCell>
                    <TableCell className="text-right">{produto.estoqueAtual} {produto.unidadeMedida}</TableCell>
                    <TableCell className="text-right">{produto.estoqueMinimo ?? "-"} {produto.unidadeMedida}</TableCell>
                    <TableCell className="text-right">{produto.precoVenda.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => toast({title: `Editar ${produto.nome}`})} title="Editar Produto">
                        <Edit className="h-4 w-4"/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <PackageSearch className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p>Nenhum produto encontrado com os filtros atuais.</p>
              {searchTerm === "" && categoriaFilter === "Todos" && !showOnlyLowStock && (
                <p className="text-sm">Utilize os campos acima para buscar ou filtrar os produtos.</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Total de {filteredProdutos.length} produto(s) listados.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
