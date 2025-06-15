import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarPlus, Car, FileText, Wrench, History } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CustomerDashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">Bem-vindo ao seu Portal, Cliente!</h1>
        <p className="text-lg text-muted-foreground">Aqui você gerencia seus veículos e serviços de forma fácil e rápida.</p>
      </div>

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

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Status do Serviço Atual</CardTitle>
          <CardDescription>Acompanhe o progresso do seu veículo na oficina (se houver algum em serviço).</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Wrench className="h-16 w-16 text-primary mx-auto mb-4" />
          <p className="text-lg font-semibold">Honda Civic (ABC-1234)</p>
          <p className="text-muted-foreground mb-2">Status: <span className="text-accent font-medium">Em Andamento - Alinhamento</span></p>
          <div className="w-full bg-muted rounded-full h-2.5 mb-4">
            <div className="bg-accent h-2.5 rounded-full" style={{ width: "75%" }}></div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/servicos/acompanhamento/ORDEM123">Ver Detalhes da OS</Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">Ou escaneie o QR Code da sua Ordem de Serviço.</p>
        </CardContent>
      </Card>
    </div>
  );
}
