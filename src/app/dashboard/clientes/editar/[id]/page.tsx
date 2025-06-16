
"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, UserCog, Loader2 } from "lucide-react";
import { getClienteById, updateCliente, Cliente } from "@/lib/mockData/clientes";

const estadosBrasil = [
  { value: "AC", label: "Acre" }, { value: "AL", label: "Alagoas" }, { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" }, { value: "BA", label: "Bahia" }, { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" }, { value: "ES", label: "Espírito Santo" }, { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" }, { value: "MT", label: "Mato Grosso" }, { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" }, { value: "PA", label: "Pará" }, { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" }, { value: "PE", label: "Pernambuco" }, { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" }, { value: "RN", label: "Rio Grande do Norte" }, { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" }, { value: "RR", label: "Roraima" }, { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" }, { value: "SE", label: "Sergipe" }, { value: "TO", label: "Tocantins" },
];

const clienteFormSchema = z.object({
  nomeCompleto: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  cpfCnpj: z.string().min(11, { message: "CPF/CNPJ inválido." }).max(18, { message: "CPF/CNPJ inválido." }),
  telefone: z.string().min(10, { message: "Telefone inválido." }),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal('')),
  cep: z.string().length(8, { message: "CEP deve ter 8 dígitos." }).optional().or(z.literal('')),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  observacoes: z.string().optional(),
});

type ClienteFormValues = z.infer<typeof clienteFormSchema>;

export default function EditarClientePage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const clienteId = params.id as string;

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteFormSchema),
    defaultValues: {
      nomeCompleto: "", cpfCnpj: "", telefone: "", email: "", cep: "",
      logradouro: "", numero: "", complemento: "", bairro: "", cidade: "",
      estado: "", observacoes: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  useEffect(() => {
    if (clienteId) {
      const clienteExistente = getClienteById(clienteId);
      if (clienteExistente) {
        form.reset({
          nomeCompleto: clienteExistente.nomeCompleto,
          cpfCnpj: clienteExistente.cpfCnpj,
          telefone: clienteExistente.telefone,
          email: clienteExistente.email || "",
          cep: clienteExistente.cep || "",
          logradouro: clienteExistente.logradouro || "",
          numero: clienteExistente.numero || "",
          complemento: clienteExistente.complemento || "",
          bairro: clienteExistente.bairro || "",
          cidade: clienteExistente.cidade || "",
          estado: clienteExistente.estado || "",
          observacoes: clienteExistente.observacoes || "",
        });
      } else {
        toast({ variant: "destructive", title: "Cliente não encontrado!" });
        router.push("/dashboard/clientes");
      }
    }
  }, [clienteId, form, router, toast]);

  async function onSubmit(data: ClienteFormValues) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const success = updateCliente(clienteId, data);
      if (success) {
        toast({
          title: "Cliente Atualizado!",
          description: `Os dados de ${data.nomeCompleto} foram atualizados.`,
        });
        router.push("/dashboard/clientes");
      } else {
        toast({ variant: "destructive", title: "Erro ao Atualizar", description: "Cliente não encontrado para atualização." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao Atualizar", description: "Ocorreu um erro. Tente novamente." });
      console.error("Erro ao atualizar cliente:", error);
    }
  }

  if (!clienteId) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <UserCog className="h-7 w-7" /> Editar Cliente
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/clientes">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Clientes
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
          <CardDescription>Modifique os dados do cliente selecionado.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="nomeCompleto" render={({ field }) => (<FormItem><FormLabel>Nome Completo*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="cpfCnpj" render={({ field }) => (<FormItem><FormLabel>CPF/CNPJ*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="telefone" render={({ field }) => (<FormItem><FormLabel>Telefone*</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <h3 className="text-lg font-medium pt-4 border-t mt-4">Endereço (Opcional)</h3>
              <div className="grid md:grid-cols-3 gap-6">
                 <FormField control={form.control} name="cep" render={({ field }) => (<FormItem><FormLabel>CEP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="logradouro" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Logradouro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <FormField control={form.control} name="numero" render={({ field }) => (<FormItem><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="complemento" render={({ field }) => (<FormItem><FormLabel>Complemento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="bairro" render={({ field }) => (<FormItem><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="cidade" render={({ field }) => (<FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="estado" render={({ field }) => (
                    <FormItem><FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione um estado" /></SelectTrigger></FormControl>
                        <SelectContent>{estadosBrasil.map(estado => (<SelectItem key={estado.value} value={estado.value}>{estado.label}</SelectItem>))}</SelectContent>
                      </Select><FormMessage />
                    </FormItem>)}
                />
              </div>
               <FormField control={form.control} name="observacoes" render={({ field }) => (
                  <FormItem><FormLabel>Observações</FormLabel>
                    <FormControl><Textarea className="resize-y min-h-[80px]" {...field} /></FormControl>
                    <FormDescription>Informações adicionais sobre o cliente.</FormDescription><FormMessage />
                  </FormItem>)}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-6 border-t">
              <Button type="button" variant="outline" asChild><Link href="/dashboard/clientes">Cancelar</Link></Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
