import { useQuery } from '@tanstack/react-query';

export interface DashboardMetrics {
  kpis: {
    totalVolume: number;
    commissions: number;
    activeOperations: number;
    totalClients: number;
    averageAforo: number;
    totalInvoices: number;
  };
  charts: {
    volumeByMonth: { name: string; volume: number; commission: number }[];
    clientsByMonth: { name: string; count: number }[];
  };
}

export function useDashboardMetricsQuery() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al cargar métricas');
      }
      return response.json() as Promise<DashboardMetrics>;
    },
  });
}
