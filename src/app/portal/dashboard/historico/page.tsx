
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Download } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function HistoricoServicosPage() {
  const { toast } = useToast();

  const handleDownloadClick = () => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: "A opção de baixar o histórico em PDF será implementada em breve.",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><History /> Histórico de Serviços</h1>
        <Button variant="outline" onClick={handleDownloadClick}>
          <Download className="mr-2 h-4 w-4" /> Baixar Histórico (PDF)
        </Button>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Seus Serviços Realizados</CardTitle>
          <CardDescription>Aqui você encontra todos os serviços feitos em seus veículos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="mb-2">Funcionalidade de Histórico de Serviços em desenvolvimento.</p>
            <p>Em breve, você poderá visualizar detalhes de cada serviço, peças trocadas e datas.</p>
            {/* Example of a service item - replace with dynamic data */}
            <div className="mt-6 text-left border p-4 rounded-md">
                <h3 className="font-semibold text-primary">Revisão Completa - Honda Civic (ABC-1234)</h3>
                <p className="text-sm">Data: 20/06/2024</p>
                <p className="text-sm">Valor: R$ 450,00</p>
                <Button variant="link" className="p-0 h-auto mt-1" asChild>
                  <Link href="/servicos/acompanhamento/OS_EXEMPLO_HISTORICO">Ver detalhes da OS</Link>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
