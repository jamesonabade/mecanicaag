
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import Link from "next/link";

export default function FuncionariosPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Gestão de Funcionários</h1>
        <Button asChild>
          <Link href="/dashboard/funcionarios/novo">
            <UserPlus className="mr-2 h-4 w-4" /> Novo Funcionário
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Equipe</CardTitle>
          <CardDescription>Gerencie os dados dos funcionários e seus acessos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="mb-2">Funcionalidade de Gestão de Funcionários em desenvolvimento.</p>
            <p>Aqui você poderá cadastrar funcionários, definir cargos e controlar permissões de acesso.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
