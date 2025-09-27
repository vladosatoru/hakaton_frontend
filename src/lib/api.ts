const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Types
export interface User {
  id: number;
  email: string;
  name?: string;
  role: "GUEST" | "EDITOR" | "ADMIN";
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  published: boolean;
  publishDate?: string;
  author: User;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: number;
  title: string;
  description?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  category: "REGULATION" | "REPORT" | "INSTRUCTION" | "BUDGET" | "OTHER";
  author: User;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TrafficLight {
  id: number;
  address: string;
  type: "PEDESTRIAN" | "VEHICLE" | "COMBINED";
  status: "ACTIVE" | "MAINTENANCE" | "BROKEN";
  installDate: string;
  lastMaintenance?: string;
  latitude?: number;
  longitude?: number;
  user?: User;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Fine {
  id: number;
  violationType: string;
  amount: number;
  location: string;
  vehicleNumber: string;
  driverName: string;
  issueDate: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  user?: User;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Evacuation {
  id: number;
  vehicleNumber: string;
  reason: string;
  location: string;
  evacuationDate: string;
  cost: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  user?: User;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  type: "full_time" | "part_time" | "contract";
  location: string;
  requirements: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TrafficData {
  id: number;
  location: string;
  vehicle_count: number;
  timestamp: string;
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in_progress" | "resolved";
  location: string;
  created_at: string;
  updated_at: string;
}

// API Client class
class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const tokens = this.getTokensFromCookies();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (tokens?.accessToken) {
      headers["Authorization"] = `Bearer ${tokens.accessToken}`;
    }

    return headers;
  }

  private getTokensFromCookies(): {
    accessToken: string;
    refreshToken: string;
  } | null {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split(";");
    let accessToken = "";
    let refreshToken = "";

    cookies.forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name === "accessToken") accessToken = value;
      if (name === "refreshToken") refreshToken = value;
    });

    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }

    return null;
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const tokens = this.getTokensFromCookies();
    if (!tokens?.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/login/access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      // Обновляем токены в куках
      document.cookie = `accessToken=${data.accessToken}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; secure; samesite=strict`;
      document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=${
        30 * 24 * 60 * 60
      }; secure; samesite=strict`;

      return data.accessToken;
    } catch (error) {
      // Если обновление токена не удалось, очищаем куки
      document.cookie = "accessToken=; path=/; max-age=0";
      document.cookie = "refreshToken=; path=/; max-age=0";
      
      // Перенаправляем на логин только если мы не на странице логина
      if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const makeRequest = async (accessToken?: string): Promise<Response> => {
      const headers = await this.getAuthHeaders();
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const config: RequestInit = {
        headers: {
          ...headers,
          ...options.headers,
        },
        ...options,
      };

      return fetch(url, config);
    };

    try {
      let response = await makeRequest();

      // Если получили 401, пытаемся обновить токен
      // НО только если мы не на странице логина и не делаем запросы авторизации
      if (
        response.status === 401 &&
        endpoint !== "/auth/login" &&
        endpoint !== "/auth/register" &&
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        try {
          const newAccessToken = await this.refreshAccessToken();
          response = await makeRequest(newAccessToken);
        } catch (refreshError) {
          // Если обновление токена не удалось, перенаправляем на логин
          // только если мы не на странице логина
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          throw refreshError;
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // Authentication
  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    return this.request<{
      accessToken: string;
      refreshToken: string;
      user: User;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>("/auth/profile");
  }

  async logout(): Promise<void> {
    // Очищаем токены из куков
    document.cookie = "accessToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>("/projects");
  }

  async getProject(id: number): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(
    project: Omit<Project, "id" | "created_at" | "updated_at">
  ): Promise<Project> {
    return this.request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    });
  }

  async deleteProject(id: number): Promise<void> {
    return this.request<void>(`/projects/${id}`, {
      method: "DELETE",
    });
  }

  // Services
  async getServices(): Promise<Service[]> {
    return this.request<Service[]>("/services");
  }

  async getService(id: number): Promise<Service> {
    return this.request<Service>(`/services/${id}`);
  }

  // Team
  async getTeamMembers(): Promise<TeamMember[]> {
    return this.request<TeamMember[]>("/team");
  }

  async getTeamMember(id: number): Promise<TeamMember> {
    return this.request<TeamMember>(`/team/${id}`);
  }

  // News
  async getNews(): Promise<NewsArticle[]> {
    return this.request<NewsArticle[]>("/news");
  }

  async getNewsArticle(id: number): Promise<NewsArticle> {
    return this.request<NewsArticle>(`/news/${id}`);
  }

  async createNewsArticle(
    article: Omit<NewsArticle, "id" | "created_at" | "updated_at">
  ): Promise<NewsArticle> {
    return this.request<NewsArticle>("/news", {
      method: "POST",
      body: JSON.stringify(article),
    });
  }

  // Documents
  async getDocuments(): Promise<Document[]> {
    return this.request<Document[]>("/documents");
  }

  async getDocument(id: number): Promise<Document> {
    return this.request<Document>(`/documents/${id}`);
  }

  async uploadDocument(formData: FormData): Promise<Document> {
    return this.request<Document>("/documents/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  // Jobs
  async getJobs(): Promise<Job[]> {
    return this.request<Job[]>("/jobs");
  }

  async getJob(id: number): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`);
  }

  async createJob(
    job: Omit<Job, "id" | "created_at" | "updated_at">
  ): Promise<Job> {
    return this.request<Job>("/jobs", {
      method: "POST",
      body: JSON.stringify(job),
    });
  }

  // Traffic Data
  async getTrafficData(limit: number = 100): Promise<TrafficData[]> {
    return this.request<TrafficData[]>(`/traffic?limit=${limit}`);
  }

  async getTrafficStats(): Promise<{
    total_vehicles: number;
    avg_per_hour: number;
    peak_hour: string;
    locations: { location: string; count: number }[];
  }> {
    return this.request("/traffic/stats");
  }

  // Incidents
  async getIncidents(): Promise<Incident[]> {
    return this.request<Incident[]>("/incidents");
  }

  async getIncident(id: number): Promise<Incident> {
    return this.request<Incident>(`/incidents/${id}`);
  }

  async createIncident(
    incident: Omit<Incident, "id" | "created_at" | "updated_at">
  ): Promise<Incident> {
    return this.request<Incident>("/incidents", {
      method: "POST",
      body: JSON.stringify(incident),
    });
  }

  async updateIncident(
    id: number,
    incident: Partial<Incident>
  ): Promise<Incident> {
    return this.request<Incident>(`/incidents/${id}`, {
      method: "PUT",
      body: JSON.stringify(incident),
    });
  }

  // Contact form
  async submitContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message: string }> {
    return this.request("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Service orders
  async submitServiceOrder(data: {
    service_type: string;
    name: string;
    email: string;
    phone: string;
    details: Record<string, unknown>;
  }): Promise<{ success: boolean; message: string; order_id?: number }> {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export individual API functions for convenience
export const {
  login,
  register,
  getCurrentUser,
  logout,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getServices,
  getService,
  getTeamMembers,
  getTeamMember,
  getNews,
  getNewsArticle,
  createNewsArticle,
  getDocuments,
  getDocument,
  uploadDocument,
  getJobs,
  getJob,
  createJob,
  getTrafficData,
  getTrafficStats,
  getIncidents,
  getIncident,
  createIncident,
  updateIncident,
  submitContactForm,
  submitServiceOrder,
} = apiClient;
