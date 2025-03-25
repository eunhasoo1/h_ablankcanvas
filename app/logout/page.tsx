'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // 홈페이지로 자동 리디렉션
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        
        <div className="p-4 mb-4 bg-green-100 text-green-800 rounded">
          <p>You are being redirected to the home page</p>
        </div>
        
        <div className="mt-6 flex flex-col gap-4">
          <Link
            href="/"
            className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Click here if you are not redirected automatically
          </Link>
        </div>
      </div>
    </div>
  );
} 