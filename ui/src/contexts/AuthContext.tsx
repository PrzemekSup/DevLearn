import React, { createContext, useContext, useState, useEffect } from "react";
import { TokenResponse } from "../api/client";

interface User {
  id: string;
  name: string;
  avatar?: string;
  joinedAt: Date;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  setLoggedUser: (tokenResponse: TokenResponse) => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const setLoggedUser = (tokenResponse: TokenResponse) => {
    const user: User = {
      id: tokenResponse.userName || "",
      name: tokenResponse.userName || "",
      accessToken: tokenResponse.accessToken || "",
      refreshToken: tokenResponse.refreshToken || "",
      joinedAt: new Date(),
    };
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Date.now().toString(),
      name,
      joinedAt: new Date(),
      accessToken: "",
      refreshToken: "",
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setLoggedUser,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
