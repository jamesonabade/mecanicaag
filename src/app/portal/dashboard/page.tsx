
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarPlus, Car, FileText, Wrench, History, Video, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for current service - adjust as needed to show "Iniciado"
const currentServiceStatusMock = {
  id: "ORDEM123",
  vehicle: "Honda Civic (ABC-1234)",
  status: "Em Andamento - Alinhamento",
  progress: 75,
  isServiceStarted: true, // Flag to indicate service has started
};

export default function CustomerDashboardPage() {
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!isCameraModalOpen) {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
        setHasCameraPermission(null); // Reset permission status when modal closes
        return;
      }

      try {
        // This simulates accessing the user's webcam.
        // In a real scenario, videoRef.current.src would be set to the workshop camera stream URL.
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acesso à Câmera Negado',
          description: 'Por favor, habilite as permissões da câmera no seu navegador para esta demonstração.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraModalOpen, toast]);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">Bem-vindo ao seu Portal, Cliente!</h1>
        <p className="text-lg text-muted-foreground">Aqui você gerencia seus veículos e serviços de forma fácil e rápida.</p>
      </div>

      {currentServiceStatusMock && currentServiceStatusMock.isServiceStarted && (
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="font-headline">Status do Serviço Atual</CardTitle>
            <CardDescription>Acompanhe o progresso do seu veículo na oficina.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Wrench className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-lg font-semibold">{currentServiceStatusMock.vehicle}</p>
            <p className="text-muted-foreground mb-1">Status: <span className="text-accent font-medium">{currentServiceStatusMock.status}</span></p>
            
            <div className="my-3 p-3 bg-accent/10 text-accent border border-accent/30 rounded-md">
                <p className="text-sm font-semibold">Seu serviço foi iniciado!</p>
                <p className="text-xs">Acompanhe o processo ao vivo quando disponível.</p>
            </div>

            <div className="w-full bg-muted rounded-full h-2.5 mb-4">
              <div className="bg-accent h-2.5 rounded-full" style={{ width: `${currentServiceStatusMock.progress}%` }}></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" asChild>
                    <Link href={`/servicos/acompanhamento/${currentServiceStatusMock.id}`}>Ver Detalhes da OS</Link>
                </Button>
                <Dialog open={isCameraModalOpen} onOpenChange={setIsCameraModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="secondary">
                            <Video className="mr-2 h-4 w-4" /> Ver Câmera (Demo)
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Câmera da Oficina - Elevador Principal</DialogTitle>
                            <DialogDescription>
                                Acompanhe o serviço do seu veículo em tempo real. (Esta é uma demonstração usando sua webcam)
                            </DialogDescription>
                        </DialogHeader>
                        <div className="my-4">
                            <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                            {hasCameraPermission === false && (
                                <Alert variant="destructive" className="mt-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Acesso à Câmera Negado</AlertTitle>
                                    <AlertDescription>
                                        Não foi possível acessar a câmera. Por favor, verifique as permissões no seu navegador.
                                        Em uma aplicação real, aqui seria exibido o feed da câmera da oficina.
                                    </AlertDescription>
                                </Alert>
                            )}
                            {hasCameraPermission === null && !isCameraModalOpen && ( // Show only if modal is about to open and permission not yet determined
                                <div className="p-4 text-center text-muted-foreground">Solicitando acesso à câmera...</div>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Fechar</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Ou escaneie o QR Code da sua Ordem de Serviço.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><History className="text-primary"/> Histórico de Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/600x400.png" alt="Histórico de Serviços" data-ai-hint="repair history" width={600} height={400} className="rounded-md mb-4 w-full h-auto aspect-video object-cover" />
            <p className="text-sm text-muted-foreground mb-4">Consulte todos os serviços realizados em seus veículos.</p>
            <Button asChild className="w-full"><Link href="/portal/dashboard/historico">Ver Histórico</Link></Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Car className="text-primary"/> Meus Veículos</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/600x400.png" alt="Meus Veículos" data-ai-hint="cars garage" width={600} height={400} className="rounded-md mb-4 w-full h-auto aspect-video object-cover" />
            <p className="text-sm text-muted-foreground mb-4">Veja os detalhes dos seus veículos cadastrados.</p>
            <Button asChild className="w-full"><Link href="/portal/dashboard/meus-veiculos">Gerenciar Veículos</Link></Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarPlus className="text-primary"/> Agendar Novo Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/600x400.png" alt="Agendar Serviço" data-ai-hint="calendar schedule" width={600} height={400} className="rounded-md mb-4 w-full h-auto aspect-video object-cover" />
            <p className="text-sm text-muted-foreground mb-4">Marque sua próxima visita à oficina de forma online.</p>
            <Button asChild className="w-full"><Link href="/portal/dashboard/agendar-servico">Agendar Agora</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
