import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface NotificationItem {
  id: string;
  userId: string | null;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER';
  isRead: boolean;
  createdAt: string;
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch('/api/notifications', {
        headers: getAuthHeaders(),
        credentials: 'same-origin',
      });
      if (!response.ok) {
        return [];
      }
      return response.json() as Promise<NotificationItem[]>;
    },
    refetchInterval: 15000,
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'same-origin',
      });
      if (!res.ok) throw new Error('Error al marcar notificaciones');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
