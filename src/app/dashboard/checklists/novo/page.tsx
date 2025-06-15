
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Save, PlusCircle, Trash2, GripVertical } from "lucide-react";

const itemChecklistSchema = z.object({
  id: z.string().optional(), // Para itens existentes, se houver edição futura
  texto: z.string().min(3, { message: "Item deve ter pelo menos 3 caracteres." }),
  tipoResposta: z.enum(["texto_curto", "texto_longo", "sim_nao", "multipla_escolha", "unica_escolha", "upload_foto"]),
  opcoesResposta: z.string().optional(), // Para multipla_escolha e unica_escolha, separadas por vírgula
  obrigatorio: z.boolean().default(false),
});

const checklistFormSchema = z.object({
  nomeChecklist: z.string().min(5, { message: "Nome do checklist deve ter pelo menos 5 caracteres." }),
  descricao: z.string().optional(),
  aplicavelPara: z.enum(["entrada_veiculo", "saida_veiculo", "servico_especifico", "geral"]),
  itens: z.array(itemChecklistSchema).min(1, { message: "Adicione pelo menos um item ao checklist." }),
});

type ChecklistFormValues = z.infer<typeof checklistFormSchema>;

const tiposResposta = [
    { value: "texto_curto", label: "Texto Curto" },
    { value: "texto_longo", label: "Texto Longo" },
    { value: "sim_nao", label: "Sim/Não" },
    { value: "multipla_escolha", label: "Múltipla Escolha (Checkbox)" },
    { value: "unica_escolha", label: "Única Escolha (Radio)" },
    { value: "upload_foto", label: "Upload de Foto" },
];

export default function NovoChecklistPage() {
  const { toast } = useToast();
  const form = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistFormSchema),
    defaultValues: {
      nomeChecklist: "",
      descricao: "",
      aplicavelPara: "entrada_veiculo",
      itens: [{ texto: "", tipoResposta: "sim_nao", obrigatorio: true }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  async function onSubmit(data: ChecklistFormValues) {
    console.log(data);
    toast({
      title: "Checklist Criado (Simulado)",
      description: `O checklist "${data.nomeChecklist}" foi salvo com sucesso (simulação).`,
    });
    // form.reset(); // Opcional
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-2">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <PlusCircle className="h-7 w-7"/> Novo Modelo de Checklist
        </h1>
        <Button variant="outline" asChild className="w-full md:w-auto">
          <Link href="/dashboard/checklists">
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar para Checklists
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>Informações Gerais do Checklist</CardTitle>
              <CardDescription>Defina o nome, descrição e aplicabilidade deste modelo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="nomeChecklist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Checklist*</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Checklist de Inspeção de Entrada" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Detalhes sobre a finalidade deste checklist." {...field} rows={2}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="aplicavelPara"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aplicável Para*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a aplicabilidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entrada_veiculo">Inspeção de Entrada de Veículo</SelectItem>
                          <SelectItem value="saida_veiculo">Inspeção de Saída/Entrega de Veículo</SelectItem>
                          <SelectItem value="servico_especifico">Serviço Específico (Ex: Troca de óleo)</SelectItem>
                          <SelectItem value="geral">Geral / Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Itens do Checklist</CardTitle>
              <CardDescription>Adicione, remova e ordene os itens que farão parte deste checklist.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((item, index) => (
                <Card key={item.id} className="p-4 space-y-4 relative bg-muted/30">
                   <div className="flex items-center justify-between">
                     <FormLabel className="font-semibold">Item {index + 1}</FormLabel>
                     <div className="flex items-center gap-2">
                        {fields.length > 1 && (
                            <>
                            <Button type="button" variant="ghost" size="icon" className="cursor-move h-7 w-7" title="Mover item"
                                onMouseDown={(e) => { /* Implementar drag and drop aqui se necessário, por enquanto apenas visual */
                                    const onMouseMove = (moveEvent: MouseEvent) => { /* ... */ };
                                    const onMouseUp = () => {
                                        document.removeEventListener('mousemove', onMouseMove);
                                        document.removeEventListener('mouseup', onMouseUp);
                                    };
                                    document.addEventListener('mousemove', onMouseMove);
                                    document.addEventListener('mouseup', onMouseUp);
                                }}
                            >
                                <GripVertical className="h-4 w-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive h-7 w-7">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </>
                        )}
                     </div>
                   </div>
                  <FormField
                    control={form.control}
                    name={`itens.${index}.texto`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Texto do Item*</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Verificar nível do óleo do motor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name={`itens.${index}.tipoResposta`}
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tipo de Resposta*</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {tiposResposta.map(tipo => (
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
                        name={`itens.${index}.opcoesResposta`}
                        render={({ field }) => (
                        <FormItem className={form.watch(`itens.${index}.tipoResposta`) === "multipla_escolha" || form.watch(`itens.${index}.tipoResposta`) === "unica_escolha" ? "block" : "hidden"}>
                            <FormLabel>Opções (separadas por vírgula)</FormLabel>
                            <FormControl>
                            <Input placeholder="Ex: Bom, Ruim, Regular" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`itens.${index}.obrigatorio`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3 shadow-sm bg-card">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Resposta obrigatória?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => append({ texto: "", tipoResposta: "sim_nao", obrigatorio: true })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Item ao Checklist
              </Button>
              <FormMessage>{form.formState.errors.itens?.message || form.formState.errors.itens?.root?.message}</FormMessage>
            </CardContent>
             <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6 border-t">
              <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/dashboard/checklists">Cancelar</Link>
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Salvar Modelo de Checklist
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
