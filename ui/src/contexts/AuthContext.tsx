import React, { createContext, useContext, useState } from "react";
import { TokenResponse } from "../api/client";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  joinedAt: Date;
}

interface AuthContextType {
  user: User | null;
  initialize: () => boolean;
  setLoggedUser: (tokenResponse: TokenResponse) => void;
  removeLoggedUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const initialize = (): boolean => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      return true;
    } else {
      return false;
    }
  };

  const setLoggedUser = (tokenResponse: TokenResponse) => {
    const user: User = {
      id: tokenResponse.id || "",
      email: tokenResponse.email || "",
      name: tokenResponse.userName || "",
      joinedAt: new Date(),
    };
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const removeLoggedUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initialize,
        setLoggedUser,
        removeLoggedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
