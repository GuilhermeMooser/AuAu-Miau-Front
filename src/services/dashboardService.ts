import { api } from './api';

export interface DashboardStats {
  totalAnimais: number;
  animaisDisponiveis: number;
  animaisAdotados: number;
  animaisEmTratamento: number;
  totalAdotantes: number;
  adotantesAtivos: number;
  contatosVencidos: number;
  proximosContatos: number;
}

export interface ContatoVencido {
  id: string;
  nome: string;
  proximoContato: Date;
  diasAtraso: number;
  contato: string;
}

export interface ProximoContato {
  id: string;
  nome: string;
  proximoContato: Date;
  diasRestantes: number;
  contato: string;
}

export interface AdocaoRecente {
  id: string;
  animalNome: string;
  adotanteNome: string;
  dataAdocao: Date;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  contatosVencidos: ContatoVencido[];
  proximosContatos: ProximoContato[];
  adocoesRecentes: AdocaoRecente[];
  chartData: {
    animaisPorTipo: Array<{ tipo: string; quantidade: number }>;
    adocoesPorMes: Array<{ mes: string; adocoes: number }>;
  };
}

export const dashboardService = {
  // Buscar dados completos do dashboard
  getData: async (): Promise<DashboardData> => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // Buscar apenas estatísticas básicas
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Buscar contatos vencidos
  getContatosVencidos: async (): Promise<ContatoVencido[]> => {
    const response = await api.get('/dashboard/contatos-vencidos');
    return response.data;
  },

  // Buscar próximos contatos
  getProximosContatos: async (dias = 7): Promise<ProximoContato[]> => {
    const response = await api.get(`/dashboard/proximos-contatos?dias=${dias}`);
    return response.data;
  },

  // Buscar adoções recentes
  getAdocoesRecentes: async (limit = 10): Promise<AdocaoRecente[]> => {
    const response = await api.get(`/dashboard/adocoes-recentes?limit=${limit}`);
    return response.data;
  },

  // Dados para gráficos
  getChartData: async (period = '12months'): Promise<DashboardData['chartData']> => {
    const response = await api.get(`/dashboard/charts?period=${period}`);
    return response.data;
  },
};