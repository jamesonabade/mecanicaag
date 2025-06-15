
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming you might want a select for "Cliente" later
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, Car } from "lucide-react";

const anoAtual = new Date().getFullYear();

const veiculoFormSchema = z.object({
  // Para simplificar, vamos pedir o nome e CPF/CNPJ do proprietário.
  // Em um sistema real, aqui seria um Select buscando da tabela de Clientes.
  nomeProprietario: z.string().min(3, { message: "Nome do proprietário é obrigatório." }),
  documentoProprietario: z.string().min(11, { message: "CPF/CNPJ do proprietário inválido." }),
  placa: z.string().min(7, { message: "Placa deve ter pelo menos 7 caracteres." }).max(8, {message: "Placa inválida."}), // AAA-9999 ou AAA9A99
  marca: z.string().min(2, { message: "Marca é obrigatória." }),
  modelo: z.string().min(2, { message: "Modelo é obrigatório." }),
  anoFabricacao: z.coerce.number()
    .int()
    .min(1900, { message: "Ano de fabricação inválido." })
    .max(anoAtual, { message: `Ano de fabricação não pode ser futuro (máx. ${anoAtual}).` }),
  anoModelo: z.coerce.number()
    .int()
    .min(1900, { message: "Ano do modelo inválido." })
    .max(anoAtual + 1, { message: `Ano do modelo não pode ser muito futuro (máx. ${anoAtual + 1}).` }),
  cor: z.string().min(2, { message: "Cor é obrigatória." }),
  chassi: z.string().length(17, { message: "Chassi deve ter 17 caracteres." }).optional().or(z.literal('')),
  renavam: z.string().min(9, { message: "RENAVAM inválido."}).max(11, { message: "RENAVAM inválido."}).optional().or(z.literal('')),
  quilometragem: z.coerce.number().int().min(0, { message: "Quilometragem não pode ser negativa." }).optional(),
  observacoes: z.string().optional(),
});

type VeiculoFormValues = z.infer<typeof veiculoFormSchema>;

export default function NovoVeiculoPage() {
  const { toast } = useToast();
  const form = useForm<VeiculoFormValues>({
    resolver: zodResolver(veiculoFormSchema),
    defaultValues: {
      nomeProprietario: "",
      documentoProprietario: "",
      placa: "",
      marca: "",
      modelo: "",
      anoFabricacao: undefined,
      anoModelo: undefined,
      cor: "",
      chassi: "",
      renavam: "",
      quilometragem: undefined,
      observacoes: "",
    },
  });

  async function onSubmit(data: VeiculoFormValues) {
    console.log(data);
    toast({
      title: "Veículo Cadastrado (Simulado)",
      description: "O veículo foi salvo com sucesso (simulação).",
    });
    // Aqui você faria a chamada para a API para salvar o veículo
    // form.reset(); // Opcional: resetar o formulário
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><Car /> Novo Veículo</h1>
        <Button variant="outline" asChild>
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
              <h3 className="text-lg font-medium pt-2 border-t">Informações do Proprietário</h3>
               <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nomeProprietario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Proprietário*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: João da Silva (proprietário do veículo)" {...field} />
                      </FormControl>
                       <FormDescription>Este campo é para identificar o dono do veículo, caso não seja o cliente principal.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documentoProprietario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ do Proprietário*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-medium pt-4 border-t mt-4">Dados de Identificação do Veículo</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="placa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placa*</FormLabel>
                      <FormControl>
                        <Input placeholder="AAA-0000 ou AAA0A00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="marca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Volkswagen" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Gol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="anoFabricacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano Fabricação*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="anoModelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano Modelo*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 2021" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="cor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Prata" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="chassi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chassi (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Número do Chassi (17 caracteres)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="renavam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RENAVAM (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Número do RENAVAM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                control={form.control}
                name="quilometragem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quilometragem Atual (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 55000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalhes adicionais sobre o veículo, histórico relevante, etc."
                        className="resize-y min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-6 border-t">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/veiculos">Cancelar</Link>
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Salvar Veículo
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

    