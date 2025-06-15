
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default function NovaEntradaVeiculoPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <LogIn className="h-7 w-7"/> Nova Entrada de Veículo
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
             Voltar para o Painel
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Fluxo de Entrada de Veículo</CardTitle>
          <CardDescription>
            Esta seção guiará o usuário pelo processo de check-in do veículo, cadastro de cliente/veículo (se novo),
            registro da solicitação, checklist de entrada, criação de orçamento e, se aprovado, conversão em Ordem de Serviço.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="mb-2 text-lg font-semibold">Em Desenvolvimento</p>
            <p>A funcionalidade completa para o fluxo de entrada de veículos está sendo construída.</p>
            <p className="mt-4">
                Próximos passos incluirão:
            </p>
            <ul className="list-disc text-left inline-block mt-2 text-sm">
                <li>Busca e cadastro de clientes.</li>
                <li>Busca e cadastro de veículos.</li>
                <li>Registro da solicitação do cliente.</li>
                <li>Execução de checklist de entrada.</li>
                <li>Criação de orçamento.</li>
                <li>Conversão de orçamento em OS.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
