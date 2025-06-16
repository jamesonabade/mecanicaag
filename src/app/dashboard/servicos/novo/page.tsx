
import React, { Suspense } from "react";
import OrdemServicoForm from "@/components/servicos/OrdemServicoForm";

export default function NovaOrdemServicoPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 flex justify-center items-center min-h-[300px]"><p className="text-lg text-muted-foreground">Carregando formulário de Ordem de Serviço...</p></div>}>
      <OrdemServicoForm />
    </Suspense>
  );
}
