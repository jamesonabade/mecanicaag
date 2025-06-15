
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function VeiculosPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Gestão de Veículos</h1>
        <Button asChild>
          <Link href="/dashboard/veiculos/novo">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Veículo
          </Link>
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Lista de Veículos</CardTitle>
          <CardDescription>Gerencie os veículos cadastrados e seus históricos de manutenção.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="mb-2">Funcionalidade de Gestão de Veículos em desenvolvimento.</p>
            <p>Aqui você poderá cadastrar veículos, associá-los a clientes e registrar manutenções.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
