
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
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, PackagePlus, FileArchive, CalendarIcon as CalendarLucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";


// Mock data - substituir no futuro
const mockCategorias = [
  { value: "pecas_motor", label: "Peças de Motor" },
  { value: "filtros", label: "Filtros" },
  { value: "oleos_lubrificantes", label: "Óleos e Lubrificantes" },
  { value: "freios", label: "Componentes de Freio" },
  { value: "suspensao_direcao", label: "Suspensão e Direção" },
  { value: "acessorios", label: "Acessórios" },
  { value: "pneus", label: "Pneus" },
  { value: "ferramentas", label: "Ferramentas (Consumo Interno)" },
  { value: "outros", label: "Outros" },
];

const mockFornecedores = [
  { value: "forn001", label: "Distribuidora de Peças Auto S.A." },
  { value: "forn002", label: "Lubrificantes Brasil Ltda." },
  { value: "forn003", label: "Importadora de Ferramentas XYZ" },
];

const unidadesMedida = [
    { value: "un", label: "Unidade (UN)" },
    { value: "pc", label: "Peça (PÇ)" },
    { value: "lt", label: "Litro (LT)" },
    { value: "kg", label: "Quilograma (KG)" },
    { value: "mt", label: "Metro (MT)" },
    { value: "kit", label: "Kit (KIT)" },
];

const produtoFormSchema = z.object({
  nome: z.string().min(3, { message: "Nome do produto deve ter pelo menos 3 caracteres." }),
  codigoSku: z.string().optional().or(z.literal('')), 
  descricao: z.string().optional(),
  categoriaId: z.string({ required_error: "Selecione uma categoria." }),
  fornecedorId: z.string().optional(),
  unidadeMedida: z.string({ required_error: "Selecione a unidade de medida." }),
  precoCusto: z.coerce.number().min(0, { message: "Preço de custo não pode ser negativo." }).optional(),
  precoVenda: z.coerce.number().min(0, { message: "Preço de venda não pode ser negativo." }),
  estoqueAtual: z.coerce.number().int().min(0, { message: "Estoque não pode ser negativo." }).default(0),
  estoqueMinimo: z.coerce.number().int().min(0, { message: "Estoque mínimo não pode ser negativo." }).optional(),
  localizacao: z.string().optional(), 
  observacoes: z.string().optional(),
  // NF-e de Compra
  nfeCompraChave: z.string().length(44, {message: "Chave de acesso deve ter 44 dígitos."}).optional().or(z.literal('')),
  nfeCompraDataEmissao: z.date().optional(),
  nfeCompraValorTotal: z.coerce.number().min(0, {message: "Valor da NF-e de compra deve ser positivo."}).optional(),
});

type ProdutoFormValues = z.infer<typeof produtoFormSchema>;

export default function NovoProdutoPage() {
  const { toast } = useToast();
  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoFormSchema),
    defaultValues: {
      nome: "",
      codigoSku: "",
      descricao: "",
      categoriaId: "",
      fornecedorId: "",
      unidadeMedida: "un",
      precoCusto: undefined,
      precoVenda: undefined,
      estoqueAtual: 0,
      estoqueMinimo: undefined,
      localizacao: "",
      observacoes: "",
      nfeCompraChave: "",
      nfeCompraDataEmissao: undefined,
      nfeCompraValorTotal: undefined,
    },
  });

  async function onSubmit(data: ProdutoFormValues) {
    console.log(data);
    toast({
      title: "Produto Cadastrado (Simulado)",
      description: `O produto "${data.nome}" foi salvo com sucesso (simulação).`,
    });
    // form.reset(); 
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <PackagePlus /> Novo Produto
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/produtos">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Lista de Produtos
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
          <CardDescription>Preencha os dados para cadastrar um novo item no catálogo.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Filtro de Óleo Motor XYZ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="codigoSku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código/SKU (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: F001-XYZ" {...field} />
                      </FormControl>
                      <FormDescription>Identificador único do produto.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoriaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockCategorias.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
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
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detalhes adicionais, aplicação, marca específica, etc." {...field} rows={3}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fornecedorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um fornecedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockFornecedores.map(forn => (
                            <SelectItem key={forn.value} value={forn.value}>{forn.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unidadeMedida"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade de Medida*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a unidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {unidadesMedida.map(un => (
                            <SelectItem key={un.value} value={un.value}>{un.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />
              <h3 className="text-lg font-medium">Valores e Estoque</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <FormField
                  control={form.control}
                  name="precoCusto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Custo (R$) (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 25.50" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="precoVenda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Venda (R$)*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 49.90" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estoqueAtual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Atual*</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 10" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estoqueMinimo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Mínimo (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 5" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                <FormField
                  control={form.control}
                  name="localizacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização no Estoque (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Prateleira A-01, Corredor 3, Gaveta X" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-4" />
                <h3 className="text-lg font-medium flex items-center gap-2"><FileArchive className="h-5 w-5 text-muted-foreground"/> Dados da Nota Fiscal de Compra (Entrada - Opcional)</h3>
                <FormField
                  control={form.control}
                  name="nfeCompraChave"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave de Acesso da NF-e de Compra (44 dígitos)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 00000000000000000000000000000000000000000000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="nfeCompraDataEmissao"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Data de Emissão da NF-e de Compra</FormLabel>
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
                                    <CalendarLucideIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
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
                      name="nfeCompraValorTotal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor Total da NF-e de Compra (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Ex: 1250.99" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>


                <Separator className="my-4" />
               <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações Gerais do Produto (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informações adicionais sobre o produto, notas de compra, etc."
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
                <Link href="/dashboard/produtos">Cancelar</Link>
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" /> Salvar Produto
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}


    