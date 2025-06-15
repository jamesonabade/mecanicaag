"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


export default function SolicitarOrcamentoPage() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Placeholder for submission logic
    toast({
      title: "Solicitação Enviada!",
      description: "Seu pedido de orçamento foi enviado com sucesso. Entraremos em contato em breve.",
      variant: "default" 
    });
    // Reset form or redirect
  };


  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><FileText /> Solicitar Orçamento</h1>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Peça seu Orçamento Online</CardTitle>
          <CardDescription>Descreva o serviço que você precisa e nós enviaremos uma estimativa.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="veiculo">Selecione o Veículo</Label>
              <Select>
                <SelectTrigger id="veiculo">
                  <SelectValue placeholder="Escolha um veículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="veiculo1">Honda Civic - ABC-1234</SelectItem>
                  <SelectItem value="veiculo2">Toyota Corolla - XYZ-5678</SelectItem>
                  {/* Add more vehicles dynamically */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="descricaoServico">Descrição do Serviço ou Problema</Label>
              <Textarea id="descricaoServico" placeholder="Ex: Barulho na suspensão dianteira, revisão dos 30.000km, etc." rows={5} required />
            </div>
             <div>
              <Label htmlFor="preferenciaContato">Preferência de Contato</Label>
              <Select defaultValue="whatsapp">
                <SelectTrigger id="preferenciaContato">
                  <SelectValue placeholder="Como prefere ser contatado?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="ligacao">Ligação Telefônica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full md:w-auto">
              <Send className="mr-2 h-4 w-4" /> Enviar Solicitação
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
