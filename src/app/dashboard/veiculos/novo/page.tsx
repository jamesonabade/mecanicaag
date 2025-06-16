'use client';

import React, { Suspense } from "react";
import dynamic from 'next/dynamic';

const VeiculoForm = dynamic(() => import('@/components/veiculos/VeiculoForm'), {
  loading: () => <div className="container mx-auto py-10 flex justify-center items-center min-h-[300px]"><p className="text-lg text-muted-foreground">Carregando formulário de veículo...</p></div>,
  ssr: false, // Garante que o componente só seja renderizado no cliente
});

export default function NovoVeiculoPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 flex justify-center items-center min-h-[300px]"><p className="text-lg text-muted-foreground">Preparando formulário...</p></div>}>
      <VeiculoForm />
    </Suspense>
  );
}
