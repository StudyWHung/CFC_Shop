import axios from "axios";
import {
  Product,
  Category,
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  AuthResponse,
  User,
  CreateOrderInput,
  OrderResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Tự động đính kèm Bearer Token từ LocalStorage
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("cfc_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi tập trung
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      console.warn("Phiên đăng nhập đã hết hạn.");
    }
    return Promise.reject(error);
  }
);

// === PRODUCT APIS ===
export const getProducts = async (params?: { categoryId?: number; search?: string }): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>("/products", { params });
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: CreateProductInput): Promise<Product> => {
  const response = await apiClient.post<Product>("/products", data);
  return response.data;
};

export const updateProduct = async (id: number, data: UpdateProductInput): Promise<void> => {
  await apiClient.put(`/products/${id}`, data);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

// === CATEGORY APIS ===
export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>("/categories");
  return response.data;
};

export const createCategory = async (data: CreateCategoryInput): Promise<Category> => {
  const response = await apiClient.post<Category>("/categories", data);
  return response.data;
};

// === AUTH APIS ===
export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
};

export const registerApi = async (email: string, password: string, fullName: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/register", { email, password, fullName });
  return response.data;
};

export const getProfileApi = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
};

// === ORDER APIS ===
export const createOrderApi = async (data: CreateOrderInput): Promise<OrderResponse> => {
  const response = await apiClient.post<OrderResponse>("/orders", data);
  return response.data;
};

export const getOrdersApi = async (): Promise<OrderResponse[]> => {
  const response = await apiClient.get<OrderResponse[]>("/orders");
  return response.data;
};
