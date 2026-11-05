import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiRequest, tokenStore } from '@/lib/api';
import type { AuthResponse, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fields: { fullName: string; email: string; password: string; university: string; location: string }) => Promise<void>;
  signOut: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tokenStore.get()) {
      setLoading(false);
      return;
    }
    apiRequest<User>('/users/me')
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const storeSession = useCallback((response: AuthResponse) => {
    tokenStore.set(response.token);
    setUser(response.user);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    storeSession(await apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: { email, password } }));
  }, [storeSession]);

  const signUp = useCallback(async (fields: { fullName: string; email: string; password: string; university: string; location: string }) => {
    storeSession(await apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: fields }));
  }, [storeSession]);

  const signOut = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, setUser }),
    [user, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
