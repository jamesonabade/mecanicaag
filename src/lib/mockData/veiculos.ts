
// Interface para Veiculo
export interface Veiculo {
  id: string;
  clienteId: string; // Para associar ao cliente
  placa: string;
  marca: string;
  modelo: string;
  anoFabricacao?: number;
  anoModelo?: number;
  cor?: string;
  chassi?: string;
  renavam?: string;
  quilometragem?: number;
  imageUrl?: string;
  observacoes?: string;
  dataCadastro: string; // ISO String
}

// Dados Iniciais (Modelo)
const mockVeiculosInicial: Veiculo[] = [
  {
    id: "vec_modelo_001",
    clienteId: "cli_modelo_001", // ID do Cliente Exemplo Padrão
    placa: "EXP-2024",
    marca: "Marca Exemplo",
    modelo: "Modelo Padrão X",
    anoFabricacao: 2022,
    anoModelo: 2022,
    cor: "Azul Metálico",
    chassi: "9BWZZZ377VT000123",
    renavam: "01234567890",
    quilometragem: 25000,
    imageUrl: "https://placehold.co/600x400.png",
    observacoes: "Veículo de teste principal.",
    dataCadastro: new Date().toISOString(),
  },
  {
    id: "vec_002_strada",
    clienteId: "cli_modelo_001", // Também do Cliente Exemplo Padrão
    placa: "BRA-2E19",
    marca: "Fiat",
    modelo: "Strada",
    anoFabricacao: 2021,
    anoModelo: 2021,
    cor: "Vermelho",
    quilometragem: 55000,
    dataCadastro: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: "vec_003_corolla",
    clienteId: "cli_002_maria", // Da Maria Oliveira
    placa: "GHI-9012",
    marca: "Toyota",
    modelo: "Corolla",
    anoFabricacao: 2020,
    anoModelo: 2020,
    cor: "Preto",
    quilometragem: 72000,
    dataCadastro: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
  },
];

// Simulação de um "banco de dados" em memória
export let veiculosDB: Veiculo[] = [...mockVeiculosInicial];

// Funções CRUD
export const getVeiculos = (): Veiculo[] => {
  return [...veiculosDB].sort((a,b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime());
};

export const getVeiculosByClienteId = (clienteId: string): Veiculo[] => {
  return veiculosDB.filter(veiculo => veiculo.clienteId === clienteId)
    .sort((a,b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime());
};

export const getVeiculoById = (id: string): Veiculo | undefined => {
  return veiculosDB.find(veiculo => veiculo.id === id);
};

export const addVeiculo = (veiculoData: Omit<Veiculo, 'id' | 'dataCadastro'>): Veiculo => {
  const novoVeiculo: Veiculo = {
    ...veiculoData,
    id: `vec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    dataCadastro: new Date().toISOString(),
  };
  veiculosDB.push(novoVeiculo);
  return novoVeiculo;
};

export const updateVeiculo = (id: string, updates: Partial<Omit<Veiculo, 'id' | 'dataCadastro' | 'clienteId'>>): Veiculo | null => {
  const veiculoIndex = veiculosDB.findIndex(veiculo => veiculo.id === id);
  if (veiculoIndex === -1) {
    return null;
  }
  veiculosDB[veiculoIndex] = { ...veiculosDB[veiculoIndex], ...updates };
  return veiculosDB[veiculoIndex];
};

export const deleteVeiculo = (id: string): boolean => {
  const veiculoIndex = veiculosDB.findIndex(veiculo => veiculo.id === id);
  if (veiculoIndex === -1) {
    return false;
  }
  veiculosDB.splice(veiculoIndex, 1);
  return true;
};

// Para ser usado em outras partes do sistema que precisam apenas da lista mock (menos controle)
export const mockVeiculos = veiculosDB;
