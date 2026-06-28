import axios from 'axios';
import { mockDb, User, ApiItem, Collection, ActivityLog } from './mockDb';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.apihub.com/v1';

// Create Axios Instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach Authorization JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('apihub_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Authentication Expirations & Global Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Token expired / Unauthorized
        localStorage.removeItem('apihub_token');
        localStorage.removeItem('apihub_user');
        // Redirect to login if in browser environment
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Mock Wrapper Services (Emulates HTTP requests on top of mockDb)
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, password?: string): Promise<{ token: string; user: User }> => {
    await delay(600); // Simulate network latency
    const users = mockDb.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('User not found. Try developer@company.com or admin@apihub.com');
    }

    // Generate dummy JWT token
    const token = `mock-jwt-token-header.${btoa(JSON.stringify(user))}.mock-signature`;
    localStorage.setItem('apihub_token', token);
    localStorage.setItem('apihub_user', JSON.stringify(user));
    
    mockDb.addActivity(`User logged in: ${user.name}`, 'info', 'SUCCESS');
    return { token, user };
  },

  register: async (name: string, email: string): Promise<{ token: string; user: User }> => {
    await delay(800);
    const users = mockDb.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email is already registered');
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'developer',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gok_o0DtLEC3m0jbNL_quGIbn6A-HacR4g9oxWeILFiwglfhBUr4vNTbxkIBdI0NpDARa3PU3xJmKKr4Al6rm_3jkKqpmEhgbOkb1N3x00s6DKL2X5DhSTUD6gkWzbL8aVS8eLGgUGJufK6kjV1aXlfuXCkSlTxEYSvEz8TvJ_8kpkv4Zl8E6lq2Vwvo2fKpRcl9-bVs78_JtqjKubxECUmy06wizaq_kdDZY8UCpnp1NECGq3o1-I3phOYxRCPbEmneSiNetsL5',
      plan: 'Free',
      apiKeyCount: 1,
    };

    mockDb.saveUser(newUser);
    const token = `mock-jwt-token-header.${btoa(JSON.stringify(newUser))}.mock-signature`;
    localStorage.setItem('apihub_token', token);
    localStorage.setItem('apihub_user', JSON.stringify(newUser));

    mockDb.addActivity(`New account registered: ${name}`, 'info', 'SUCCESS');
    return { token, user: newUser };
  },

  logout: async (): Promise<void> => {
    await delay(300);
    const userJson = localStorage.getItem('apihub_user');
    if (userJson) {
      const user = JSON.parse(userJson) as User;
      mockDb.addActivity(`User logged out: ${user.name}`, 'info', 'LOGOUT');
    }
    localStorage.removeItem('apihub_token');
    localStorage.removeItem('apihub_user');
  },

  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('apihub_token');
    if (!token) return null;
    try {
      const userJson = localStorage.getItem('apihub_user');
      if (userJson) {
        return JSON.parse(userJson) as User;
      }
    } catch {
      localStorage.removeItem('apihub_token');
      localStorage.removeItem('apihub_user');
    }
    return null;
  },

  refreshUser: async (userId: string): Promise<User> => {
    await delay(400);
    const users = mockDb.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    localStorage.setItem('apihub_user', JSON.stringify(user));
    return user;
  },
};

export const apiHubService = {
  // APIs
  getApis: async (): Promise<ApiItem[]> => {
    await delay(500);
    return mockDb.getApis();
  },
  getApiById: async (id: string): Promise<ApiItem> => {
    await delay(300);
    const apiItem = mockDb.getApis().find((a) => a.id === id);
    if (!apiItem) throw new Error('API not found');
    return apiItem;
  },
  createApi: async (apiItem: Omit<ApiItem, 'id'>): Promise<ApiItem> => {
    await delay(600);
    const newApi: ApiItem = {
      ...apiItem,
      id: `api_${Date.now()}`,
    };
    mockDb.saveApi(newApi);
    mockDb.addActivity(`Created API: ${newApi.name}`, 'info', 'CREATED');
    return newApi;
  },
  updateApi: async (apiItem: ApiItem): Promise<ApiItem> => {
    await delay(400);
    mockDb.saveApi(apiItem);
    mockDb.addActivity(`Updated API config: ${apiItem.name}`, 'info', 'UPDATED');
    return apiItem;
  },
  deleteApi: async (id: string): Promise<void> => {
    await delay(400);
    const apiItem = mockDb.getApis().find((a) => a.id === id);
    if (apiItem) {
      mockDb.deleteApi(id);
      mockDb.addActivity(`Deleted API: ${apiItem.name}`, 'warning', 'DELETED');
    }
  },

  // Collections
  getCollections: async (): Promise<Collection[]> => {
    await delay(450);
    return mockDb.getCollections();
  },
  getCollectionById: async (id: string): Promise<Collection> => {
    await delay(300);
    const col = mockDb.getCollections().find((c) => c.id === id);
    if (!col) throw new Error('Collection not found');
    return col;
  },

  // Favorites
  getFavorites: async (): Promise<ApiItem[]> => {
    await delay(400);
    const favIds = mockDb.getFavorites();
    return mockDb.getApis().filter((a) => favIds.includes(a.id));
  },
  toggleFavorite: async (apiId: string): Promise<boolean> => {
    await delay(200);
    mockDb.toggleFavorite(apiId);
    const favIds = mockDb.getFavorites();
    const isFav = favIds.includes(apiId);
    const apiItem = mockDb.getApis().find((a) => a.id === apiId);
    if (apiItem) {
      mockDb.addActivity(
        isFav ? `Added ${apiItem.name} to Favorites` : `Removed ${apiItem.name} from Favorites`,
        'success',
        'FAV'
      );
    }
    return isFav;
  },

  // Activity Logs
  getActivities: async (): Promise<ActivityLog[]> => {
    await delay(300);
    return mockDb.getActivities();
  },
  clearActivities: async (): Promise<void> => {
    await delay(200);
    mockDb.clearActivities();
  },
};

export default api;
