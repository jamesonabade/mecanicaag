
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, PackageSearch } from "lucide-react";
import Link from "next/link";

export default function ProdutosPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Gestão de Produtos e Estoque</h1>
        <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard/produtos/novo">
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Produto
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/produtos/estoque">
                <PackageSearch className="mr-2 h-4 w-4" /> Consultar Estoque
              </Link>
            </Button>
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Catálogo de Produtos</CardTitle>
          <CardDescription>Gerencie peças, óleos, acessórios e controle o estoque.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="mb-2">Funcionalidade de Gestão de Produtos e Estoque em desenvolvimento.</p>
            <p>Aqui você poderá cadastrar produtos, controlar entradas/saídas e gerenciar fornecedores.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
