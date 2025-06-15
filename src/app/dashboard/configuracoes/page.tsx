
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, MessageSquare, Save, Users, UserCheck, HeartHandshake, Repeat, Gift, CheckCheck } from "lucide-react";

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
  { id: "lembreteTrocaOleo", label: "Lembrete de Troca de Óleo (KM/Tempo)", icon: Filter },
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

// Placeholder icons - replace with actual ones if needed
const CheckCircle = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const Clock = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Wrench = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const FileText = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const Filter = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const Car = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M7 17h10"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>;
const Edit3 = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const PackageSearch = (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v4"/><path d="M3 10v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/><path d="M15.5 10l-3.96 3.96a2 2 0 0 1-2.83 0L4.5 10"/><path d="M12 22v-8"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M20.27 20.27L22 22"/></svg>;


export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");

  // Estados para os switches de alertas
  const [alertasCliente, setAlertasCliente] = useState<Record<string, boolean>>(
    alertasClienteTipos.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {})
  );
  const [alertasFuncionario, setAlertasFuncionario] = useState<Record<string, boolean>>(
    alertasFuncionarioTipos.reduce((acc, curr) => ({ ...acc, [curr.id]: true }), {})
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

  const handleSaveAlertSettings = () => {
    console.log("Configurações de Alertas Salvas (Simulado):", { apiKey, alertasCliente, alertasFuncionario });
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


  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <Settings className="h-7 w-7" /> Configurações do Sistema
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Configurações Gerais da Oficina</CardTitle>
          <CardDescription>
            Informações básicas da sua oficina e preferências globais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
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
            <div className="grid md:grid-cols-2 gap-4">
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
        <CardFooter>
          <Button onClick={handleSaveGeneralSettings}>
            <Save className="mr-2 h-4 w-4" /> Salvar Configurações Gerais
          </Button>
        </CardFooter>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquare /> Configurações de Alertas por WhatsApp</CardTitle>
          <CardDescription>
            Gerencie as notificações automáticas enviadas para clientes e funcionários.
            É necessário configurar uma API de WhatsApp válida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="h-5 w-5 text-primary"/> Alertas para Clientes</h3>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              {alertasClienteTipos.map((alerta) => (
                <div key={alerta.id} className="flex items-center justify-between space-x-2 p-3 border rounded-md bg-muted/20 hover:bg-muted/40 transition-colors">
                  <Label htmlFor={`cliente-${alerta.id}`} className="flex-1 cursor-pointer flex items-center gap-2">
                    {alerta.icon && <alerta.icon className="h-4 w-4 text-muted-foreground" />}
                    {alerta.label}
                  </Label>
                  <Switch
                    id={`cliente-${alerta.id}`}
                    checked={alertasCliente[alerta.id] || false}
                    onCheckedChange={(checked) => handleAlertChange("cliente", alerta.id, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary"/> Alertas para Funcionários</h3>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              {alertasFuncionarioTipos.map((alerta) => (
                <div key={alerta.id} className="flex items-center justify-between space-x-2 p-3 border rounded-md bg-muted/20 hover:bg-muted/40 transition-colors">
                   <Label htmlFor={`func-${alerta.id}`} className="flex-1 cursor-pointer flex items-center gap-2">
                    {alerta.icon && <alerta.icon className="h-4 w-4 text-muted-foreground" />}
                    {alerta.label}
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
        <CardFooter>
          <Button onClick={handleSaveAlertSettings}>
            <Save className="mr-2 h-4 w-4" /> Salvar Configurações de Alertas
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
    
