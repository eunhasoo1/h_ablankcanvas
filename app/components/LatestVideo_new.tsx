'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Message from './Message';
import Image from 'next/image';

interface VideoData {
  videoId: string;
  title: string;
}

interface ErrorData {
  error: string;
}

export default function LatestVideo() {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // 타임스탬프로 캐싱 방지
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/latest-video?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!res.ok) {
          const errorData = await res.json() as ErrorData;
          throw new Error(errorData.error || 'Failed to fetch video');
        }
        const data: VideoData = await res.json();
        setVideo(data);
      } catch (err: any) {
        console.error('Error fetching latest video:', err);
        setError(err?.message || 'Unknown error occurred');
      }
    };
  
    fetchVideo();
    // 1분마다 새로고침
    const interval = setInterval(fetchVideo, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="w-full">
        <div className="relative pb-[56.25%] h-0 bg-red-50 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col">
        {!video ? (
          <div className="relative pb-[56.25%] h-0 overflow-hidden bg-gray-100">
            <div className="absolute inset-0 animate-pulse">
              <div className="w-full h-full bg-gray-200" />
            </div>
          </div>
        ) : (
          <a 
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative pb-[56.25%] h-0 overflow-hidden group"
          >
            {/* <iframe
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              src={`https://www.youtube-nocookie.com/embed/${video.videoId}?modestbranding=1&rel=0&playsinline=1`}
              title={video.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy" */}
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
              alt={video.title}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Image 
                src="/image/youtubeicon.png" 
                alt="YouTube" 
                width={64} 
                height={64} 
                className="w-12 h-12"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </a>
        )}
      </div>
    </div>
  );
} 