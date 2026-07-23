import { useQuery } from '@tanstack/react-query';


export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMINISTRATOR' | 'OPERATOR';
  isActive: boolean;
  clientId: string | null;
  createdAt: string;
}

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener usuarios');
      }
      return response.json();
    },
  });
}
