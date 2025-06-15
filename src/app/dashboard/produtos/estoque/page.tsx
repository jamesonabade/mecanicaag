
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PackageSearch, Filter } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function ConsultarEstoquePage() {
  const { toast } = useToast();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Busca em Desenvolvimento",
      description: "A funcionalidade de busca detalhada de estoque será implementada em breve.",
    });
  };
  
  const handleFilter = () => {
     toast({
      title: "Filtro em Desenvolvimento",
      description: "A funcionalidade de filtro de estoque será implementada em breve.",
    });
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <PackageSearch className="mr-2 h-7 w-7" /> Consulta de Estoque
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/produtos">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Produtos
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Buscar e Filtrar Produtos</CardTitle>
          <CardDescription>Encontre produtos no seu estoque rapidamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-grow">
              <label htmlFor="searchProduto" className="block text-sm font-medium text-muted-foreground mb-1">
                Buscar por Nome, Código ou Categoria
              </label>
              <Input id="searchProduto" type="text" placeholder="Digite para buscar..." />
            </div>
            <Button type="submit">
              <PackageSearch className="mr-2 h-4 w-4" /> Buscar
            </Button>
            <Button type="button" variant="outline" onClick={handleFilter}>
              <Filter className="mr-2 h-4 w-4" /> Filtrar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Resultados da Consulta</CardTitle>
          <CardDescription>Lista de produtos encontrados no estoque.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="mb-2">Nenhum produto para exibir ou busca não realizada.</p>
            <p>Utilize os campos acima para buscar ou filtrar os produtos em estoque.</p>
          </div>
          {/* Futuramente, aqui será exibida uma tabela ou lista de produtos */}
        </CardContent>
      </Card>
    </div>
  );
}
