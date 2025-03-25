'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [currentVideo, setCurrentVideo] = useState<{ videoId: string; title: string } | null>(null);
  
  const router = useRouter();
  const { isAuthenticated, isLoading, isAdminUser, signOut } = useAuth();

  // 인증 및 관리자 권한 확인
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (!isAdminUser) {
        signOut().then(() => {
          router.push('/login');
        });
      }
    }
  }, [isLoading, isAuthenticated, isAdminUser, router, signOut]);

  useEffect(() => {
    // 현재 설정된 비디오 데이터 가져오기
    const fetchCurrentVideo = async () => {
      try {
        const res = await fetch('/api/admin/video');
        if (res.ok) {
          const data = await res.json();
          setCurrentVideo(data);
        }
      } catch (error) {
        console.error('Error fetching current video:', error);
      }
    };

    // 로그인 및 관리자 권한이 확인된 경우에만 데이터 불러오기
    if (isAuthenticated && isAdminUser && !isLoading) {
      fetchCurrentVideo();
    }
  }, [isAuthenticated, isAdminUser, isLoading]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!videoUrl.trim()) {
      setMessage({ text: 'Please enter a valid YouTube URL.', type: 'error' });
      return;
    }

    // Extract YouTube video ID
    let videoId = '';
    try {
      const url = new URL(videoUrl);
      if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
        videoId = url.searchParams.get('v') || '';
      } else if (url.hostname === 'youtu.be') {
        videoId = url.pathname.substring(1);
      }
    } catch (error) {
      setMessage({ text: 'Please enter a valid URL.', type: 'error' });
      return;
    }

    if (!videoId) {
      setMessage({ text: 'Could not extract YouTube video ID.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          title: 'Latest Video'
        }),
      });

      if (res.ok) {
        setMessage({ text: 'Video successfully updated.', type: 'success' });
        setVideoUrl('');
        router.refresh();
        
        // 현재 비디오 정보 업데이트
        const data = await res.json();
        setCurrentVideo(data);
      } else {
        const error = await res.json();
        setMessage({ text: error.error || 'Error occurred while updating the video.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Server error occurred.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중이거나 권한 확인 중인 경우
  if (isLoading || (isAuthenticated && !isAdminUser)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-4 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // 권한이 없는 경우 (이미 리디렉션 중)
  if (!isAuthenticated || !isAdminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => signOut().then(() => router.push('/login'))}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Logout
            </button>
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {currentVideo && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Current video:</h2>
            <p className="text-gray-800 font-medium">{currentVideo.title}</p>
            <div className="mt-2 relative pt-[56.25%] rounded overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${currentVideo.videoId}`}
                title={currentVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Video URL
            </label>
            <input
              type="text"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {message && (
            <div 
              className={`p-3 mb-4 rounded ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Update Video'}
          </button>
        </form>
      </div>
    </div>
  );
} 