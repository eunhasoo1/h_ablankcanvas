'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // 관리자 페이지로 자동 리디렉션
    router.push('/admin');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Redirecting...</h2>
          <p className="mt-2 text-sm text-gray-600">
            You are being redirected to the admin page
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/admin" className="text-sm text-blue-600 hover:text-blue-500">
            Click here if you are not redirected automatically
          </Link>
        </div>
      </div>
    </div>
  );
} 