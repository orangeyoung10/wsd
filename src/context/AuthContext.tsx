import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types';

export const DEMO_USERS: UserAccount[] = [
  {
    id: 'usr-001',
    username: 'auditor_lead',
    name: '张建国',
    role: 'SENIOR_AUDITOR',
    role_name: '高级风控审核官',
    department: '华东风控运营中心 · 审核二组',
    phone: '138****6688',
    email: 'zhang.jianguo@maap-audit.com',
    last_login: '2026-09-12 18:30:22',
  },
  {
    id: 'usr-002',
    username: 'auditor_junior',
    name: '李晓萌',
    role: 'AUDITOR',
    role_name: '进件初审专员',
    department: '商户接入运营中心 · 初审组',
    phone: '139****2233',
    email: 'li.xiaomeng@maap-audit.com',
    last_login: '2026-09-12 17:15:10',
  },
  {
    id: 'usr-003',
    username: 'admin',
    name: '陈管理员',
    role: 'ADMIN',
    role_name: '系统安全管理员',
    department: '科技与风险合规中台部',
    phone: '186****9988',
    email: 'admin@maap-audit.com',
    last_login: '2026-09-12 19:00:01',
  },
];

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  login: (username: string, password?: string) => boolean;
  quickLogin: (user: UserAccount) => void;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updated: Partial<UserAccount>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'maap_auth_user_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse cached auth state:', e);
    }
    // Default to the first demo user logged in for convenience, but full login/logout flows are supported
    return DEMO_USERS[0];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (username: string): boolean => {
    const matched = DEMO_USERS.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() || u.name === username
    );
    if (matched) {
      setCurrentUser(matched);
      return true;
    }
    // Default fallback create
    const defaultUser: UserAccount = {
      id: `usr-${Date.now()}`,
      username: username || 'auditor_user',
      name: username || '审核专员',
      role: 'AUDITOR',
      role_name: '风控审核专员',
      department: '风控运营中心',
      phone: '138****0000',
      email: `${username}@maap-audit.com`,
      last_login: new Date().toLocaleString(),
    };
    setCurrentUser(defaultUser);
    return true;
  };

  const quickLogin = (user: UserAccount) => {
    setCurrentUser({
      ...user,
      last_login: new Date().toLocaleString(),
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const switchUser = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const updateProfile = (updated: Partial<UserAccount>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        quickLogin,
        logout,
        switchUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
