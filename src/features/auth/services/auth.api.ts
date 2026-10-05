import { apiClient, setAccessToken } from '@/lib/api/api-client';
import { AuthResponseData, User } from '../types/auth.types';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

export const authApi = {
  login: async (credentials: LoginFormData): Promise<AuthResponseData> => {
    const res = await apiClient<AuthResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAccessToken(res.data.accessToken);
    return res.data;
  },

  register: async (
    data: Omit<RegisterFormData, 'confirmPassword'>,
  ): Promise<AuthResponseData> => {
    const res = await apiClient<AuthResponseData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAccessToken(res.data.accessToken);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient('/auth/logout', { method: 'POST' });
    setAccessToken(null);
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient<{ user: User }>('/auth/me', { method: 'GET' });
    return res.data.user;
  },

  refreshToken: async (): Promise<string | null> => {
    try {
      const res = await apiClient<AuthResponseData>('/auth/refresh', {
        method: 'POST',
      });
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch {
      setAccessToken(null);
      return null;
    }
  },
};
