import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserDTO } from '../types/allTypes';

interface AuthContextType {
  user: UserDTO | null;
  login: (token: string, user: UserDTO) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
  setUser: (data: any) => any;
  updateLocalStorage: (data: any) => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // Restaura o usuário
    }

    setLoading(false);
  }, []);

  const login = (token: string, userData: UserDTO) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateLocalStorage = (
    updatedData: Pick<
      UserDTO,
      'email' | 'nome_barbearia' | 'phone' | 'logo' | 'endereco'
    >
  ) => {
    let data = localStorage.getItem('user') as string;
    const storedUser = JSON.parse(data);
    storedUser.nome_barbearia = updatedData?.nome_barbearia;
    storedUser.email = updatedData?.email;
    storedUser.endereco = updatedData?.endereco;
    storedUser.phone = updatedData?.phone;
    storedUser.logo = updatedData?.logo;

    localStorage.setItem('user', JSON.stringify(storedUser));
  };

  const isAuthenticated = () => user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        loading,
        setUser,
        updateLocalStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
