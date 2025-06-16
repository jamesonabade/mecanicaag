
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Edit, Car, UserCircle, FileText, CalendarIcon, Gauge, Palette, Ticket, Wrench } from "lucide-react";
import { getVeiculoById, Veiculo } from "@/lib/mockData/veiculos";
import { getClienteById, Cliente } from "@/lib/mockData/clientes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function VisualizarVeiculoPage() {
  const router = useRouter();
  const params = useParams();
  const veiculoId = params.id as string;
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
  const [proprietario, setProprietario] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (veiculoId) {
      const dataVeiculo = getVeiculoById(veiculoId);
      if (dataVeiculo) {
        setVeiculo(dataVeiculo);
        if (dataVeiculo.clienteId) {
          const dataProprietario = getClienteById(dataVeiculo.clienteId);
          setProprietario(dataProprietario || null);
        }
      } else {
        router.push("/dashboard/veiculos"); // Redireciona se não encontrar
      }
      setIsLoading(false);
    }
  }, [veiculoId, router]);

  if (isLoading) {
    return <div className="container mx-auto py-10"><p>Carregando dados do veículo...</p></div>;
  }

  if (!veiculo) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">Veículo não encontrado.</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/dashboard/veiculos">Voltar para Lista de Veículos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Car className="h-8 w-8 text-primary" /> {veiculo.marca} {veiculo.modelo} ({veiculo.placa})
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" asChild className="flex-1 md:flex-initial">
            <Link href={`/dashboard/veiculos/editar/${veiculo.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Editar Veículo
            </Link>
          </Button>
          <Button asChild className="flex-1 md:flex-initial">
            <Link href="/dashboard/veiculos">
              <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detalhes do Veículo</CardTitle>
          <CardDescription>Informações cadastrais e histórico do veículo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {veiculo.imageUrl && (
            <div className="mb-6 rounded-lg overflow-hidden shadow-md max-w-md mx-auto">
              <Image src={veiculo.imageUrl} alt={`Foto de ${veiculo.marca} ${veiculo.modelo}`} width={600} height={400} className="w-full h-auto object-cover" data-ai-hint={`${veiculo.marca} ${veiculo.modelo}`} />
            </div>
          )}
          
          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
              <UserCircle className="h-5 w-5" /> Proprietário
            </h3>
            {proprietario ? (
              <div className="p-4 border rounded-lg bg-muted/30">
                <p className="text-lg font-medium">{proprietario.nomeCompleto}</p>
                <p className="text-sm text-muted-foreground">CPF/CNPJ: {proprietario.cpfCnpj}</p>
                <p className="text-sm text-muted-foreground">Telefone: {proprietario.telefone}</p>
                <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                  <Link href={`/dashboard/clientes/${proprietario.id}`}>Ver Detalhes do Cliente</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground p-4 border rounded-lg bg-muted/30">Proprietário não encontrado ou não associado.</p>
            )}
          </section>

          <Separator />

          <section>
            <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
              <Car className="h-5 w-5" /> Dados do Veículo
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm p-4 border rounded-lg bg-muted/30">
              <p><strong>Placa:</strong> {veiculo.placa}</p>
              <p><strong>Marca:</strong> {veiculo.marca}</p>
              <p><strong>Modelo:</strong> {veiculo.modelo}</p>
              <p><CalendarIcon className="inline h-4 w-4 mr-1 text-muted-foreground"/> <strong>Ano Fab/Mod:</strong> {veiculo.anoFabricacao || "N/A"} / {veiculo.anoModelo || "N/A"}</p>
              <p><Palette className="inline h-4 w-4 mr-1 text-muted-foreground"/> <strong>Cor:</strong> {veiculo.cor || "N/A"}</p>
              <p><Ticket className="inline h-4 w-4 mr-1 text-muted-foreground"/> <strong>Chassi:</strong> {veiculo.chassi || "Não informado"}</p>
              <p><FileText className="inline h-4 w-4 mr-1 text-muted-foreground"/> <strong>RENAVAM:</strong> {veiculo.renavam || "Não informado"}</p>
              <p><Gauge className="inline h-4 w-4 mr-1 text-muted-foreground"/> <strong>Quilometragem:</strong> {veiculo.quilometragem ? `${veiculo.quilometragem.toLocaleString('pt-BR')} km` : "Não informada"}</p>
              <p className="md:col-span-full"><strong>Data de Cadastro:</strong> {format(new Date(veiculo.dataCadastro), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            </div>
          </section>
          
          {veiculo.observacoes && (
            <>
              <Separator />
              <section>
                <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Observações
                </h3>
                <p className="text-sm p-4 border rounded-lg bg-muted/30 whitespace-pre-wrap">
                  {veiculo.observacoes}
                </p>
              </section>
            </>
          )}

          {/* Placeholder para Histórico de Serviços do Veículo */}
          <Separator />
           <section>
            <h3 className="text-xl font-semibold mb-3 text-primary flex items-center gap-2">
                <Wrench className="h-5 w-5"/> Histórico de Serviços (Em Breve)
            </h3>
             <div className="p-4 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <p>O histórico de ordens de serviço e orçamentos para este veículo será exibido aqui.</p>
            </div>
          </section>

        </CardContent>
        <CardFooter className="border-t pt-6">
          <p className="text-xs text-muted-foreground">
            Veículo visualizado em: {format(new Date(), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
