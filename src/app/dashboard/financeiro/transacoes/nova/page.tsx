
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, DollarSign, CalendarIcon, AlignLeft, Tag } from "lucide-react";

const tiposTransacao = [
  { value: "receita", label: "Receita" },
  { value: "despesa", label: "Despesa" },
];

const categoriasMock = [ // Mock data
  { value: "venda_pecas", label: "Venda de Peças" },
  { value: "servicos_gerais", label: "Serviços Gerais" },
  { value: "salarios", label: "Salários" },
  { value: "aluguel", label: "Aluguel" },
  { value: "compras_fornecedores", label: "Compras (Fornecedores)" },
  { value: "outros", label: "Outros" },
];

const transacaoFormSchema = z.object({
  descricao: z.string().min(3, { message: "Descrição deve ter pelo menos 3 caracteres." }),
  valor: z.coerce.number().positive({ message: "Valor deve ser positivo." }),
  tipo: z.enum(["receita", "despesa"], { required_error: "Selecione o tipo de transação." }),
  data: z.date({ required_error: "Data da transação é obrigatória." }),
  categoriaId: z.string().optional(),
  observacoes: z.string().optional(),
});

type TransacaoFormValues = z.infer<typeof transacaoFormSchema>;

export default function NovaTransacaoPage() {
  const { toast } = useToast();
  const form = useForm<TransacaoFormValues>({
    resolver: zodResolver(transacaoFormSchema),
    defaultValues: {
      descricao: "",
      valor: undefined,
      tipo: undefined,
      data: new Date(),
      categoriaId: "",
      observacoes: "",
    },
  });

  async function onSubmit(data: TransacaoFormValues) {
    console.log(data);
    toast({
      title: "Transação Registrada (Simulado)",
      description: `A transação "${data.descricao}" foi salva com sucesso.`,
    });
    // form.reset(); // Opcional
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <DollarSign /> Nova Transação Financeira
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/financeiro">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Financeiro
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detalhes da Transação</CardTitle>
          <CardDescription>Registre uma nova entrada ou saída financeira.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><AlignLeft className="h-4 w-4"/> Descrição*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pagamento fornecedor X, Recebimento serviço Y" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 150.75" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposTransacao.map(tipo => (
                            <SelectItem key={tipo.value} value={tipo.value}>{tipo.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="data"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Data da Transação*</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                ) : (
                                    <span>Escolha uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("2000-01-01") }
                                initialFocus
                                locale={ptBR}
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
              </div>
              
              <FormField
                  control={form.control}
                  name="categoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><Tag className="h-4 w-4"/> Categoria (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriasMock.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Ajuda a organizar suas finanças.</FormDescription>
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
                        placeholder="Detalhes adicionais, número da nota fiscal, etc."
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
                <Link href="/dashboard/financeiro">Cancelar</Link>
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Salvar Transação
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
