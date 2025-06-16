
// Interface para Serviço do Catálogo
export interface ServicoCatalogo {
  id: string;
  nome: string;
  descricao?: string;
  valorPadrao: number;
  categoria?: string;
  tempoEstimadoHoras?: number; // Opcional
  itensInclusos?: string[]; // Opcional, ex: "Troca de filtro de óleo", "Verificação de níveis"
  checklistAssociadoId?: string; // Opcional, ID de um modelo de checklist
  dataCadastro: string; // ISO String
}

// Dados Iniciais (Modelo)
const mockServicosCatalogoInicial: ServicoCatalogo[] = [
  {
    id: "cat_serv_001",
    nome: "Revisão Completa Preventiva (20.000km)",
    descricao: "Revisão completa conforme manual do proprietário para 20.000km. Inclui troca de óleo, filtros, verificação de freios, suspensão e outros itens essenciais.",
    valorPadrao: 650.00,
    categoria: "Revisões",
    tempoEstimadoHoras: 4,
    itensInclusos: ["Troca de óleo e filtro", "Troca de filtro de ar", "Verificação de freios", "Alinhamento e Balanceamento"],
    checklistAssociadoId: "chk_model_001", // Exemplo de ID de checklist
    dataCadastro: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
  },
  {
    id: "cat_serv_002",
    nome: "Troca de Óleo e Filtro de Óleo (Motor)",
    descricao: "Serviço de troca de óleo do motor e substituição do filtro de óleo. Utiliza óleo conforme especificação do fabricante.",
    valorPadrao: 180.00,
    categoria: "Mecânica Geral",
    tempoEstimadoHoras: 1,
    checklistAssociadoId: "chk_model_003",
    dataCadastro: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  },
  {
    id: "cat_serv_003",
    nome: "Diagnóstico Eletrônico com Scanner",
    descricao: "Diagnóstico completo do sistema de injeção eletrônica e demais módulos do veículo utilizando scanner automotivo.",
    valorPadrao: 150.00,
    categoria: "Diagnóstico",
    tempoEstimadoHoras: 1.5,
    dataCadastro: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: "cat_serv_004",
    nome: "Alinhamento de Direção e Balanceamento (4 rodas)",
    descricao: "Serviço de alinhamento da direção e balanceamento das quatro rodas do veículo.",
    valorPadrao: 120.00,
    categoria: "Suspensão e Direção",
    tempoEstimadoHoras: 1,
    dataCadastro: new Date().toISOString(),
  },
  {
    id: "cat_serv_005",
    nome: "Higienização do Ar Condicionado",
    descricao: "Limpeza completa do sistema de ar condicionado, incluindo troca do filtro de cabine (se aplicável).",
    valorPadrao: 200.00,
    categoria: "Ar Condicionado",
    tempoEstimadoHoras: 1.5,
    dataCadastro: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
  },
];

// Simulação de um "banco de dados" em memória
export let servicosCatalogoDB: ServicoCatalogo[] = [...mockServicosCatalogoInicial];

// Funções CRUD
export const getServicosCatalogo = (): ServicoCatalogo[] => {
  return [...servicosCatalogoDB].sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime());
};

export const getServicoCatalogoById = (id: string): ServicoCatalogo | undefined => {
  return servicosCatalogoDB.find(servico => servico.id === id);
};

export const addServicoCatalogo = (servicoData: Omit<ServicoCatalogo, 'id' | 'dataCadastro'>): ServicoCatalogo => {
  const novoServico: ServicoCatalogo = {
    ...servicoData,
    id: `cat_serv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    dataCadastro: new Date().toISOString(),
  };
  servicosCatalogoDB.push(novoServico);
  return novoServico;
};

export const updateServicoCatalogo = (id: string, updates: Partial<Omit<ServicoCatalogo, 'id' | 'dataCadastro'>>): ServicoCatalogo | null => {
  const servicoIndex = servicosCatalogoDB.findIndex(servico => servico.id === id);
  if (servicoIndex === -1) {
    return null;
  }
  servicosCatalogoDB[servicoIndex] = { ...servicosCatalogoDB[servicoIndex], ...updates };
  return servicosCatalogoDB[servicoIndex];
};

export const deleteServicoCatalogo = (id: string): boolean => {
  const servicoIndex = servicosCatalogoDB.findIndex(servico => servico.id === id);
  if (servicoIndex === -1) {
    return false;
  }
  servicosCatalogoDB.splice(servicoIndex, 1);
  return true;
};
