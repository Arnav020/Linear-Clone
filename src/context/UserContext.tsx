'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, Database } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type User = Database['public']['Tables']['users']['Row'];

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check local storage for existing session
    const storedUserId = localStorage.getItem('linear_clone_user_id');
    if (storedUserId) {
      fetchUser(storedUserId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (data && !error) {
        setUser(data);
      } else {
        localStorage.removeItem('linear_clone_user_id');
      }
    } catch (error) {
      console.error('Error restoring session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (data && !error) {
        const user = data as User;
        setUser(user);
        localStorage.setItem('linear_clone_user_id', user.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('linear_clone_user_id');
    router.push('/');
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
