
import React, { Suspense } from "react";
import OrcamentoForm from "@/components/orcamentos/OrcamentoForm";

export default function NovoOrcamentoPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 flex justify-center items-center min-h-[300px]"><p className="text-lg text-muted-foreground">Carregando formulário de orçamento...</p></div>}>
      <OrcamentoForm />
    </Suspense>
  );
}

    