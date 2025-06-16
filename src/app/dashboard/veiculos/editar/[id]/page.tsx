
"use client";

import React, { useEffect, useState } from "react";
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
import { ChevronLeft, Save, Car, User, Image as ImageIcon, Edit3, Loader2 } from "lucide-react";
import { getVeiculoById, updateVeiculo, Veiculo } from "@/lib/mockData/veiculos";
import { getClientes, Cliente } from "@/lib/mockData/clientes";

const anoAtual = new Date().getFullYear();

const veiculoFormSchema = z.object({
  clienteId: z.string({ required_error: "Selecione o proprietário (cliente)." }),
  placa: z.string().min(7, { message: "Placa deve ter pelo menos 7 caracteres." }).max(8, {message: "Placa inválida."}),
  marca: z.string().min(2, { message: "Marca é obrigatória." }),
  modelo: z.string().min(2, { message: "Modelo é obrigatório." }),
  anoFabricacao: z.coerce.number()
    .int()
    .min(1900, { message: "Ano de fabricação inválido." })
    .max(anoAtual, { message: `Ano de fabricação não pode ser futuro (máx. ${anoAtual}).` })
    .optional(),
  anoModelo: z.coerce.number()
    .int()
    .min(1900, { message: "Ano do modelo inválido." })
    .max(anoAtual + 1, { message: `Ano do modelo não pode ser muito futuro (máx. ${anoAtual + 1}).` })
    .optional(),
  cor: z.string().min(2, { message: "Cor é obrigatória." }).optional(),
  chassi: z.string().length(17, { message: "Chassi deve ter 17 caracteres." }).optional().or(z.literal('')),
  renavam: z.string().min(9).max(11).optional().or(z.literal('')),
  quilometragem: z.coerce.number().int().min(0).optional(),
  imageUrl: z.string().url({ message: "URL da imagem inválido." }).optional().or(z.literal('')),
  observacoes: z.string().optional(),
});

type VeiculoFormValues = z.infer<typeof veiculoFormSchema>;

export default function EditarVeiculoPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const veiculoId = params.id as string;
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const form = useForm<VeiculoFormValues>({
    resolver: zodResolver(veiculoFormSchema),
    defaultValues: {
      clienteId: "", placa: "", marca: "", modelo: "", cor: "",
      anoFabricacao: undefined, anoModelo: undefined, chassi: "", renavam: "",
      quilometragem: undefined, imageUrl: "", observacoes: "",
    },
  });

  const { formState: { isSubmitting } } = form;

  useEffect(() => {
    setClientes(getClientes());
    if (veiculoId) {
      const veiculoExistente = getVeiculoById(veiculoId);
      if (veiculoExistente) {
        form.reset({
          clienteId: veiculoExistente.clienteId,
          placa: veiculoExistente.placa,
          marca: veiculoExistente.marca,
          modelo: veiculoExistente.modelo,
          anoFabricacao: veiculoExistente.anoFabricacao,
          anoModelo: veiculoExistente.anoModelo,
          cor: veiculoExistente.cor,
          chassi: veiculoExistente.chassi,
          renavam: veiculoExistente.renavam,
          quilometragem: veiculoExistente.quilometragem,
          imageUrl: veiculoExistente.imageUrl,
          observacoes: veiculoExistente.observacoes,
        });
      } else {
        toast({ variant: "destructive", title: "Veículo não encontrado!" });
        router.push("/dashboard/veiculos");
      }
    }
  }, [veiculoId, form, router, toast]);

  async function onSubmit(data: VeiculoFormValues) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      const success = updateVeiculo(veiculoId, data);
      if (success) {
        toast({
          title: "Veículo Atualizado!",
          description: `Os dados de ${data.marca} ${data.modelo} (${data.placa}) foram atualizados.`,
        });
        router.push("/dashboard/veiculos");
      } else {
        toast({ variant: "destructive", title: "Erro ao Atualizar", description: "Veículo não encontrado para atualização." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao Atualizar", description: "Ocorreu um erro. Tente novamente." });
      console.error("Erro ao atualizar veículo:", error);
    }
  }

  if (!veiculoId) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <Edit3 className="h-7 w-7" /> Editar Veículo
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/veiculos">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Veículos
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Informações do Veículo</CardTitle>
          <CardDescription>Modifique os dados do veículo selecionado.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
            <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><User className="h-4 w-4"/> Proprietário (Cliente)*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Selecione o proprietário" /></SelectTrigger></FormControl>
                      <SelectContent>{clientes.map(c => (<SelectItem key={c.id} value={c.id}>{c.nomeCompleto} ({c.cpfCnpj})</SelectItem>))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h3 className="text-lg font-medium pt-4 border-t mt-4">Dados de Identificação do Veículo</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <FormField control={form.control} name="placa" render={({ field }) => (<FormItem><FormLabel>Placa*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="marca" render={({ field }) => (<FormItem><FormLabel>Marca*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="modelo" render={({ field }) => (<FormItem><FormLabel>Modelo*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <FormField control={form.control} name="anoFabricacao" render={({ field }) => (<FormItem><FormLabel>Ano Fabricação</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="anoModelo" render={({ field }) => (<FormItem><FormLabel>Ano Modelo</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="cor" render={({ field }) => (<FormItem><FormLabel>Cor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="chassi" render={({ field }) => (<FormItem><FormLabel>Chassi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="renavam" render={({ field }) => (<FormItem><FormLabel>RENAVAM</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name="quilometragem" render={({ field }) => (<FormItem><FormLabel>Quilometragem</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><ImageIcon className="h-4 w-4 text-muted-foreground"/> URL da Imagem</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="observacoes" render={({ field }) => (<FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea className="resize-y min-h-[80px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-6 border-t">
              <Button type="button" variant="outline" asChild><Link href="/dashboard/veiculos">Cancelar</Link></Button>
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
