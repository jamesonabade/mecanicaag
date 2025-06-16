
"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ChevronLeft, Save, Car, User, Image as ImageIcon } from "lucide-react";
import { addVeiculo } from "@/lib/mockData/veiculos"; // Veiculo interface is also exported from here
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
  renavam: z.string().min(9, { message: "RENAVAM inválido (mín 9 dígitos)."}).max(11, { message: "RENAVAM inválido (máx 11 dígitos)."}).optional().or(z.literal('')),
  quilometragem: z.coerce.number().int().min(0, { message: "Quilometragem não pode ser negativa." }).optional(),
  imageUrl: z.string().url({ message: "URL da imagem inválido. Ex: https://exemplo.com/imagem.png" }).optional().or(z.literal('')),
  observacoes: z.string().optional(),
});

type VeiculoFormValues = z.infer<typeof veiculoFormSchema>;

export default function VeiculoForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clientes, setClientes] = React.useState<Cliente[]>([]);

  const form = useForm<VeiculoFormValues>({
    resolver: zodResolver(veiculoFormSchema),
    defaultValues: {
      clienteId: "",
      placa: "",
      marca: "",
      modelo: "",
      anoFabricacao: undefined,
      anoModelo: undefined,
      cor: "",
      chassi: "",
      renavam: "",
      quilometragem: undefined,
      imageUrl: "",
      observacoes: "",
    },
  });

  useEffect(() => {
    setClientes(getClientes());
    const queryClienteId = searchParams.get("clienteId");
    if (queryClienteId) {
      form.setValue("clienteId", queryClienteId);
    }
  }, [searchParams, form]);

  async function onSubmit(data: VeiculoFormValues) {
    try {
      addVeiculo(data);
      toast({
        title: "Veículo Cadastrado!",
        description: `O veículo ${data.marca} ${data.modelo} (${data.placa}) foi salvo com sucesso.`,
      });
      router.push("/dashboard/veiculos"); 
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao Cadastrar Veículo",
            description: "Ocorreu um erro. Tente novamente.",
        });
        console.error("Erro ao cadastrar veículo:", error);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-2">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><Car /> Novo Veículo</h1>
        <Button variant="outline" asChild className="w-full md:w-auto">
          <Link href="/dashboard/veiculos">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Veículos
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Dados do Veículo</CardTitle>
          <CardDescription>Preencha as informações para cadastrar um novo veículo.</CardDescription>
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
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o proprietário do veículo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map(cliente => (
                          <SelectItem key={cliente.id} value={cliente.id}>{cliente.nomeCompleto} ({cliente.cpfCnpj})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Selecione o cliente que é o proprietário deste veículo. Se não estiver listado, <Link href="/dashboard/clientes/novo" className="underline">cadastre um novo cliente</Link> primeiro.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-medium pt-4 border-t mt-4">Dados de Identificação do Veículo</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <FormField control={form.control} name="placa" render={({ field }) => (<FormItem><FormLabel>Placa*</FormLabel><FormControl><Input placeholder="AAA-0000 ou AAA0A00" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="marca" render={({ field }) => (<FormItem><FormLabel>Marca*</FormLabel><FormControl><Input placeholder="Ex: Volkswagen" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="modelo" render={({ field }) => (<FormItem><FormLabel>Modelo*</FormLabel><FormControl><Input placeholder="Ex: Gol" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FormField control={form.control} name="anoFabricacao" render={({ field }) => (<FormItem><FormLabel>Ano Fabricação</FormLabel><FormControl><Input type="number" placeholder="Ex: 2020" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="anoModelo" render={({ field }) => (<FormItem><FormLabel>Ano Modelo</FormLabel><FormControl><Input type="number" placeholder="Ex: 2021" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="cor" render={({ field }) => (<FormItem><FormLabel>Cor</FormLabel><FormControl><Input placeholder="Ex: Prata" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="chassi" render={({ field }) => (<FormItem><FormLabel>Chassi (Opcional)</FormLabel><FormControl><Input placeholder="Número do Chassi (17 caracteres)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="renavam" render={({ field }) => (<FormItem><FormLabel>RENAVAM (Opcional)</FormLabel><FormControl><Input placeholder="Número do RENAVAM" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>

              <FormField control={form.control} name="quilometragem" render={({ field }) => (<FormItem><FormLabel>Quilometragem Atual (Opcional)</FormLabel><FormControl><Input type="number" placeholder="Ex: 55000" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel className="flex items-center gap-1"><ImageIcon className="h-4 w-4 text-muted-foreground"/> URL da Imagem (Opcional)</FormLabel><FormControl><Input type="url" placeholder="https://exemplo.com/foto-do-carro.jpg" {...field} /></FormControl><FormDescription>Cole o link de uma imagem do veículo.</FormDescription><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="observacoes" render={({ field }) => (<FormItem><FormLabel>Observações (Opcional)</FormLabel><FormControl><Textarea placeholder="Detalhes adicionais sobre o veículo..." className="resize-y min-h-[80px]" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6 border-t">
              <Button type="button" variant="outline" asChild className="w-full sm:w-auto"><Link href="/dashboard/veiculos">Cancelar</Link></Button>
              <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}><Save className="mr-2 h-4 w-4" /> Salvar Veículo</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
