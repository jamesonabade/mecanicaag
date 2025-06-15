
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, PlusCircle, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Sample vehicle data
const sampleVehicles = [
  { id: "vec001", make: "Honda", model: "Civic", year: 2020, plate: "ABC-1234", mileage: "45.000 km", nextRevision: "01/12/2024", image: "https://placehold.co/600x400.png", imageHint: "sedan car" },
  { id: "vec002", make: "Toyota", model: "Corolla", year: 2022, plate: "XYZ-5678", mileage: "22.000 km", nextRevision: "15/10/2024", image: "https://placehold.co/600x400.png", imageHint: "family car" },
];

export default function MeusVeiculosPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><Car /> Meus Veículos</h1>
        <Button variant="outline" asChild>
          <Link href="/portal/dashboard/meus-veiculos/novo">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Veículo
          </Link>
        </Button>
      </div>
      
      {sampleVehicles.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {sampleVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <Image src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} data-ai-hint={vehicle.imageHint} width={600} height={300} className="w-full h-48 object-cover"/>
              <CardHeader>
                <CardTitle>{vehicle.make} {vehicle.model} <span className="text-base font-normal text-muted-foreground">({vehicle.year})</span></CardTitle>
                <CardDescription>Placa: {vehicle.plate} | KM: {vehicle.mileage}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-amber-600 bg-amber-100 border border-amber-200 p-3 rounded-md mb-4">
                    <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
                    Próxima revisão recomendada: {vehicle.nextRevision}
                </div>
                <div className="flex gap-2">
                    <Button variant="default" className="flex-1" asChild>
                      <Link href={`/portal/dashboard/historico?veiculo=${vehicle.id}`}>Ver Histórico</Link>
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
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
                <p className="mb-2 text-lg">Você ainda não cadastrou nenhum veículo.</p>
                <p className="text-sm">Clique em "Adicionar Novo Veículo" para começar.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
