
import axios from 'axios';
import type { 
  ApiResponse, 
  Content, 
  UserProfile, 
  SubscriptionPlan, 
  UserSubscription, 
  Episode,
  Favorite,
  Download,
  PlaybackHistory,
  PaginatedResponse,
  Genre,
  Device,
  UserStatistics
} from '../types/api';

// Base API configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://api.streaming-galaxy.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Profiles
export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  const response = await api.get<ApiResponse<UserProfile>>('/profiles/me');
  return response.data;
};

export const updateUserProfile = async (profile: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
  const response = await api.patch<ApiResponse<UserProfile>>('/profiles/me', profile);
  return response.data;
};

// Subscription Plans
export const getSubscriptionPlans = async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
  const response = await api.get<ApiResponse<SubscriptionPlan[]>>('/plans');
  return response.data;
};

export const getUserSubscription = async (): Promise<ApiResponse<UserSubscription>> => {
  const response = await api.get<ApiResponse<UserSubscription>>('/subscriptions/me');
  return response.data;
};

export const createSubscription = async (subscription: Partial<UserSubscription>): Promise<ApiResponse<UserSubscription>> => {
  const response = await api.post<ApiResponse<UserSubscription>>('/subscriptions', subscription);
  return response.data;
};

// Content
export const getContents = async (params?: { 
  page?: number; 
  pageSize?: number; 
  tipo?: string;
  genero?: string;
  query?: string;
}): Promise<ApiResponse<PaginatedResponse<Content>>> => {
  const response = await api.get<ApiResponse<PaginatedResponse<Content>>>('/contents', { params });
  return response.data;
};

export const getContentById = async (id: string): Promise<ApiResponse<Content>> => {
  const response = await api.get<ApiResponse<Content>>(`/contents/${id}`);
  return response.data;
};

export const getFeaturedContent = async (): Promise<ApiResponse<Content[]>> => {
  const response = await api.get<ApiResponse<Content[]>>('/contents/featured');
  return response.data;
};

// Episodes
export const getEpisodesByContentId = async (contentId: string): Promise<ApiResponse<Episode[]>> => {
  const response = await api.get<ApiResponse<Episode[]>>(`/contents/${contentId}/episodes`);
  return response.data;
};

export const getEpisodeById = async (id: string): Promise<ApiResponse<Episode>> => {
  const response = await api.get<ApiResponse<Episode>>(`/episodes/${id}`);
  return response.data;
};

// User Interactions
export const addFavorite = async (contentId: string): Promise<ApiResponse<Favorite>> => {
  const response = await api.post<ApiResponse<Favorite>>('/favorites', { conteudo_id: contentId });
  return response.data;
};

export const removeFavorite = async (contentId: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/favorites/${contentId}`);
  return response.data;
};

export const getFavorites = async (): Promise<ApiResponse<Content[]>> => {
  const response = await api.get<ApiResponse<Content[]>>('/favorites');
  return response.data;
};

export const updatePlaybackProgress = async (
  data: { conteudo_id?: string; episodio_id?: string; posicao_tempo: number; percentual_assistido?: number }
): Promise<ApiResponse<PlaybackHistory>> => {
  const response = await api.post<ApiResponse<PlaybackHistory>>('/playback/history', data);
  return response.data;
};

export const getPlaybackHistory = async (): Promise<ApiResponse<PlaybackHistory[]>> => {
  const response = await api.get<ApiResponse<PlaybackHistory[]>>('/playback/history');
  return response.data;
};

// Downloads
export const createDownload = async (
  data: { arquivo_midia_id: string; dispositivo_id: string }
): Promise<ApiResponse<Download>> => {
  const response = await api.post<ApiResponse<Download>>('/downloads', data);
  return response.data;
};

export const getDownloads = async (): Promise<ApiResponse<Download[]>> => {
  const response = await api.get<ApiResponse<Download[]>>('/downloads');
  return response.data;
};

// Devices
export const registerDevice = async (
  data: { tipo: string; identificador: string; metadata?: Record<string, any> }
): Promise<ApiResponse<Device>> => {
  const response = await api.post<ApiResponse<Device>>('/devices', data);
  return response.data;
};

export const getDevices = async (): Promise<ApiResponse<Device[]>> => {
  const response = await api.get<ApiResponse<Device[]>>('/devices');
  return response.data;
};

// Genres
export const getGenres = async (): Promise<ApiResponse<Genre[]>> => {
  const response = await api.get<ApiResponse<Genre[]>>('/genres');
  return response.data;
};

// User Statistics
export const getUserStatistics = async (): Promise<ApiResponse<UserStatistics>> => {
  const response = await api.get<ApiResponse<UserStatistics>>('/statistics/me');
  return response.data;
};

export default api;
