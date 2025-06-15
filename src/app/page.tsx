
"use client";

import Link from "next/link";
import Image from "next/image"; // Import next/image
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import { useRouter } from "next/navigation";

export default function StaffLoginPage() {
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // Placeholder for login logic
    // On successful login, redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center md:justify-start bg-background">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://storage.googleapis.com/fabrica-ai-images/mecanica-agil/mecanicos-login-background.jpg"
          alt="Mecânicos trabalhando em uma oficina com um laptop"
          layout="fill"
          objectFit="cover"
          // className="blur-sm" // Temporariamente removido para diagnóstico
          data-ai-hint="mechanics workshop"
          priority 
        />
        {/* Overlay escuro para melhor contraste */}
        {/* <div className="absolute inset-0 bg-black/30"></div> */} {/* Temporariamente removido para diagnóstico */}
      </div>

      {/* Login Form Card Container - Posicionado à esquerda em telas maiores */}
      <div className="relative z-10 flex w-full max-w-md md:max-w-sm lg:max-w-md items-center justify-center p-4 md:ml-12 lg:ml-20 xl:ml-32">
        <Card className="w-full shadow-2xl bg-card/80 backdrop-blur-sm border-white/20">
          <CardHeader className="space-y-1 text-center pt-8">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-headline">Acesso Restrito</CardTitle>
            <CardDescription>
              Entre com suas credenciais para gerenciar a oficina.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="seu@email.com" 
                  required 
                  className="bg-background/70 focus:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-background/70 focus:bg-background"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-8">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Entrar</Button>
              <Button variant="outline" className="w-full bg-background/70 hover:bg-background/90 border-white/30" asChild>
                <Link href="/portal">Acessar Portal do Cliente</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
