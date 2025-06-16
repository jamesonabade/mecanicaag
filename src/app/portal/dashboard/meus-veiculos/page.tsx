
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, PlusCircle, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getVeiculosByClienteId, Veiculo } // Assumindo que você tem um mock e quer usá-lo aqui
from "@/lib/mockData/veiculos"; 
import { getClienteById, Cliente } from "@/lib/mockData/clientes";

// Simular um ID de cliente logado
const MOCK_LOGGED_CLIENT_ID = "cli_modelo_001"; // Cliente Exemplo Padrão

export default function MeusVeiculosPage() {
  const [vehicles, setVehicles] = useState<Veiculo[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const clienteData = getClienteById(MOCK_LOGGED_CLIENT_ID);
    if (clienteData) {
      setCliente(clienteData);
      setVehicles(getVeiculosByClienteId(clienteData.id));
    }
  }, []);


  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-2">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><Car /> Meus Veículos</h1>
        <Button variant="outline" asChild className="w-full sm:w-auto" disabled={!cliente}>
          <Link href={`/dashboard/veiculos/novo?clienteId=${MOCK_LOGGED_CLIENT_ID}`}> {/* Link para o painel do staff com ID do cliente */}
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Veículo
          </Link>
        </Button>
      </div>
      
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative w-full h-48">
                <Image 
                  src={vehicle.imageUrl || "https://placehold.co/600x400.png"} 
                  alt={`${vehicle.marca} ${vehicle.modelo}`} 
                  data-ai-hint={`${vehicle.marca} ${vehicle.modelo}`} 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle>{vehicle.marca} {vehicle.modelo} <span className="text-base font-normal text-muted-foreground">({vehicle.anoModelo || 'N/A'})</span></CardTitle>
                <CardDescription>Placa: {vehicle.placa} | KM: {vehicle.quilometragem ? `${vehicle.quilometragem.toLocaleString('pt-BR')} km` : 'N/A'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-amber-600 bg-amber-100 border border-amber-200 p-3 rounded-md mb-4">
                    <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
                    Próxima revisão recomendada: (Em breve)
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="default" className="flex-1 w-full sm:w-auto" asChild>
                      <Link href={`/portal/dashboard/historico?veiculo=${vehicle.id}`}>Ver Histórico</Link>
                    </Button>
                    <Button variant="outline" className="flex-1 w-full sm:w-auto" asChild>
                      <Link href={`/portal/dashboard/agendar-servico?veiculo=${vehicle.id}`}>Agendar Serviço</Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-lg">
            <CardContent className="p-8 text-center text-muted-foreground">
                <Car className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="mb-2 text-lg">{cliente ? `Olá ${cliente.nomeCompleto.split(' ')[0]}, você` : 'Você'} ainda não cadastrou nenhum veículo.</p>
                <p className="text-sm">Clique em "Adicionar Novo Veículo" para começar.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
