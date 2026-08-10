export interface Role {
  roleId: number;
  roleName: string;
}

export interface User {
  userId: number;
  email: string;
  fullName: string;
  roleName: string;
  createdAt?: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
}

export interface Product {
  productId: number;
  productCode: string;
  productName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId: number;
  categoryName: string;
  createdAt?: string;
}

export interface CreateProductInput {
  productCode: string;
  productName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId: number;
}

export interface UpdateProductInput {
  productCode: string;
  productName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId: number;
}

export interface CreateCategoryInput {
  categoryName: string;
  description?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  fullName: string;
  roleName: string;
  expiresAt: string;
}

export interface CartItem {
  productId: number;
  productCode: string;
  productName: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  stockQuantity: number;
  categoryName?: string;
}
