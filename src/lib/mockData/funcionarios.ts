
export interface Funcionario {
  id: string;
  nome: string;
  cargo?: 'Atendente' | 'Mecânico' | 'Gerente' | 'Orçamentista' | 'Outro'; 
}

export const mockFuncionarios: Funcionario[] = [
  { id: "func001", nome: "Ana Beatriz Silva", cargo: "Atendente" },
  { id: "func002", nome: "Carlos Alberto Pereira", cargo: "Mecânico" },
  { id: "func003", nome: "Pedro Henrique Costa", cargo: "Mecânico" },
  { id: "func004", nome: "Sofia Dias Rocha", cargo: "Gerente" },
  { id: "func005", nome: "Marcos Vinicius Lima", cargo: "Orçamentista" },
  { id: "func006", nome: "Juliana Alves (Mecânica)", cargo: "Mecânico" },
  { id: "func007", nome: "Rafael Souza (Atendente)", cargo: "Atendente" },
];

export const getFuncionarios = (): Funcionario[] => [...mockFuncionarios];

export const getAtendentes = (): Funcionario[] => 
  mockFuncionarios.filter(f => f.cargo === 'Atendente' || f.cargo === 'Gerente');

export const getMecanicos = (): Funcionario[] => 
  mockFuncionarios.filter(f => f.cargo === 'Mecânico' || f.cargo === 'Gerente' || f.cargo === 'Orçamentista');

export const getMecanicosOrcamentistas = (): Funcionario[] =>
  mockFuncionarios.filter(f => f.cargo === 'Mecânico' || f.cargo === 'Orçamentista' || f.cargo === 'Gerente');

export const getFuncionarioById = (id: string): Funcionario | undefined => {
  return mockFuncionarios.find(f => f.id === id);
};
