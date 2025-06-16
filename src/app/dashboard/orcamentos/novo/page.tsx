
import React, { Suspense } from "react";
import dynamic from 'next/dynamic';

// Carregar dinamicamente o OrcamentoForm com SSR desabilitado
const OrcamentoForm = dynamic(() => import('@/components/orcamentos/OrcamentoForm'), {
  loading: () => <div className="container mx-auto py-10 flex justify-center items-center min-h-[300px]"><p className="text-lg text-muted-foreground">Carregando formulário de orçamento...</p></div>,
});

export default function NovoOrcamentoPage() {
  return (
    // O Suspense aqui ainda é útil para o 'loading' state do dynamic import,
    // e para outros componentes filhos que possam usar Suspense.
    <Suspense fallback={<div className="container mx-auto py-10 flex justify-center items-center min-h-[300px]"><p className="text-lg text-muted-foreground">Preparando formulário...</p></div>}>
      <OrcamentoForm />
    </Suspense>
  );
}
