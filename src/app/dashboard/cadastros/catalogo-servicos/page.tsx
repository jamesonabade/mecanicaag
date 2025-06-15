
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListOrdered, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function CatalogoServicosPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <ListOrdered className="h-7 w-7"/> Catálogo de Serviços Pré-Cadastrados
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
             Voltar para o Painel
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Gerenciar Serviços Padronizados</CardTitle>
          <CardDescription>
            Cadastre e gerencie os serviços oferecidos pela oficina, definindo nomes, descrições,
            valores padrão e checklists obrigatórios/recomendados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="mb-2 text-lg font-semibold">Em Desenvolvimento</p>
            <p>A funcionalidade para gerenciar o catálogo de serviços (criar, editar, excluir) será implementada aqui.</p>
            <Button className="mt-4" asChild>
                <Link href="#"> {/* Futuramente, link para "Novo Serviço no Catálogo" */}
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Serviço ao Catálogo (Em breve)
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
