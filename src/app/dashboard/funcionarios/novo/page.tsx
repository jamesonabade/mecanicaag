
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, UserPlus, CalendarIcon } from "lucide-react";

const mockCargos = [
  { value: "mecanico_chefe", label: "Mecânico Chefe" },
  { value: "mecanico_junior", label: "Mecânico Júnior" },
  { value: "atendente", label: "Atendente" },
  { value: "gerente_oficina", label: "Gerente da Oficina" },
  { value: "auxiliar_servicos", label: "Auxiliar de Serviços Gerais" },
];

const niveisAcesso = [
    { value: "admin", label: "Administrador" },
    { value: "operacional", label: "Operacional" },
    { value: "consulta", label: "Apenas Consulta" },
];

const funcionarioFormSchema = z.object({
  nomeCompleto: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido. Formato esperado: 000.000.000-00" }),
  cargoId: z.string({ required_error: "Selecione um cargo." }),
  dataAdmissao: z.date().optional(),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal('')),
  telefone: z.string().min(10, { message: "Telefone inválido (mínimo 10 dígitos)." }).optional().or(z.literal('')),
  salario: z.coerce.number().min(0, { message: "Salário não pode ser negativo." }).optional(),
  nivelAcesso: z.string().optional(),
  observacoes: z.string().optional(),
});

type FuncionarioFormValues = z.infer<typeof funcionarioFormSchema>;

export default function NovoFuncionarioPage() {
  const { toast } = useToast();
  const form = useForm<FuncionarioFormValues>({
    resolver: zodResolver(funcionarioFormSchema),
    defaultValues: {
      nomeCompleto: "",
      cpf: "",
      cargoId: "",
      dataAdmissao: undefined,
      email: "",
      telefone: "",
      salario: undefined,
      nivelAcesso: "operacional",
      observacoes: "",
    },
  });

  async function onSubmit(data: FuncionarioFormValues) {
    console.log(data);
    toast({
      title: "Funcionário Cadastrado (Simulado)",
      description: `O funcionário "${data.nomeCompleto}" foi salvo com sucesso (simulação).`,
    });
    // form.reset(); // Opcional
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <UserPlus /> Novo Funcionário
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/funcionarios">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Funcionários
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Informações do Funcionário</CardTitle>
          <CardDescription>Preencha os dados para cadastrar um novo membro na equipe.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="nomeCompleto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Carlos Alberto Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF*</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cargoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o cargo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCargos.map(cargo => (
                            <SelectItem key={cargo.value} value={cargo.value}>{cargo.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="carlos.silva@empresa.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(00) 90000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="dataAdmissao"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Data de Admissão (Opcional)</FormLabel>
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
                                disabled={(date) =>
                                date > new Date() || date < new Date("1980-01-01")
                                }
                                initialFocus
                                locale={ptBR}
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                 <FormField
                  control={form.control}
                  name="salario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salário (R$) (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 2500.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nivelAcesso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Acesso (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível de acesso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {niveisAcesso.map(nivel => (
                            <SelectItem key={nivel.value} value={nivel.value}>{nivel.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
               <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Informações adicionais sobre o funcionário."
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
                <Link href="/dashboard/funcionarios">Cancelar</Link>
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Salvar Funcionário
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
