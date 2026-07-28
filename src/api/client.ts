import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el Bearer token JWT de sesión en las solicitudes
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor para manejo global de errores o transformaciones si es necesario
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí se pueden centralizar logs de errores financieros o formatear respuestas
    const message = error.response?.data?.message || 'Ocurrió un error inesperado';
    return Promise.reject(new Error(Array.isArray(message) ? message.join(', ') : message));
  }
);

export default apiClient;
