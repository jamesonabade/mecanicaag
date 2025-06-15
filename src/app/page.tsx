"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/shared/Logo";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router

export default function StaffLoginPage() {
  const router = useRouter();

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    // Placeholder for login logic
    // On successful login, redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
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
              <Input id="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Entrar</Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/portal">Acessar Portal do Cliente</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
