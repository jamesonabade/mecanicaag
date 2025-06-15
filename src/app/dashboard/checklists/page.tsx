
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, PlusCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

// Sample checklist data
const sampleChecklists = [
  { id: "chk001", name: "Checklist de Inspeção Veicular Pré-Serviço", items: 15, lastUsed: "2024-07-20" },
  { id: "chk002", name: "Checklist de Entrega de Veículo", items: 8, lastUsed: "2024-07-18" },
  { id: "chk003", name: "Checklist de Troca de Óleo", items: 10, lastUsed: "2024-07-15" },
];


export default function ChecklistsPage() {
  const { toast } = useToast();

  const handleEditClick = (id: string) => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: `A edição do checklist ${id} será implementada em breve.`,
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Checklists Digitais</h1>
        <Button asChild>
          <Link href="/dashboard/checklists/novo">
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Checklist
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Modelos de Checklist</CardTitle>
          <CardDescription>Gerencie e utilize checklists padronizados para os serviços.</CardDescription>
        </CardHeader>
        <CardContent>
          {sampleChecklists.length > 0 ? (
            <div className="space-y-4">
              {sampleChecklists.map((checklist) => (
                <Card key={checklist.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-primary" />
                      {checklist.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/checklists/visualizar/${checklist.id}`}>
                          <FileText className="mr-1 h-3 w-3" /> Visualizar
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(checklist.id)}>Editar</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {checklist.items} itens | Último uso: {checklist.lastUsed}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <p className="mb-2">Nenhum modelo de checklist cadastrado.</p>
              <p>Clique em "Criar Novo Checklist" para começar.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
