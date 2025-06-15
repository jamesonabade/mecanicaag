
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
    Settings, 
    MessageSquare, 
    Save, 
    Users, 
    UserCheck, 
    HeartHandshake, 
    Repeat, 
    Gift, 
    CheckCheck, 
    CheckCircle, 
    Clock, 
    Wrench, 
    FileText, 
    Filter as FilterIcon, 
    Car, 
    Edit3, 
    PackageSearch,
    Building,
    CalendarCheck,
    FileArchive, 
    Info, 
    AlertTriangle, 
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Tipos de Alertas para Clientes
const alertasClienteTipos = [
  { id: "confirmacaoAgendamento", label: "Confirmação de Agendamento", icon: CheckCircle },
  { id: "lembreteAgendamento24h", label: "Lembrete de Agendamento (24h antes)", icon: Clock },
  { id: "lembreteAgendamento1h", label: "Lembrete de Agendamento (1h antes)", icon: Clock },
  { id: "servicoIniciado", label: "Serviço Iniciado", icon: Wrench },
  { id: "servicoFinalizado", label: "Serviço Finalizado / Pronto para Retirada", icon: CheckCheck },
  { id: "orcamentoPronto", label: "Orçamento Pronto para Aprovação", icon: FileText },
  { id: "pesquisaSatisfacao", label: "Pesquisa de Satisfação pós-serviço", icon: MessageSquare },
  { id: "lembreteRevisaoPeriodica", label: "Lembrete de Revisão Periódica (ex: 6 meses)", icon: Repeat },
  { id: "lembreteRevisaoPosServico", label: "Lembrete de Revisão Pós-OS (Dias)", icon: CalendarCheck, hasDaysInput: true },
  { id: "lembreteTrocaOleo", label: "Lembrete de Troca de Óleo (KM/Tempo)", icon: FilterIcon },
  { id: "ofertaAniversario", label: "Oferta Especial de Aniversário do Cliente", icon: Gift },
  { id: "checkupPosServico", label: "Check-up Pós-Serviço (ex: 1 semana depois)", icon: HeartHandshake },
];

// Tipos de Alertas para Funcionários
const alertasFuncionarioTipos = [
  { id: "novoAgendamentoAtribuido", label: "Novo Agendamento Atribuído ao Mecânico", icon: UserCheck },
  { id: "veiculoChegouOficina", label: "Veículo do Agendamento Chegou (para mecânico)", icon: Car },
  { id: "alteracaoOsAtribuida", label: "Alteração em OS Atribuída ao Mecânico", icon: Edit3 },
  { id: "pecaFaltanteServico", label: "Peça Faltante para Serviço em Andamento", icon: PackageSearch },
];

const regimesTributarios = [
    { value: "simples_nacional", label: "Simples Nacional" },
    { value: "lucro_presumido", label: "Lucro Presumido" },
    { value: "lucro_real", label: "Lucro Real" },
];

const ambientesNFe = [
    { value: "producao", label: "Produção (Valor Fiscal)" },
    { value: "homologacao", label: "Homologação (Testes)" },
];

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");

  const [alertasCliente, setAlertasCliente] = useState<Record<string, boolean>>(
    alertasClienteTipos.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {})
  );
  const [alertasFuncionario, setAlertasFuncionario] = useState<Record<string, boolean>>(
    alertasFuncionarioTipos.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {})
  );
  
  const [diasParaLembretes, setDiasParaLembretes] = useState<Record<string, number>>(
    alertasClienteTipos.reduce((acc, curr) => {
      if (curr.id === "lembreteRevisaoPosServico") {
        return { ...acc, [curr.id]: 180 }; 
      }
      return acc;
    }, {})
  );


  const handleAlertChange = (
    type: "cliente" | "funcionario",
    id: string,
    checked: boolean
  ) => {
    if (type === "cliente") {
      setAlertasCliente((prev) => ({ ...prev, [id]: checked }));
    } else {
      setAlertasFuncionario((prev) => ({ ...prev, [id]: checked }));
    }
  };

  const handleDiasLembreteChange = (id: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setDiasParaLembretes(prev => ({ ...prev, [id]: numValue }));
    } else if (value === "") {
      setDiasParaLembretes(prev => ({ ...prev, [id]: 0 }));
    }
  };


  const handleSaveAlertSettings = () => {
    console.log("Configurações de Alertas Salvas (Simulado):", { apiKey, alertasCliente, alertasFuncionario, diasParaLembretes });
    toast({
      title: "Configurações Salvas (Simulado)",
      description: "Suas preferências de alerta foram salvas.",
    });
  };
  
  const handleSaveGeneralSettings = () => {
    toast({
      title: "Configurações Gerais Salvas (Simulado)",
      description: "As configurações gerais da oficina foram atualizadas.",
    });
  };

  const handleSaveNFeSettings = () => {
    toast({
      title: "Configurações de NF-e Salvas (Simulado)",
      description: "As configurações de Nota Fiscal foram atualizadas.",
    });
  };


  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-2">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Settings className="h-7 w-7" /> Configurações do Sistema
        </h1>
      </div>

      <Accordion type="multiple" defaultValue={[]} className="w-full space-y-4">
        <AccordionItem value="general-settings">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-0 hover:no-underline">
                <CardHeader className="flex-row justify-between items-center w-full pr-4">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5 text-primary"/> Configurações Gerais da Oficina</CardTitle>
                        <CardDescription>Informações básicas da sua oficina e preferências globais.</CardDescription>
                    </div>
                </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                      <div>
                          <Label htmlFor="nomeOficina">Nome da Oficina</Label>
                          <Input id="nomeOficina" defaultValue="Mecânica Ágil LTDA" />
                      </div>
                      <div>
                          <Label htmlFor="cnpjOficina">CNPJ</Label>
                          <Input id="cnpjOficina" defaultValue="00.000.000/0001-00" />
                      </div>
                  </div>
                  <div>
                      <Label htmlFor="enderecoOficina">Endereço Completo</Label>
                      <Input id="enderecoOficina" defaultValue="Rua das Palmeiras, 123, Bairro Flores, Cidade Exemplo - UF" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                      <div>
                          <Label htmlFor="telefoneOficina">Telefone Principal</Label>
                          <Input id="telefoneOficina" type="tel" defaultValue="(00) 1234-5678" />
                      </div>
                      <div>
                          <Label htmlFor="emailOficina">Email de Contato</Label>
                          <Input id="emailOficina" type="email" defaultValue="contato@mecanicaagil.com" />
                      </div>
                  </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-6 border-t">
                <Button onClick={handleSaveGeneralSettings} className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" /> Salvar Configurações Gerais
                </Button>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="nfe-settings">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-0 hover:no-underline">
                 <CardHeader className="flex-row justify-between items-center w-full pr-4">
                    <div>
                        <CardTitle className="flex items-center gap-2"><FileArchive className="h-5 w-5 text-primary"/> Configurações de Nota Fiscal (NF-e)</CardTitle>
                        <CardDescription>Dados da empresa para emissão de notas fiscais e configurações do sistema emissor.</CardDescription>
                    </div>
                </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                      <div><Label htmlFor="nfeRazaoSocial">Razão Social</Label><Input id="nfeRazaoSocial" placeholder="Sua Empresa LTDA ME"/></div>
                      <div><Label htmlFor="nfeCnpj">CNPJ</Label><Input id="nfeCnpj" placeholder="00.000.000/0001-00"/></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                      <div><Label htmlFor="nfeIE">Inscrição Estadual</Label><Input id="nfeIE" placeholder="123.456.789.110 ou ISENTO"/></div>
                      <div><Label htmlFor="nfeIM">Inscrição Municipal (Opcional)</Label><Input id="nfeIM" placeholder="9876543-2"/></div>
                  </div>
                  <div><Label htmlFor="nfeEnderecoCompleto">Endereço Completo (para NF-e)</Label><Input id="nfeEnderecoCompleto" placeholder="Rua Fiscal, 100, Centro, Cidade Fiscal - UF, CEP 00000-000"/></div>
                  <div className="grid md:grid-cols-2 gap-6">
                      <div><Label htmlFor="nfeTelefone">Telefone (para NF-e)</Label><Input id="nfeTelefone" type="tel" placeholder="(00) 99999-8888"/></div>
                      <div><Label htmlFor="nfeEmail">Email (para NF-e)</Label><Input id="nfeEmail" type="email" placeholder="fiscal@suaempresa.com"/></div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                      <div>
                          <Label htmlFor="nfeRegimeTributario">Regime Tributário</Label>
                          <Select defaultValue="simples_nacional">
                              <SelectTrigger id="nfeRegimeTributario"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                  {regimesTributarios.map(regime => <SelectItem key={regime.value} value={regime.value}>{regime.label}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div><Label htmlFor="nfeSerie">Série da NF-e</Label><Input id="nfeSerie" type="number" defaultValue="1" placeholder="Ex: 1"/></div>
                      <div><Label htmlFor="nfeProximoNumero">Próximo Número NF-e</Label><Input id="nfeProximoNumero" type="number" defaultValue="1" placeholder="Ex: 1001"/></div>
                  </div>
                  <div>
                      <Label htmlFor="nfeAmbiente">Ambiente de Emissão</Label>
                      <Select defaultValue="homologacao">
                          <SelectTrigger id="nfeAmbiente"><SelectValue /></SelectTrigger>
                          <SelectContent>
                              {ambientesNFe.map(ambiente => <SelectItem key={ambiente.value} value={ambiente.value}>{ambiente.label}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </div>
                  <div>
                      <Label htmlFor="nfeApiEmissor">Chave de API do Serviço Emissor de NF-e</Label>
                      <Input id="nfeApiEmissor" type="password" placeholder="********************************" disabled />
                      <p className="text-xs text-muted-foreground mt-1">
                          Para emissão real, é necessário um Certificado Digital A1 (arquivo .pfx) e integração com um sistema emissor de NF-e.
                          Insira aqui a chave da API do serviço contratado.
                      </p>
                  </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-6 border-t">
                <Button onClick={handleSaveNFeSettings} className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" /> Salvar Configurações de NF-e
                </Button>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>

        <AccordionItem value="alert-settings">
          <Card className="shadow-lg">
            <AccordionTrigger className="p-0 hover:no-underline">
                 <CardHeader className="flex-row justify-between items-center w-full pr-4">
                    <div>
                        <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary"/> Configurações de Alertas por WhatsApp</CardTitle>
                        <CardDescription>Gerencie as notificações automáticas. Requer API de WhatsApp válida.</CardDescription>
                    </div>
                </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0 space-y-8">
                <div>
                  <Label htmlFor="whatsappApiKey">API Key / Token do WhatsApp</Label>
                  <Input
                    id="whatsappApiKey"
                    type="password"
                    placeholder="Cole aqui sua chave de API do WhatsApp Business"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Esta chave é necessária para o envio de mensagens. Mantenha-a segura.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> Alertas para Clientes</h3>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-6 gap-y-4">
                    {alertasClienteTipos.map((alerta) => (
                      <div key={alerta.id} className={`flex items-center justify-between gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors shadow-sm ${alerta.hasDaysInput ? 'flex-col sm:flex-row items-start sm:items-center' : ''}`}>
                        <div className="flex-grow flex items-center gap-2.5 min-w-0">
                          {alerta.icon && <alerta.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                          <Label htmlFor={`cliente-${alerta.id}`} className="text-sm cursor-pointer">{alerta.label}</Label>
                        </div>
                        <div className="flex items-center gap-3 mt-2 sm:mt-0 ml-auto">
                          {alerta.hasDaysInput && (
                            <div className="flex items-center gap-1.5">
                              <Input
                                type="number"
                                id={`dias-${alerta.id}`}
                                value={diasParaLembretes[alerta.id] || ''}
                                onChange={(e) => handleDiasLembreteChange(alerta.id, e.target.value)}
                                className="w-20 h-8 text-sm p-1.5"
                                disabled={!alertasCliente[alerta.id]}
                                min="1"
                              />
                              <Label htmlFor={`dias-${alerta.id}`} className="text-xs text-muted-foreground">dias</Label>
                            </div>
                          )}
                          <Switch
                            id={`cliente-${alerta.id}`}
                            checked={alertasCliente[alerta.id] || false}
                            onCheckedChange={(checked) => handleAlertChange("cliente", alerta.id, checked)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary"/> Alertas para Funcionários</h3>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                    {alertasFuncionarioTipos.map((alerta) => (
                      <div key={alerta.id} className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors shadow-sm">
                        <Label htmlFor={`func-${alerta.id}`} className="flex-grow cursor-pointer flex items-center gap-2.5 min-w-0">
                          {alerta.icon && <alerta.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                          <span className="text-sm">{alerta.label}</span>
                        </Label>
                        <Switch
                          id={`func-${alerta.id}`}
                          checked={alertasFuncionario[alerta.id] || false}
                          onCheckedChange={(checked) => handleAlertChange("funcionario", alerta.id, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-6 border-t">
                <Button onClick={handleSaveAlertSettings} className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" /> Salvar Configurações de Alertas
                </Button>
              </CardFooter>
            </AccordionContent>
          </Card>
        </AccordionItem>
        
        <AccordionItem value="documentation">
            <Card className="shadow-lg">
                <AccordionTrigger className="p-0 hover:no-underline">
                    <CardHeader className="flex-row justify-between items-center w-full pr-4">
                        <div>
                            <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Documentação: Módulo de Nota Fiscal (Simulado)</CardTitle>
                        </div>
                    </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                    <CardContent className="pt-0 space-y-4 text-sm text-muted-foreground">
                        <p><strong>Finalidade do Módulo:</strong> Este módulo tem como objetivo gerenciar as informações fiscais da sua empresa e simular o fluxo de emissão e recebimento de Notas Fiscais Eletrônicas (NF-e).</p>
                        
                        <h4 className="font-semibold text-foreground">Configuração Fiscal:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Preencha todos os dados da sua empresa na seção "Configurações de Nota Fiscal" acima. Esses dados são essenciais e constarão em todas as NF-e emitidas.</li>
                            <li>O "Regime Tributário" define como os impostos serão calculados.</li>
                            <li>"Série da NF-e" e "Próximo Número NF-e" controlam a numeração sequencial das suas notas.</li>
                            <li>O "Ambiente de Emissão" deve ser "Homologação" para testes e "Produção" para notas com validade fiscal.</li>
                            <li><strong>Importante:</strong> A emissão real de NF-e exige um Certificado Digital A1 (arquivo .pfx) válido para sua empresa e, geralmente, a contratação de um serviço de API especializado em emissão de NF-e (ex: FocusNFe, NFE.io, TecnoSpeed). A "Chave de API" fornecida por esse serviço seria configurada no campo correspondente (atualmente desabilitado para simulação).</li>
                        </ul>

                        <h4 className="font-semibold text-foreground">Entrada de Produtos com NF-e de Compra:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Ao cadastrar um novo produto (em <a href="/dashboard/produtos/novo" className="text-primary underline">Produtos &gt; Novo Produto</a>), você encontrará uma seção opcional "Dados da Nota Fiscal de Compra (Entrada)".</li>
                            <li>Informe a "Chave de Acesso" (44 dígitos) da NF-e que seu fornecedor emitiu, a "Data de Emissão" e o "Valor Total" dessa nota.</li>
                            <li>Isso ajuda no rastreamento do custo de entrada e na gestão de estoque.</li>
                        </ul>

                        <h4 className="font-semibold text-foreground">Emissão de NF-e de Venda (Fluxo Conceitual):</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>A emissão de NF-e para seu cliente (saída de produtos/serviços) ocorreria tipicamente:</li>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Ao finalizar uma Ordem de Serviço que utilizou peças e/ou serviços tributáveis.</li>
                                <li>Através de uma funcionalidade de "Venda de Balcão" ou "Venda Direta" (a ser implementada).</li>
                            </ul>
                            <li>O sistema coletaria os dados do cliente, os produtos vendidos (com seus respectivos NCMs, CFOPs, etc.), os serviços prestados, valores e informações de pagamento.</li>
                            <li>Esses dados seriam enviados para a API de emissão de NF-e configurada.</li>
                            <li>Após autorização da SEFAZ, o sistema receberia o XML da NF-e e o link/arquivo do DANFE (Documento Auxiliar da NF-e).</li>
                            <li>Esses arquivos seriam armazenados e poderiam ser gerenciados na seção "Financeiro &gt; Gerenciar Notas Fiscais". O cliente também poderia ter acesso ao DANFE via portal.</li>
                        </ul>
                        
                        <div className="p-3 border border-destructive/50 bg-destructive/10 text-destructive rounded-md">
                            <p className="font-semibold flex items-center gap-1"><AlertTriangle className="h-4 w-4"/> Disclaimer Importante:</p>
                            <p>Este módulo é uma **simulação para fins de prototipagem**. A emissão real de Notas Fiscais Eletrônicas (NF-e) é um processo complexo que exige conformidade legal, certificado digital válido, e integração com os web services da SEFAZ, geralmente através de uma API de terceiros especializada. Consulte seu contador para mais informações.</p>
                        </div>
                    </CardContent>
                </AccordionContent>
            </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
    

    

    