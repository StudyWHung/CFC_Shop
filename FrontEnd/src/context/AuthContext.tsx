"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthResponse } from "@/types";
import { loginApi, registerApi, getProfileApi } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Khởi tạo trạng thái từ LocalStorage khi tải trang
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("cfc_token");
        const storedUser = localStorage.getItem("cfc_user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Thử lấy profile mới nhất từ server để kiểm tra token còn sống không
          try {
            const freshProfile = await getProfileApi();
            setUser(freshProfile);
            localStorage.setItem("cfc_user", JSON.stringify(freshProfile));
          } catch {
            // Token hết hạn
            logout();
          }
        }
      } catch (error) {
        console.error("Lỗi khi đọc LocalStorage cho Auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const saveAuthSession = (authData: AuthResponse) => {
    setToken(authData.token);
    const userData: User = {
      userId: authData.userId,
      email: authData.email,
      fullName: authData.fullName,
      roleName: authData.roleName,
    };
    setUser(userData);

    // Lưu vào LocalStorage
    localStorage.setItem("cfc_token", authData.token);
    localStorage.setItem("cfc_user", JSON.stringify(userData));
  };

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    saveAuthSession(data);
    setIsAuthModalOpen(false);
  };

  const register = async (email: string, password: string, fullName: string) => {
    const data = await registerApi(email, password, fullName);
    saveAuthSession(data);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("cfc_token");
    localStorage.removeItem("cfc_user");
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const isAdmin = user?.roleName?.toLowerCase() === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};
