import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileText, Wrench, UserCircle, Car } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

// Mock data for demonstration
const mockServiceOrder = {
  id: "OS2024-789",
  vehicle: "Fiat Strada - Placa: BRA2E19",
  customer: "João Silva",
  serviceRequested: "Revisão completa + Troca de pastilhas de freio",
  status: "Em Andamento",
  currentStep: "Alinhamento e Balanceamento",
  estimatedCompletion: "Hoje, 17:00",
  mechanic: "Carlos Alberto",
  checklistLink: "/checklists/preview/CHK001", // Example
  photos: [
    { url: "https://placehold.co/300x200.png", caption: "Veículo na rampa", dataAiHint: "car service" },
    { url: "https://placehold.co/300x200.png", caption: "Peças substituídas", dataAiHint: "car parts" },
  ],
  timeline: [
    { status: "Recebido", time: "08:15", icon: Car, completed: true },
    { status: "Inspeção Inicial", time: "08:45", icon: FileText, completed: true },
    { status: "Aguardando Aprovação do Orçamento", time: "09:30", icon: Clock, completed: true },
    { status: "Serviço Iniciado", time: "10:15", icon: Wrench, completed: true },
    { status: "Alinhamento e Balanceamento", time: "14:30", icon: Wrench, completed: false, current: true },
    { status: "Lavagem Cortesia", time: "16:00", icon: Car, completed: false },
    { status: "Pronto para Retirada", time: "17:00", icon: CheckCircle, completed: false },
  ]
};

interface ServiceTimelineItemProps {
    status: string;
    time: string;
    icon: React.ElementType;
    completed: boolean;
    current?: boolean;
    isLast?: boolean;
}

const ServiceTimelineItem: React.FC<ServiceTimelineItemProps> = ({ status, time, icon: Icon, completed, current, isLast }) => {
    return (
        <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${completed ? (current ? 'bg-accent border-accent' : 'bg-primary border-primary') : 'bg-muted border-muted-foreground/50'} ${current ? 'ring-4 ring-accent/30' : ''}`}>
                    <Icon className={`w-5 h-5 ${completed ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                {!isLast && <div className={`w-0.5 grow ${completed ? 'bg-primary' : 'bg-muted-foreground/30'}`} style={{minHeight: '2.5rem'}}></div>}
            </div>
            <div>
                <p className={`font-semibold ${current ? 'text-accent' : (completed ? 'text-primary' : 'text-foreground')}`}>{status}</p>
                <p className="text-sm text-muted-foreground">{time}</p>
            </div>
        </div>
    );
};


export default function ServiceTrackingPage({ params }: { params: { id: string } }) {
  const serviceOrder = { ...mockServiceOrder, id: params.id }; // Use the ID from params

  if (!serviceOrder) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <FileText className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Ordem de Serviço Não Encontrada</h1>
        <p className="text-muted-foreground mb-6">
          Verifique o código ou QR Code e tente novamente.
        </p>
        <Button asChild>
          <Link href="/portal">Voltar ao Portal do Cliente</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-headline">Acompanhamento de Serviço</CardTitle>
                <CardDescription className="text-primary-foreground/80">Ordem de Serviço: {serviceOrder.id}</CardDescription>
              </div>
              <Wrench className="h-12 w-12 text-primary-foreground/70" />
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Detalhes do Veículo</h3>
                <p><span className="font-medium text-muted-foreground">Veículo:</span> {serviceOrder.vehicle}</p>
                <p><span className="font-medium text-muted-foreground">Cliente:</span> {serviceOrder.customer}</p>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Informações do Serviço</h3>
                <p><span className="font-medium text-muted-foreground">Serviço Solicitado:</span> {serviceOrder.serviceRequested}</p>
                <p><span className="font-medium text-muted-foreground">Mecânico Responsável:</span> {serviceOrder.mechanic}</p>
              </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Progresso do Serviço</h3>
                <div className="relative pl-2">
                    {serviceOrder.timeline.map((item, index) => (
                        <ServiceTimelineItem 
                            key={index}
                            {...item}
                            isLast={index === serviceOrder.timeline.length - 1}
                        />
                    ))}
                </div>
            </div>
            
            <Separator />

            <div className="text-center p-4 bg-accent/10 rounded-lg">
              <p className="text-lg font-semibold text-accent">{serviceOrder.status}: <span className="font-normal">{serviceOrder.currentStep}</span></p>
              <p className="text-sm text-muted-foreground">Previsão de Conclusão: {serviceOrder.estimatedCompletion}</p>
            </div>

            {serviceOrder.photos && serviceOrder.photos.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Fotos do Serviço</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {serviceOrder.photos.map((photo, index) => (
                    <div key={index} className="rounded-lg overflow-hidden shadow-md">
                      <Image src={photo.url} alt={photo.caption} width={300} height={200} className="w-full h-auto object-cover aspect-[3/2]" data-ai-hint={photo.dataAiHint} />
                      <p className="text-xs p-2 bg-card text-center text-muted-foreground">{photo.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Separator />

            <div className="text-center mt-6">
              <Button asChild size="lg">
                <Link href="/portal">Voltar ao Portal do Cliente</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-3">
                Para dúvidas, entre em contato com a oficina.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
