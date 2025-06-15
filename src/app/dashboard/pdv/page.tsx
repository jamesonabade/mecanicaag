
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Trash2, Barcode, DollarSign, CreditCard, CheckCircle, User, Percent, Search } from "lucide-react";
import Link from "next/link";

interface Produto {
  id: string;
  nome: string;
  codigoSku: string;
  precoVenda: number;
  estoqueAtual: number;
}

interface ItemVenda extends Produto {
  quantidade: number;
  subtotal: number;
}

// Mock data - Em uma aplicação real, viria do backend/estoque
const mockProdutosEstoque: Produto[] = [
  { id: "prod001", nome: "Óleo Motor 5W30 Sintético (Litro)", codigoSku: "SKU001", precoVenda: 45.00, estoqueAtual: 50 },
  { id: "prod002", nome: "Filtro de Óleo Original Honda Civic", codigoSku: "SKU002", precoVenda: 35.00, estoqueAtual: 30 },
  { id: "prod003", nome: "Pastilha de Freio Dianteira XYZ", codigoSku: "SKU003", precoVenda: 120.00, estoqueAtual: 15 },
  { id: "prod004", nome: "Lâmpada H4 Super Branca (Par)", codigoSku: "SKU004", precoVenda: 60.00, estoqueAtual: 25 },
  { id: "prod005", nome: "Aditivo Radiador Concentrado (Litro)", codigoSku: "SKU005", precoVenda: 25.00, estoqueAtual: 40 },
];

const mockClientes = [
  { id: "cli001", nome: "João da Silva" },
  { id: "cli002", nome: "Maria Oliveira" },
  { id: "cli000", nome: "Consumidor Final" }, // Cliente padrão
];

export default function PdvPage() {
  const { toast } = useToast();
  const [codigoBusca, setCodigoBusca] = useState("");
  const [itensVenda, setItensVenda] = useState<ItemVenda[]>([]);
  const [desconto, setDesconto] = useState(0);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>("cli000"); // Default to Consumidor Final

  const handleAdicionarProduto = () => {
    if (!codigoBusca.trim()) {
        toast({ variant: "destructive", title: "Campo Vazio", description: "Digite o código ou nome do produto." });
        return;
    }

    const produtoEncontrado = mockProdutosEstoque.find(
      (p) => p.codigoSku.toLowerCase() === codigoBusca.toLowerCase() || p.nome.toLowerCase().includes(codigoBusca.toLowerCase())
    );

    if (produtoEncontrado) {
      if (produtoEncontrado.estoqueAtual <= 0) {
        toast({ variant: "destructive", title: "Estoque Insuficiente", description: `Produto "${produtoEncontrado.nome}" sem estoque.` });
        setCodigoBusca("");
        return;
      }

      const itemExistenteIndex = itensVenda.findIndex(item => item.id === produtoEncontrado.id);

      if (itemExistenteIndex > -1) {
        const novosItens = [...itensVenda];
        if (novosItens[itemExistenteIndex].quantidade < produtoEncontrado.estoqueAtual) {
            novosItens[itemExistenteIndex].quantidade += 1;
            novosItens[itemExistenteIndex].subtotal = novosItens[itemExistenteIndex].quantidade * novosItens[itemExistenteIndex].precoVenda;
            setItensVenda(novosItens);
        } else {
            toast({ variant: "destructive", title: "Estoque Insuficiente", description: `Quantidade máxima em estoque para "${produtoEncontrado.nome}" atingida.` });
        }
      } else {
        setItensVenda([...itensVenda, { ...produtoEncontrado, quantidade: 1, subtotal: produtoEncontrado.precoVenda }]);
      }
      setCodigoBusca("");
    } else {
      toast({ variant: "destructive", title: "Produto não encontrado", description: `Nenhum produto com código/nome: "${codigoBusca}"` });
    }
  };
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAdicionarProduto();
  };

  const handleRemoverItem = (idProduto: string) => {
    setItensVenda(itensVenda.filter(item => item.id !== idProduto));
  };

  const handleAlterarQuantidade = (idProduto: string, novaQuantidade: number) => {
    const produtoEstoque = mockProdutosEstoque.find(p => p.id === idProduto);
    if (!produtoEstoque) return;

    if (novaQuantidade <= 0) {
      handleRemoverItem(idProduto);
      return;
    }
    if (novaQuantidade > produtoEstoque.estoqueAtual) {
        toast({variant: "destructive", title: "Estoque Insuficiente", description: `Disponível: ${produtoEstoque.estoqueAtual} para ${produtoEstoque.nome}`})
        return;
    }

    setItensVenda(
      itensVenda.map(item =>
        item.id === idProduto ? { ...item, quantidade: novaQuantidade, subtotal: novaQuantidade * item.precoVenda } : item
      )
    );
  };

  const subtotalVenda = useMemo(() => {
    return itensVenda.reduce((acc, item) => acc + item.subtotal, 0);
  }, [itensVenda]);

  const totalVenda = useMemo(() => {
    const totalComDesconto = subtotalVenda - desconto;
    return totalComDesconto > 0 ? totalComDesconto : 0;
  }, [subtotalVenda, desconto]);

  const handleFinalizarVenda = (metodoPagamento: string) => {
    if (itensVenda.length === 0) {
        toast({ variant: "destructive", title: "Venda vazia", description: "Adicione produtos antes de finalizar." });
        return;
    }
    console.log("Venda Finalizada (Simulado):", {
      cliente: mockClientes.find(c=>c.id === clienteSelecionado)?.nome,
      itens: itensVenda,
      subtotal: subtotalVenda.toFixed(2),
      desconto: desconto.toFixed(2),
      total: totalVenda.toFixed(2),
      metodoPagamento: metodoPagamento,
    });

    // Simulação de baixa no estoque
    itensVenda.forEach(itemVendido => {
      const produtoIndex = mockProdutosEstoque.findIndex(p => p.id === itemVendido.id);
      if (produtoIndex > -1) {
        // mockProdutosEstoque[produtoIndex].estoqueAtual -= itemVendido.quantidade; // Alteraria o mock, mas não persistiria entre renders sem estado global.
        console.log(`Estoque do produto ${mockProdutosEstoque[produtoIndex].nome} atualizado (simulado): ${mockProdutosEstoque[produtoIndex].estoqueAtual - itemVendido.quantidade} unidades restantes.`);
      }
    });
    
    toast({
      title: "Venda Realizada com Sucesso!",
      description: `Total: R$ ${totalVenda.toFixed(2)} via ${metodoPagamento}. Estoque atualizado (simulado).`,
    });
    setItensVenda([]);
    setDesconto(0);
    setCodigoBusca("");
    setClienteSelecionado("cli000");
  };


  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
          <ShoppingCart /> PDV - Venda Balcão
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Coluna de Itens da Venda e Finalização */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Itens da Venda</CardTitle>
              <CardDescription>Adicione produtos à venda atual.</CardDescription>
            </CardHeader>
            <CardContent>
              {itensVenda.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Produto</TableHead>
                      <TableHead className="text-center w-[100px]">Qtd.</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="text-center">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itensVenda.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nome}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={item.quantidade}
                            onChange={(e) => handleAlterarQuantidade(item.id, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center"
                            min="1"
                          />
                        </TableCell>
                        <TableCell className="text-right">R$ {item.precoVenda.toFixed(2)}</TableCell>
                        <TableCell className="text-right">R$ {item.subtotal.toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoverItem(item.id)} className="text-destructive h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhum item na venda.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
             <CardHeader>
                <CardTitle>Resumo e Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 items-end">
                    <div>
                        <Label htmlFor="cliente">Cliente</Label>
                        <Select value={clienteSelecionado} onValueChange={setClienteSelecionado}>
                            <SelectTrigger id="cliente">
                                <SelectValue placeholder="Selecione um cliente" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockClientes.map(cli => (
                                    <SelectItem key={cli.id} value={cli.id}>{cli.nome}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="desconto" className="flex items-center gap-1"><Percent className="h-4 w-4"/> Desconto (R$)</Label>
                        <Input
                        id="desconto"
                        type="number"
                        value={desconto}
                        onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        />
                    </div>
                </div>
                <div className="text-right space-y-1 pt-2 border-t">
                    <p className="text-muted-foreground">Subtotal: <span className="font-semibold text-foreground">R$ {subtotalVenda.toFixed(2)}</span></p>
                    {desconto > 0 && <p className="text-muted-foreground">Desconto: <span className="font-semibold text-destructive">- R$ {desconto.toFixed(2)}</span></p>}
                    <p className="text-2xl font-bold text-primary">Total a Pagar: R$ {totalVenda.toFixed(2)}</p>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button onClick={() => handleFinalizarVenda("Dinheiro")} className="flex-1" disabled={itensVenda.length === 0}>
                    <DollarSign className="mr-2 h-4 w-4"/> Dinheiro
                </Button>
                <Button onClick={() => handleFinalizarVenda("Cartão")} className="flex-1" disabled={itensVenda.length === 0}>
                    <CreditCard className="mr-2 h-4 w-4"/> Cartão
                </Button>
                 <Button onClick={() => handleFinalizarVenda("PIX")} className="flex-1" disabled={itensVenda.length === 0}>
                    <CheckCircle className="mr-2 h-4 w-4"/> PIX
                </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Coluna de Busca de Produto */}
        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Adicionar Produto</CardTitle>
              <CardDescription>Use o leitor de código de barras ou digite o SKU/Nome.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="codigoBusca" className="flex items-center gap-1"><Barcode className="h-5 w-5"/> Código / SKU / Nome do Produto</Label>
                  <Input
                    id="codigoBusca"
                    value={codigoBusca}
                    onChange={(e) => setCodigoBusca(e.target.value)}
                    placeholder="Digite ou escaneie o código"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Search className="mr-2 h-4 w-4"/> Adicionar à Venda
                </Button>
              </form>
            </CardContent>
          </Card>
           <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Opções Adicionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={() => toast({title: "Emissão de NF-e (Simulada)", description: "Funcionalidade de emissão de NF-e para venda balcão."})}>
                        Emitir NF-e (Simulado)
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/dashboard/produtos/estoque">Consultar Estoque Completo</Link>
                    </Button>
                </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
