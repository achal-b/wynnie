"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Types
interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helpers for localStorage
const FAKE_USER_KEY = "fake_auth_user";
const FAKE_USER_DB_KEY = "fake_auth_user_db";

function getStoredUser(): User | null {
  const user = localStorage.getItem(FAKE_USER_KEY);
  return user ? JSON.parse(user) : null;
}

function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(FAKE_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(FAKE_USER_KEY);
  }
}

function getUserDB(): Record<
  string,
  { name: string; email: string; password: string }
> {
  const db = localStorage.getItem(FAKE_USER_DB_KEY);
  return db ? JSON.parse(db) : {};
}

function setUserDB(
  db: Record<string, { name: string; email: string; password: string }>
) {
  localStorage.setItem(FAKE_USER_DB_KEY, JSON.stringify(db));
}

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const db = getUserDB();
    if (db[email]) return false; // User already exists
    db[email] = { name, email, password };
    setUserDB(db);
    setStoredUser({ name, email });
    setUser({ name, email });
    return true;
  };

  const login = async (email: string, password: string) => {
    const db = getUserDB();
    const record = db[email];
    if (record && record.password === password) {
      setStoredUser({ name: record.name, email });
      setUser({ name: record.name, email });
      return true;
    }
    return false;
  };

  const logout = () => {
    setStoredUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
