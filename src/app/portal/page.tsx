"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function CustomerPortalLoginPage() {
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // Placeholder for customer login logic
    // On successful login, redirect to customer dashboard
    router.push("/portal/dashboard");
  };

  return (
    <div className="flex flex-grow items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-headline">Portal do Cliente</CardTitle>
          <CardDescription>
            Acesse seu histórico, agende serviços e acompanhe seus veículos.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpfCnpj">CPF ou Placa do Veículo</Label>
              <Input id="cpfCnpj" type="text" placeholder="Seu CPF ou Placa" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="portalPassword">Senha (ou Código de Acesso)</Label>
              <Input id="portalPassword" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Entrar no Portal</Button>
            <p className="text-xs text-muted-foreground text-center">
              Não tem acesso? Entre em contato com a oficina.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
