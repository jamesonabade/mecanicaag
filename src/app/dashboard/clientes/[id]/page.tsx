
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Edit, UserCircle, Phone, Mail, MapPin, FileText, Car, Wrench, PlusCircle } from "lucide-react";
import { getClienteById, Cliente } from "@/lib/mockData/clientes";
import { getVeiculosByClienteId, Veiculo } from "@/lib/mockData/veiculos";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function VisualizarClientePage() {
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id as string;
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [veiculosDoCliente, setVeiculosDoCliente] = useState<Veiculo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clienteId) {
      const dataCliente = getClienteById(clienteId);
      if (dataCliente) {
        setCliente(dataCliente);
        setVeiculosDoCliente(getVeiculosByClienteId(dataCliente.id));
      } else {
        router.push("/dashboard/clientes"); 
      }
      setIsLoading(false);
    }
  }, [clienteId, router]);

  if (isLoading) {
    return <div className="container mx-auto py-10"><p>Carregando dados do cliente...</p></div>;
  }

  if (!cliente) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Cliente não encontrado.</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard/clientes">Voltar para Lista de Clientes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <UserCircle className="h-8 w-8 text-primary" /> {cliente.nomeCompleto}
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" asChild className="flex-1 md:flex-initial">
            <Link href={`/dashboard/clientes/editar/${cliente.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Editar Cliente
            </Link>
          </Button>
          <Button asChild className="flex-1 md:flex-initial">
            <Link href="/dashboard/clientes">
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detalhes do Cliente</CardTitle>
          <CardDescription>Informações cadastrais e histórico.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações de Contato */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
              <Phone className="h-5 w-5" /> Informações de Contato
            </h3>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm p-4 border rounded-lg bg-muted/30">
              <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
              <p><strong>Telefone Principal:</strong> {cliente.telefone}</p>
              <p><strong>Email:</strong> {cliente.email || "Não informado"}</p>
              <p><strong>Data de Cadastro:</strong> {format(new Date(cliente.dataCadastro), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            </div>
          </section>

          <Separator />

          {/* Endereço */}
          {(cliente.cep || cliente.logradouro) && (
            <section>
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Endereço
              </h3>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm p-4 border rounded-lg bg-muted/30">
                <p><strong>CEP:</strong> {cliente.cep || "Não informado"}</p>
                <p><strong>Logradouro:</strong> {cliente.logradouro || "Não informado"}{cliente.numero ? `, ${cliente.numero}` : ""}</p>
                <p><strong>Complemento:</strong> {cliente.complemento || "Não informado"}</p>
                <p><strong>Bairro:</strong> {cliente.bairro || "Não informado"}</p>
                <p><strong>Cidade:</strong> {cliente.cidade || "Não informado"}</p>
                <p><strong>Estado:</strong> {cliente.estado || "Não informado"}</p>
              </div>
            </section>
          )}
          
          <Separator />

          {/* Observações */}
          {cliente.observacoes && (
            <section>
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
                <FileText className="h-5 w-5" /> Observações
              </h3>
              <p className="text-sm p-4 border rounded-lg bg-muted/30 whitespace-pre-wrap">
                {cliente.observacoes}
              </p>
            </section>
          )}

          <Separator />
          
          {/* Veículos do Cliente */}
          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
                <Car className="h-5 w-5"/> Veículos Cadastrados ({veiculosDoCliente.length})
            </h3>
            {veiculosDoCliente.length > 0 ? (
                <div className="space-y-3">
                    {veiculosDoCliente.map(veiculo => (
                        <Card key={veiculo.id} className="bg-card border p-3 hover:shadow-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{veiculo.marca} {veiculo.modelo} - <span className="font-normal text-muted-foreground">{veiculo.placa}</span></p>
                                    <p className="text-xs text-muted-foreground">Cor: {veiculo.cor || 'N/A'} | Ano Fab/Mod: {veiculo.anoFabricacao || 'N/A'}/{veiculo.anoModelo || 'N/A'}</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/dashboard/veiculos/${veiculo.id}`}>Ver Detalhes</Link>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/30">Nenhum veículo cadastrado para este cliente.</p>
            )}
            <Button variant="outline" size="sm" asChild className="mt-3">
                <Link href={`/dashboard/veiculos/novo?clienteId=${cliente.id}`}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Adicionar Veículo para este Cliente
                </Link>
            </Button>
          </section>

          {/* Placeholder para Histórico de Serviços */}
          <Separator />
           <section>
            <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
                <Wrench className="h-5 w-5"/> Histórico de Serviços (Em Breve)
            </h3>
             <div className="p-4 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>O histórico de ordens de serviço e orçamentos deste cliente será exibido aqui.</p>
            </div>
          </section>

        </CardContent>
        <CardFooter className="border-t pt-6">
          <p className="text-xs text-muted-foreground">
            Cliente visualizado em: {format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
