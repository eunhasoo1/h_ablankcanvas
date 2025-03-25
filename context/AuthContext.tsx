'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, isAdmin } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdminUser: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    // 초기 세션 가져오기
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const adminStatus = await isAdmin(session.user.id);
        setIsAdminUser(adminStatus);
      }
      
      setIsLoading(false);
    };

    getSession();

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const adminStatus = await isAdmin(session.user.id);
        setIsAdminUser(adminStatus);
      } else {
        setIsAdminUser(false);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      // 전역 로그아웃 대신 범위를 local로 제한
      await supabase.auth.signOut({ scope: 'local' });
      
      // 상태 초기화 (이중 안전장치)
      setUser(null);
      setSession(null);
      setIsAdminUser(false);
      
      // 로컬 스토리지에서 Supabase 관련 모든 항목 직접 제거
      if (typeof window !== 'undefined') {
        // 기존 항목들
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.expires_at');
        
        // 추가 Supabase 항목들
        localStorage.removeItem('supabase.auth.refresh_token');
        localStorage.removeItem('supabase.auth.access_token');
        
        // 현재 Supabase 버전에 맞는 로컬 스토리지 키
        for (const key of Object.keys(localStorage)) {
          if (key.startsWith('sb-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        }
        
        // 세션 및 쿠키 관련 작업
        document.cookie.split(';').forEach(cookie => {
          const trimmedCookie = cookie.trim();
          const cookieName = trimmedCookie.split('=')[0];
          if (cookieName.includes('supabase') || cookieName.includes('sb-')) {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }
        });
        
        // 세션 스토리지도 정리
        sessionStorage.clear();
      }
      
      console.log('로그아웃 성공 - 모든 인증 데이터 정리됨');
      
      // 완전한 새로고침을 통해 앱 상태 초기화 (선택적)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      
      // 오류 발생해도 상태는 초기화
      setUser(null);
      setSession(null);
      setIsAdminUser(false);
      
      // 오류 발생 시에도 강제 리디렉션
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isAdminUser,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 