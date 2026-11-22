import axios, { type InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './config';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
} from './auth';

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const { data } = await axios.post<{ accessToken: string }>(
      API_URL + '/auth/refresh-token',
      { refreshToken },
    );
    saveAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);

    const original = error.config as RetryableConfig | undefined;
    const status = error.response?.status;
    const isAuthCall = original?.url?.startsWith('/auth/');

    if (original && !original._retry && !isAuthCall && (status === 401 || status === 403)) {
      original._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        const pending: Promise<string | null> =
          refreshing ?? refreshAccessToken(refreshToken);
        refreshing = pending;
        const newToken = await pending.finally(() => {
          refreshing = null;
        });

        if (newToken) {
          original.headers.Authorization = 'Bearer ' + newToken;
          return api(original);
        }
      }
      clearTokens();
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}