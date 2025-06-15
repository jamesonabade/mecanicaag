
// Interface para Cliente
export interface Cliente {
  id: string;
  nomeCompleto: string;
  cpfCnpj: string;
  telefone: string;
  email?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  observacoes?: string;
  dataCadastro: string; // ISO String
}

// Dados Iniciais (Modelo)
const mockClientesInicial: Cliente[] = [
  {
    id: "cli_modelo_001",
    nomeCompleto: "Cliente Exemplo Padrão",
    cpfCnpj: "123.456.789-00",
    telefone: "(11) 91234-5678",
    email: "cliente.exemplo@email.com",
    cep: "01000-000",
    logradouro: "Rua Exemplo Principal",
    numero: "123",
    complemento: "Apto 1",
    bairro: "Centro Exemplo",
    cidade: "Exemplópolis",
    estado: "SP",
    observacoes: "Cliente VIP, prefere contato por WhatsApp.",
    dataCadastro: new Date().toISOString(),
  },
  {
    id: "cli_002_maria",
    nomeCompleto: "Maria Oliveira Silva",
    cpfCnpj: "987.654.321-11",
    telefone: "(21) 99876-5432",
    email: "maria.oliveira@email.com",
    cep: "20000-000",
    logradouro: "Avenida Copacabana Modelo",
    numero: "456",
    bairro: "Copacabana",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    observacoes: "Indicada pelo Sr. João.",
    dataCadastro: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
  },
];

// Simulação de um "banco de dados" em memória
export let clientesDB: Cliente[] = [...mockClientesInicial];

// Funções CRUD
export const getClientes = (): Cliente[] => {
  return [...clientesDB].sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime());
};

export const getClienteById = (id: string): Cliente | undefined => {
  return clientesDB.find(cliente => cliente.id === id);
};

export const addCliente = (clienteData: Omit<Cliente, 'id' | 'dataCadastro'>): Cliente => {
  const novoCliente: Cliente = {
    ...clienteData,
    id: `cli_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    dataCadastro: new Date().toISOString(),
  };
  clientesDB.push(novoCliente);
  return novoCliente;
};

export const updateCliente = (id: string, updates: Partial<Omit<Cliente, 'id' | 'dataCadastro'>>): Cliente | null => {
  const clienteIndex = clientesDB.findIndex(cliente => cliente.id === id);
  if (clienteIndex === -1) {
    return null;
  }
  clientesDB[clienteIndex] = { ...clientesDB[clienteIndex], ...updates };
  return clientesDB[clienteIndex];
};

export const deleteCliente = (id: string): boolean => {
  const clienteIndex = clientesDB.findIndex(cliente => cliente.id === id);
  if (clienteIndex === -1) {
    return false;
  }
  clientesDB.splice(clienteIndex, 1);
  return true;
};

// Para ser usado em outras partes do sistema que precisam apenas da lista mock
export const getMockClientes = () => clientesDB;
