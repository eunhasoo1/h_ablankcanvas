'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { X, Youtube, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// 페이지를 동적으로 설정
export const dynamic = 'force-dynamic';

interface VideoData {
  videoId: string;
  title: string;
}

export default function AdminPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [autoLoading, setAutoLoading] = useState(false);
  
  const router = useRouter();

  // 자동으로 최신 영상 가져오기
  const fetchLatestVideo = async () => {
    setAutoLoading(true);
    setMessage(null);

    try {
      // 직접 YouTube API 호출
      const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
      const CHANNEL_ID = 'UC5akXfOPHnMBz7Iqx5xi3Ug'; // Haeun 채널 ID
      
      if (!YOUTUBE_API_KEY) {
        setMessage({ 
          text: 'YouTube API 키가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_YOUTUBE_API_KEY를 설정해주세요.',
          type: 'error'
        });
        setAutoLoading(false);
        return;
      }
      
      // YouTube API 엔드포인트
      const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
      const params = new URLSearchParams({
        part: 'snippet',
        channelId: CHANNEL_ID,
        maxResults: '25',
        order: 'date',
        type: 'video',
        key: YOUTUBE_API_KEY
      });
      
      const youtubeResponse = await fetch(`${baseUrl}?${params}`);
      
      if (!youtubeResponse.ok) {
        const errorData = await youtubeResponse.json();
        throw new Error(`YouTube API 요청 실패: ${youtubeResponse.status}, ${errorData?.error?.message || ''}`);
      }
      
      const data = await youtubeResponse.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('채널에서 영상을 찾을 수 없습니다');
      }
      
      console.log(`총 ${data.items.length}개의 영상을 검색했습니다.`);
      
      // shorts와 live를 제외한 일반 영상 찾기
      const regularVideo = data.items.find((item: any) => {
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();
        
        // shorts 여부 확인 (간단하게)
        const isShort = 
          title.includes('shorts') || 
          title.includes('#short') || 
          description.includes('#shorts');
        
        // live 여부 확인 (간단하게)
        const isLive = 
          title.includes('live') || 
          title.includes('라이브') || 
          item.snippet.liveBroadcastContent === 'live';
          
        console.log(`영상 "${item.snippet.title}" : Short=${isShort}, Live=${isLive}`);
                      
        return !isShort && !isLive;
      });
      
      // 비디오 아이디와 제목 가져오기
      const videoData = regularVideo || data.items[0];
      const videoId = videoData.id.videoId;
      const title = videoData.snippet.title;
      
      console.log(`선택된 영상: ID=${videoId}, 제목="${title}"`);
      
      // localStorage에 직접 저장
      const newVideoData = {
        videoId,
        title,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('currentVideo', JSON.stringify(newVideoData));
      setCurrentVideo(newVideoData);
      setMessage({ text: '최신 영상을 성공적으로 가져왔습니다.', type: 'success' });
      router.refresh();
      
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : '서버 오류가 발생했습니다.', 
        type: 'error' 
      });
    } finally {
      setAutoLoading(false);
    }
  };

  // localStorage에서 현재 비디오 데이터 불러오기
  useEffect(() => {
    const savedVideoString = localStorage.getItem('currentVideo');
    if (savedVideoString) {
      try {
        const savedVideo = JSON.parse(savedVideoString);
        setCurrentVideo(savedVideo);
      } catch (e) {
        console.error('저장된 비디오 데이터 파싱 오류:', e);
      }
    } else {
      // 기본 비디오 데이터 설정
      const defaultVideo = {
        videoId: 'VwCgB7e3U5E', // 기본 영상 ID
        title: 'Breathing Animation that is NOT Boring',
        lastUpdated: new Date().toISOString()
      };
      
      setCurrentVideo(defaultVideo);
      localStorage.setItem('currentVideo', JSON.stringify(defaultVideo));
    }
  }, []);

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
        videoId = url.pathname.substring(1).split('?')[0];
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
      // localStorage에 직접 저장
      const newVideoData = {
        videoId,
        title: 'Latest Video',
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('currentVideo', JSON.stringify(newVideoData));
      setCurrentVideo(newVideoData);
      setMessage({ text: 'Video successfully updated.', type: 'success' });
      setVideoUrl('');
      router.refresh();
    } catch (error) {
      setMessage({ text: 'Error occurred while updating the video.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 유튜브 링크로 이동하는 함수
  const goToYoutubeLink = () => {
    if (currentVideo) {
      const youtubeLink = `https://www.youtube.com/watch?v=${currentVideo.videoId}`;
      window.open(youtubeLink, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header with back button */}
      <header className="flex justify-between items-center p-6 border-b border-[#333333]">
        <div>
          <Link href="/" className="text-white font-bold text-2xl leading-tight">
            <div>HA-</div>
            <div>EUN</div>
          </Link>
        </div>
        <div>
          <button
            onClick={() => router.push('/')}
            className="text-[#FEB902] hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row">
        {/* Left section - Current Video */}
        <div className="w-full md:w-1/2 p-6 border-r border-[#333333]">
          <h2 className="text-xl font-bold mb-6 text-[#FEB902]">현재 배경 영상</h2>
          
          {currentVideo && (
            <div className="mb-6">
              <h3 className="text-lg mb-2 text-white">{currentVideo.title}</h3>
              <div className="relative pt-[56.25%] rounded overflow-hidden bg-[#111]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${currentVideo.videoId}`}
                  title={currentVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <button 
                className="mt-4 flex items-center text-[#FEB902] hover:text-white transition-colors"
                onClick={goToYoutubeLink}
              >
                <Youtube size={16} className="mr-2" />
                YouTube에서 보기
                <ArrowUpRight size={14} className="ml-1" />
              </button>
            </div>
          )}
        </div>

        {/* Right section - Forms */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-xl font-bold mb-6 text-[#FEB902]">배경 영상 관리</h2>
          
          {/* Auto Fetch Button */}
          <div className="mb-8 border border-[#FEB902] p-6">
            <h3 className="text-lg mb-4 text-white">자동 최신 영상 가져오기</h3>
            <button
              onClick={fetchLatestVideo}
              disabled={autoLoading}
              className={`w-full py-3 px-4 bg-[#FEB902] text-black font-medium hover:bg-[#FEB902]/80 transition-colors ${
                autoLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {autoLoading ? '처리 중...' : '채널에서 최신 영상 자동으로 가져오기'}
            </button>
            
            <p className="text-xs text-gray-400 mt-4">
              shorts와 live를 제외한 채널의 최신 영상을 자동으로 가져옵니다.
            </p>
          </div>
          
          {/* Manual URL Input */}
          <div className="mb-6 border border-white p-6">
            <h3 className="text-lg mb-4 text-white">수동으로 영상 입력하기</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="videoUrl" className="block text-sm text-gray-300 mb-2">
                  YouTube Video URL
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 bg-[#111] border border-[#333] text-white rounded-none focus:outline-none focus:border-[#FEB902]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-white text-black font-medium hover:bg-gray-200 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Processing...' : '영상 직접 업데이트'}
              </button>
            </form>
          </div>
          
          {/* Success/Error Messages */}
          {message && (
            <div 
              className={`p-4 mt-4 border ${
                message.type === 'success' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-[#333333] p-6 text-center">
        <p className="text-xs text-gray-500">
          홈 화면의 영상을 관리합니다. 유튜브 API 키가 환경 변수 NEXT_PUBLIC_YOUTUBE_API_KEY에 설정되어 있어야 합니다.
        </p>
      </footer>
    </div>
  );
} 