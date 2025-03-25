'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signIn, isAuthenticated, isAdminUser, isLoading, signOut } = useAuth();
  const router = useRouter();

  // 이미 로그인한 경우 적절한 페이지로 리디렉션 (useEffect로 이동)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (isAdminUser) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, isAdminUser, isLoading, router]);

  // 수동 로그아웃 함수
  const handleForceSignOut = async () => {
    try {
      await signOut();
      // 페이지 새로고침
      window.location.reload();
    } catch (err) {
      console.error('수동 로그아웃 실패:', err);
      setError('로그아웃 중 오류가 발생했습니다. 브라우저 캐시를 지우고 다시 시도해주세요.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError('Login failed. Please check your email and password.');
      } else {
        // 로그인 성공 시, 관리자 여부 확인 후 적절한 페이지로 리다이렉션
        console.log('로그인 성공! 관리자 권한 확인 중...');
        
        // 최대 5초 후에는 홈으로 이동 (백업 메커니즘)
        const redirectTimer = setTimeout(() => {
          console.log('타임아웃 발생, 홈으로 리다이렉션');
          router.push('/');
        }, 5000);
        
        // 관리자 상태 확인을 위한 폴링 (더 짧은 간격으로)
        let checkCount = 0;
        const maxChecks = 20; // 최대 20회 시도
        
        const checkAdminStatus = setInterval(() => {
          checkCount++;
          console.log(`관리자 상태 확인 중... (${checkCount}/${maxChecks})`, { 
            isAuthenticated, 
            isAdminUser,
            isLoading 
          });
          
          // 로딩이 완료되었고 인증 상태가 업데이트된 경우
          if (!isLoading && isAuthenticated) {
            clearInterval(checkAdminStatus);
            clearTimeout(redirectTimer);
            
            if (isAdminUser) {
              console.log('관리자 권한 확인됨, 관리자 페이지로 이동');
              router.push('/admin');
            } else {
              console.log('관리자 권한 없음, 홈으로 이동');
              router.push('/');
            }
          }
          
          // 최대 시도 횟수 초과 시 중단
          if (checkCount >= maxChecks) {
            console.log('최대 시도 횟수 초과, 확인 중단');
            clearInterval(checkAdminStatus);
            // 타임아웃 리다이렉션은 여전히 실행됨
          }
        }, 250); // 250ms마다 확인 (더 자주)
      }
    } catch (err) {
      setError('An error occurred during login process.');
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중이거나 이미 인증된 경우 로딩 표시
  if (isLoading || (isAuthenticated && !error)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access the admin panel
          </p>
        </div>
        
        {isAuthenticated && (
          <div className="mb-6 p-3 bg-yellow-100 text-yellow-800 rounded">
            <p className="mb-2">이미 로그인되어 있습니다. 다른 계정으로 로그인하려면 먼저 로그아웃하세요.</p>
            <button
              onClick={handleForceSignOut}
              className="w-full mt-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              강제 로그아웃
            </button>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
            Back to main page
          </Link>
        </div>
      </div>
    </div>
  );
} 