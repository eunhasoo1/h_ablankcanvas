'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LogoutPage() {
  const [message, setMessage] = useState<string>('로그아웃 중...');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signOut, isAuthenticated } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        if (isAuthenticated) {
          await signOut();
          setMessage('성공적으로 로그아웃되었습니다.');
        } else {
          setMessage('이미 로그아웃된 상태입니다.');
        }
      } catch (err) {
        console.error('로그아웃 오류:', err);
        setError('로그아웃 중 오류가 발생했습니다.');
      }
    };

    performLogout();
  }, [signOut, isAuthenticated]);

  // 수동 로그아웃 (로컬 스토리지 직접 정리)
  const handleManualLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        // Supabase 관련 로컬 스토리지 항목 제거
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.expires_at');
        localStorage.removeItem('supabase.auth.refresh_token');
        
        // 페이지 새로고침
        setMessage('로컬 스토리지를 정리했습니다. 잠시 후 홈페이지로 이동합니다.');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (e) {
      setError('수동 로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4">로그아웃</h1>
        
        {error ? (
          <div className="p-4 mb-4 bg-red-100 text-red-800 rounded">
            <p>{error}</p>
            <button
              onClick={handleManualLogout}
              className="mt-4 w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
            >
              강제 로그아웃 시도
            </button>
          </div>
        ) : (
          <div className="p-4 mb-4 bg-green-100 text-green-800 rounded">
            <p>{message}</p>
          </div>
        )}
        
        <div className="mt-6 flex flex-col gap-4">
          <Link
            href="/login"
            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            로그인 페이지로 이동
          </Link>
          
          <Link
            href="/"
            className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            홈페이지로 이동
          </Link>
        </div>
      </div>
    </div>
  );
} 