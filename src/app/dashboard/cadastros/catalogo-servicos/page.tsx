
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Ensure Label is imported
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListOrdered, PlusCircle, Edit, Trash2, Search, Filter as FilterIcon, ChevronLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { getServicosCatalogo, addServicoCatalogo, updateServicoCatalogo, deleteServicoCatalogo, ServicoCatalogo } from "@/lib/mockData/catalogoServicos";
// Import mock checklist models - adjust path if necessary
import { mockChecklistModelsData as getMockChecklistModels } from "@/app/dashboard/servicos/[id]/page";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Ensure Form and related components are imported
import { Skeleton } from "@/components/ui/skeleton";

const servicoCatalogoFormSchema = z.object({
  nome: z.string().min(5, { message: "Nome do serviço deve ter pelo menos 5 caracteres." }),
  descricao: z.string().optional(),
  valorPadrao: z.coerce.number().min(0, { message: "Valor padrão deve ser positivo ou zero." }),
  categoria: z.string().optional(),
  tempoEstimadoHoras: z.coerce.number().min(0).optional(),
  itensInclusos: z.string().optional(), // Temporarily string, will parse to array
  checklistAssociadoId: z.string().optional(),
});

type ServicoCatalogoFormValues = z.infer<typeof servicoCatalogoFormSchema>;

const mockCategoriasServico = ["Revisões", "Mecânica Geral", "Diagnóstico", "Suspensão e Direção", "Ar Condicionado", "Elétrica", "Funilaria", "Outros"];
const NO_CHECKLIST_VALUE = "__NO_CHECKLIST__"; // Unique value for "Nenhum"

export default function CatalogoServicosPage() {
  const { toast } = useToast();
  const [servicos, setServicos] = useState<ServicoCatalogo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<ServicoCatalogo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("Todas");
  const [isLoading, setIsLoading] = useState(true);

  const checklistModels = useMemo(() => getMockChecklistModels, []);

  const form = useForm<ServicoCatalogoFormValues>({
    resolver: zodResolver(servicoCatalogoFormSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      valorPadrao: 0,
      categoria: "",
      tempoEstimadoHoras: undefined,
      itensInclusos: "",
      checklistAssociadoId: "", // Keep as empty string for form state
    },
  });
  const { formState: { isSubmitting: isDialogSubmitting } } = form;


  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setServicos(getServicosCatalogo());
      setIsLoading(false);
    }, 700); // Simulate 0.7 second delay
    return () => clearTimeout(timer);
  }, []);

  const filteredServicos = useMemo(() => {
    return servicos.filter(servico => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = servico.nome.toLowerCase().includes(searchTermLower) ||
                            (servico.descricao && servico.descricao.toLowerCase().includes(searchTermLower));
      const matchesCategoria = categoriaFilter === "Todas" || servico.categoria === categoriaFilter;
      return matchesSearch && matchesCategoria;
    });
  }, [servicos, searchTerm, categoriaFilter]);

  const handleOpenForm = (servico?: ServicoCatalogo) => {
    if (servico) {
      setEditingServico(servico);
      form.reset({
        nome: servico.nome,
        descricao: servico.descricao || "",
        valorPadrao: servico.valorPadrao,
        categoria: servico.categoria || "",
        tempoEstimadoHoras: servico.tempoEstimadoHoras,
        itensInclusos: servico.itensInclusos?.join(", ") || "",
        checklistAssociadoId: servico.checklistAssociadoId || "",
      });
    } else {
      setEditingServico(null);
      form.reset(); // Resets to defaultValues, including checklistAssociadoId: ""
    }
    setIsFormOpen(true);
  };

  const onSubmit = async (data: ServicoCatalogoFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    const servicoDataPayload = {
      ...data,
      itensInclusos: data.itensInclusos ? data.itensInclusos.split(',').map(item => item.trim()).filter(item => item) : [],
      checklistAssociadoId: data.checklistAssociadoId === NO_CHECKLIST_VALUE ? "" : data.checklistAssociadoId, // Ensure empty string if "Nenhum"
    };

    if (editingServico) {
      updateServicoCatalogo(editingServico.id, servicoDataPayload);
      toast({ title: "Serviço Atualizado!", description: `"${data.nome}" foi atualizado no catálogo.` });
    } else {
      addServicoCatalogo(servicoDataPayload);
      toast({ title: "Serviço Adicionado!", description: `"${data.nome}" foi adicionado ao catálogo.` });
    }
    setServicos(getServicosCatalogo());
    setIsFormOpen(false);
    setEditingServico(null);
    form.reset();
  };

  const handleDeleteServico = (servicoId: string) => {
    deleteServicoCatalogo(servicoId);
    setServicos(getServicosCatalogo());
    toast({ title: "Serviço Excluído!", description: "O serviço foi removido do catálogo." });
  };

  const renderSkeletonTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Skeleton className="h-5 w-32" /></TableHead>
          <TableHead><Skeleton className="h-5 w-24" /></TableHead>
          <TableHead className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
          <TableHead className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableHead>
          <TableHead className="text-center"><Skeleton className="h-5 w-20 mx-auto" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(3)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell className="flex justify-center gap-1">
              <Skeleton className="h-8 w-8" /> <Skeleton className="h-8 w-8" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <ListOrdered className="h-7 w-7"/> Catálogo de Serviços
        </h1>
         <Button variant="outline" asChild className="w-full md:w-auto">
          <Link href="/dashboard">
             <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para o Painel
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle>Filtrar e Buscar Serviços</CardTitle>
          <CardDescription>Encontre serviços no catálogo ou adicione novos.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="searchServicoCatalogo">Buscar (Nome, Descrição)</Label>
              <Input
                id="searchServicoCatalogo"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="filterCategoriaServico">Categoria</Label>
              <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                <SelectTrigger id="filterCategoriaServico" className="h-9">
                  <SelectValue placeholder="Todas as Categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas as Categorias</SelectItem>
                  {mockCategoriasServico.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => toast({title: "Filtros Aplicados"})} className="h-9 w-full sm:w-auto mt-4 sm:mt-0">
            <Search className="mr-2 h-4 w-4" /> Buscar
          </Button>
        </CardContent>
        <CardFooter>
             <Button onClick={() => handleOpenForm()} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Serviço ao Catálogo
            </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Serviços Cadastrados</CardTitle>
          <CardDescription>Gerencie os serviços oferecidos pela oficina.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? renderSkeletonTable() :
           filteredServicos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Serviço</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor Padrão (R$)</TableHead>
                  <TableHead className="text-right">Tempo Est. (h)</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServicos.map((servico) => (
                  <TableRow key={servico.id}>
                    <TableCell className="font-medium">{servico.nome}</TableCell>
                    <TableCell>{servico.categoria || "-"}</TableCell>
                    <TableCell className="text-right">{servico.valorPadrao.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{servico.tempoEstimadoHoras ?? "-"}</TableCell>
                    <TableCell className="text-center space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(servico)} title="Editar Serviço">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir Serviço">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o serviço "{servico.nome}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteServico(servico.id)} className="bg-destructive hover:bg-destructive/90">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              <ListOrdered className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p>Nenhum serviço encontrado com os filtros atuais.</p>
              {searchTerm === "" && categoriaFilter === "Todas" && (
                 <p className="text-sm">Clique em "Adicionar Novo Serviço ao Catálogo" para começar.</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">Total de {filteredServicos.length} serviços listados.</p>
        </CardFooter>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingServico ? "Editar Serviço" : "Adicionar Novo Serviço ao Catálogo"}</DialogTitle>
            <DialogDescription>
              {editingServico ? "Modifique os detalhes do serviço." : "Preencha os dados do novo serviço."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto pr-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField control={form.control} name="nome" render={({ field }) => (
                    <FormItem><FormLabel>Nome do Serviço*</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="descricao" render={({ field }) => (
                    <FormItem><FormLabel>Descrição Detalhada (Opcional)</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                )}/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="categoria" render={({ field }) => (
                        <FormItem>
                        <FormLabel>Categoria (Opcional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione ou digite" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {mockCategoriasServico.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="valorPadrao" render={({ field }) => (
                        <FormItem><FormLabel>Valor Padrão (R$)*</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                 <FormField control={form.control} name="tempoEstimadoHoras" render={({ field }) => (
                    <FormItem><FormLabel>Tempo Estimado (Horas) (Opcional)</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="itensInclusos" render={({ field }) => (
                    <FormItem><FormLabel>Itens/Etapas Inclusas (Opcional, separado por vírgula)</FormLabel><FormControl><Textarea placeholder="Ex: Troca de óleo, Filtro de ar, Verificação de níveis" {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField
                  control={form.control}
                  name="checklistAssociadoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Checklist Associado (Opcional)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === NO_CHECKLIST_VALUE ? "" : value)}
                        value={field.value === "" ? NO_CHECKLIST_VALUE : field.value || NO_CHECKLIST_VALUE}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhum checklist específico" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={NO_CHECKLIST_VALUE}>Nenhum</SelectItem>
                          {checklistModels.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Checklist a ser preenchido ao realizar este serviço.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DialogFooter className="mt-auto pt-4 border-t">
            <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isDialogSubmitting}>
              {isDialogSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Salvar Serviço
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
