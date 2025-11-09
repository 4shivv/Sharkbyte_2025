import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Type definitions
export interface User {
  id: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Agent {
  id: string;
  agent_name: string;
  owner: string;
  description: string | null;
  system_prompt: string | null;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentRequest {
  agent_name: string;
  owner: string;
  description?: string;
  system_prompt?: string;
}

export interface UpdateAgentRequest {
  agent_name?: string;
  owner?: string;
  description?: string;
  system_prompt?: string;
}

export interface Vulnerability {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  description: string;
  exploit_example: string;
}

export interface AttackSimulation {
  attack_type: string;
  payload: string;
  expected_outcome: string;
  mitigation: string;
}

export interface RemediationStep {
  priority: number;
  category: string;
  action: string;
  implementation: string;
}

export interface Scan {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  security_score: number | null;
  vulnerabilities: Vulnerability[] | null;
  attack_simulations: AttackSimulation[] | null;
  remediation_steps: RemediationStep[] | null;
  error_message: string | null;
  agent_name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitiateScanResponse {
  scanId: string;
  status: string;
  message: string;
}

export interface RemediationResponse {
  original_prompt: string;
  hardened_prompt: string;
  vulnerabilities_addressed: number;
}

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // FR-1.1: Register a new user with email and password
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // FR-1.2: Login user with credentials and return JWT
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};

// Agent API
export const agentAPI = {
  // FR-2.6: Get all agents for authenticated user
  getAll: async (): Promise<Agent[]> => {
    const response = await api.get<Agent[]>('/agents');
    return response.data;
  },

  // FR-2.1, FR-2.2, FR-2.3, FR-2.4: Create new agent with mandatory ID, owner, description, and system prompt
  create: async (agentData: CreateAgentRequest): Promise<Agent> => {
    const response = await api.post<Agent>('/agents', agentData);
    return response.data;
  },

  // Get single agent by ID
  getById: async (id: string): Promise<Agent> => {
    const response = await api.get<Agent>(`/agents/${id}`);
    return response.data;
  },

  // FR-2.5: Update agent details (owner, description, system_prompt)
  update: async (id: string, agentData: UpdateAgentRequest): Promise<Agent> => {
    const response = await api.put<Agent>(`/agents/${id}`, agentData);
    return response.data;
  },
};

// Scan API
export const scanAPI = {
  // FR-3.1: Initiate security scan for an agent
  initiateScan: async (agentId: string): Promise<InitiateScanResponse> => {
    const response = await api.post<InitiateScanResponse>(`/agents/${agentId}/scan`);
    return response.data;
  },

  // FR-3.8: Get scan result by ID
  getScanResult: async (scanId: string): Promise<Scan> => {
    const response = await api.get<Scan>(`/scans/${scanId}`);
    return response.data;
  },

  // Get all scans for an agent
  getAgentScans: async (agentId: string): Promise<Scan[]> => {
    const response = await api.get<Scan[]>(`/agents/${agentId}/scans`);
    return response.data;
  },

  // FR-4.7: Generate hardened prompt using Gemini API
  remediatePrompt: async (scanId: string): Promise<RemediationResponse> => {
    const response = await api.post<RemediationResponse>(`/scans/${scanId}/remediate`);
    return response.data;
  },
};

export default api;
