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
      
      let data = await youtubeResponse.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('채널에서 영상을 찾을 수 없습니다');
      }
      
      console.log(`총 ${data.items.length}개의 영상을 검색했습니다.`);
      
      // 알려진 shorts 영상 스킵 목록 - 정확히 알고 있는 shorts 영상
      const knownShorts = ['MZVUL8i4OYA']; // 'Final episode' 영상 ID
      
      // shorts와 live를 제외한 일반 영상 찾기
      let regularVideo = data.items.find((item: any) => {
        const title = item.snippet.title.toLowerCase();
        const description = item.snippet.description.toLowerCase();
        const videoId = item.id.videoId;
        
        // 알려진 shorts 목록에 있는지 확인
        if (knownShorts.includes(videoId)) {
          console.log(`영상 "${item.snippet.title}" ID=${videoId}: 알려진 shorts 영상으로 건너뜁니다.`);
          return false;
        }
        
        // shorts 여부 확인 (더 정확하게)
        // YouTube Shorts는 일반적으로 세로 방향 비디오(9:16 비율)이고 길이가 60초 이하
        // 제목이나 설명에 #shorts, #쇼츠 태그가 있는지 확인
        const isShort = 
          title.includes('shorts') || 
          title.includes('#short') || 
          description.includes('#shorts') ||
          title.includes('#쇼츠') ||
          description.includes('#쇼츠') ||
          item.snippet.title.includes('#Shorts');
        
        // live 여부 확인 (더 정확하게)
        const isLive = 
          title.includes('live') || 
          title.includes('라이브') || 
          title.includes('LIVE') ||
          item.snippet.liveBroadcastContent === 'live' ||
          item.snippet.liveBroadcastContent === 'upcoming';
        
        // Can Animation be LIVE? | Cloud Final Episode 는 shorts가 아니고 live가 아닌 일반 영상으로 표시
        const isSpecialCase = item.snippet.title === "Can Animation be LIVE? | Cloud Final Episode";
        if (isSpecialCase) {
          console.log(`영상 "${item.snippet.title}" ID=${videoId}: 특수 케이스로 처리합니다.`);
          return true;
        }
        
        console.log(`영상 "${item.snippet.title}" ID=${videoId}: Short=${isShort}, Live=${isLive}`);
                      
        return !isShort && !isLive;
      });
      
      // 필터링된 영상이 없으면 최대 25개까지 검색
      if (!regularVideo && data.pageInfo && data.pageInfo.totalResults > 25) {
        setMessage({ 
          text: '최근 25개 영상 중 shorts나 live가 아닌 영상을 찾을 수 없습니다. 더 많은 영상을 검색합니다.', 
          type: 'success' 
        });
        
        // 더 많은 영상 검색
        const moreParams = new URLSearchParams({
          part: 'snippet',
          channelId: CHANNEL_ID,
          maxResults: '50',  // 최대값으로 설정
          order: 'date',
          type: 'video',
          key: YOUTUBE_API_KEY
        });
        
        const moreResponse = await fetch(`${baseUrl}?${moreParams}`);
        if (moreResponse.ok) {
          const moreData = await moreResponse.json();
          
          if (moreData.items && moreData.items.length > 0) {
            // 더 많은 영상에서 shorts/live 아닌 것 찾기
            const moreRegularVideo = moreData.items.find((item: any) => {
              const title = item.snippet.title.toLowerCase();
              const description = item.snippet.description.toLowerCase();
              const videoId = item.id.videoId;
              
              // 알려진 shorts 목록에 있는지 확인
              if (knownShorts.includes(videoId)) {
                console.log(`영상 "${item.snippet.title}" ID=${videoId}: 알려진 shorts 영상으로 건너뜁니다.`);
                return false;
              }
              
              const isShort = 
                title.includes('shorts') || 
                title.includes('#short') || 
                description.includes('#shorts') ||
                title.includes('#쇼츠') ||
                description.includes('#쇼츠') ||
                item.snippet.title.includes('#Shorts');
              
              const isLive = 
                title.includes('live') || 
                title.includes('라이브') || 
                title.includes('LIVE') ||
                item.snippet.liveBroadcastContent === 'live' ||
                item.snippet.liveBroadcastContent === 'upcoming';
                
              console.log(`영상 "${item.snippet.title}" ID=${videoId}: Short=${isShort}, Live=${isLive}`);
              
              return !isShort && !isLive;
            });
            
            if (moreRegularVideo) {
              data = moreData;
              regularVideo = moreRegularVideo;
            }
          }
        }
      }
      
      // 동영상 ID 얻기
      const videoId = regularVideo ? regularVideo.id.videoId : (data.items[0] && data.items[0].id.videoId);

      if (videoId) {
        try {
          // 비디오 상세 정보 가져오기 (추가 검증용)
          const videoDetailsUrl = 'https://www.googleapis.com/youtube/v3/videos';
          const videoDetailsParams = new URLSearchParams({
            part: 'snippet,contentDetails',
            id: videoId,
            key: YOUTUBE_API_KEY
          });
          
          const videoDetailsResponse = await fetch(`${videoDetailsUrl}?${videoDetailsParams}`);
          
          if (videoDetailsResponse.ok) {
            const videoDetails = await videoDetailsResponse.json();
            
            if (videoDetails.items && videoDetails.items.length > 0) {
              const detailedVideo = videoDetails.items[0];
              
              // YouTube API에서는 Shorts를 직접적으로 표시하는 필드가 없지만
              // 일반적으로 Shorts는 세로 형식(9:16)이고 60초 이하
              // contentDetails.duration은 ISO 8601 형식 (예: PT30S - 30초)
              const duration = detailedVideo.contentDetails.duration;
              
              // 영상 길이 파싱 (PT1M30S 같은 ISO 8601 형식 파싱)
              let seconds = 0;
              const minutesMatch = duration.match(/(\d+)M/);
              const secondsMatch = duration.match(/(\d+)S/);
              
              if (minutesMatch) seconds += parseInt(minutesMatch[1]) * 60;
              if (secondsMatch) seconds += parseInt(secondsMatch[1]);
              
              const isShortsLength = seconds <= 60;
              console.log(`영상 상세정보 - ID: ${videoId}, 제목: "${detailedVideo.snippet.title}", 길이: ${duration} (${seconds}초), Shorts 길이 여부: ${isShortsLength}`);
              
              if (isShortsLength && knownShorts.includes(videoId)) {
                console.log(`경고: 영상 ${videoId}는 길이(${seconds}초)가 짧아 Short일 가능성이 높지만, 검증을 위해 다시 확인합니다.`);
                // Short로 의심되는 경우 다음 영상 사용
                if (data.items.length > 1) {
                  const nextRegularVideo = data.items.find((item: any, index: number) => {
                    if (item.id.videoId === videoId) return false; // 현재 영상 제외
                    
                    const title = item.snippet.title.toLowerCase();
                    const description = item.snippet.description.toLowerCase();
                    
                    const isShort = 
                      title.includes('shorts') || 
                      title.includes('#short') || 
                      description.includes('#shorts') ||
                      title.includes('#쇼츠') ||
                      description.includes('#쇼츠') ||
                      item.snippet.title.includes('#Shorts') ||
                      knownShorts.includes(item.id.videoId);
                    
                    const isLive = 
                      title.includes('live') || 
                      title.includes('라이브') || 
                      title.includes('LIVE') ||
                      item.snippet.liveBroadcastContent === 'live' ||
                      item.snippet.liveBroadcastContent === 'upcoming';
                    
                    return !isShort && !isLive;
                  });
                  
                  if (nextRegularVideo) {
                    console.log(`Short로 의심되는 영상 대신 다음 영상 사용: "${nextRegularVideo.snippet.title}"`);
                    regularVideo = nextRegularVideo;
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('비디오 상세 정보 확인 중 오류 발생:', error);
        }
      }
      
      // 여전히 영상을 찾지 못했다면, 첫 번째 영상 사용
      if (!regularVideo && (!data.items || data.items.length === 0)) {
        throw new Error('채널에서 영상을 찾을 수 없습니다');
      }
      
      // 비디오 아이디와 제목 가져오기
      const videoData = regularVideo || data.items[0];
      const finalVideoId = videoData.id.videoId;
      const title = videoData.snippet.title;
      
      // shorts나 live가 아닌 영상을 찾지 못한 경우 경고
      if (!regularVideo) {
        console.warn('shorts나 live가 아닌 영상을 찾지 못했습니다. 첫 번째 영상을 사용합니다.');
      }
      
      console.log(`선택된 영상: ID=${finalVideoId}, 제목="${title}"`);
      
      // localStorage에 직접 저장
      const newVideoData = {
        videoId: finalVideoId,
        title,
        lastUpdated: new Date().toISOString()
      };
      
      console.log('저장할 새 영상 데이터:', newVideoData);
      
      // 로컬 스토리지에 저장하고 상태 업데이트
      localStorage.setItem('currentVideo', JSON.stringify(newVideoData));
      setCurrentVideo(newVideoData);
      setMessage({ text: '최신 영상을 성공적으로 가져왔습니다.', type: 'success' });
      
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
        console.log('localStorage에서 불러온 영상 데이터:', savedVideo);
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
      
      console.log('기본 영상 데이터 설정:', defaultVideo);
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
      // YouTube API로 영상 제목 가져오기
      const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
      
      if (!YOUTUBE_API_KEY) {
        throw new Error('YouTube API 키가 설정되지 않았습니다.');
      }
      
      // YouTube API 엔드포인트
      const baseUrl = 'https://www.googleapis.com/youtube/v3/videos';
      const params = new URLSearchParams({
        part: 'snippet',
        id: videoId,
        key: YOUTUBE_API_KEY
      });
      
      const youtubeResponse = await fetch(`${baseUrl}?${params}`);
      
      if (!youtubeResponse.ok) {
        throw new Error('동영상 정보를 가져오지 못했습니다.');
      }
      
      const data = await youtubeResponse.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('동영상 정보를 찾을 수 없습니다.');
      }
      
      const title = data.items[0].snippet.title;
      
      // localStorage에 직접 저장
      const newVideoData = {
        videoId,
        title, // API에서 가져온 실제 영상 제목
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('currentVideo', JSON.stringify(newVideoData));
      setCurrentVideo(newVideoData);
      setMessage({ text: 'Video successfully updated.', type: 'success' });
      setVideoUrl('');
      
    } catch (error) {
      // API 호출에 실패한 경우에도 영상은 업데이트하되, 'Latest Video'라는 제목 사용
      const newVideoData = {
        videoId,
        title: 'Latest Video', // API 실패 시 기본 제목
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('currentVideo', JSON.stringify(newVideoData));
      setCurrentVideo(newVideoData);
      
      setMessage({ 
        text: `영상이 업데이트되었지만, 제목을 가져오는 데 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, 
        type: 'error' 
      });
      setVideoUrl('');
      
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
          
          {/* Auto Fetch Button - 주석 처리 및 설명 추가 */}
          <div className="mb-8 border border-[#FEB902] p-6">
            <h3 className="text-lg mb-4 text-white">자동 최신 영상 가져오기</h3>
            <p className="text-sm text-gray-400 mb-4">
              YouTube API에서 Shorts와 일반 영상을 정확히 구분하기 어려워 자동 기능이 비활성화되었습니다. 
              대신 수동으로 URL을 입력하여 원하는 영상을 설정해주세요.
            </p>
            {/* 
            <button
              onClick={fetchLatestVideo}
              disabled={autoLoading}
              className={`w-full py-3 px-4 bg-[#FEB902] text-black font-medium hover:bg-[#FEB902]/80 transition-colors ${
                autoLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {autoLoading ? '처리 중...' : '채널에서 최신 영상 자동으로 가져오기'}
            </button>
            */}
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