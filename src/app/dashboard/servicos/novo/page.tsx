
import React, { Suspense } from "react";
import dynamic from 'next/dynamic';

const OrdemServicoForm = dynamic(() => import('@/components/servicos/OrdemServicoForm'), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => <div className="container mx-auto py-10 flex justify-center items-center min-h-[300px]"><p className="text-lg text-muted-foreground">Carregando formulário de Ordem de Serviço...</p></div>,
});

export default function NovaOrdemServicoPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 flex justify-center items-center min-h-[300px]"><p className="text-lg text-muted-foreground">Preparando formulário...</p></div>}>
      <OrdemServicoForm />
    </Suspense>
  );
}
