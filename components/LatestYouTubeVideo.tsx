// components/LatestYouTubeVideo.tsx
"use client";
import { useState, useEffect } from 'react';

interface VideoData {
  videoId: string;
  title: string;
  publishedAt: string;
}

interface LatestYouTubeVideoProps {
  channelId: string;
}

export default function LatestYouTubeVideo({ channelId }: LatestYouTubeVideoProps) {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestVideo() {
      try {
        const response = await fetch(`/api/youtube/latest?channelId=${channelId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video data');
        }
        const data: VideoData = await response.json();
        setVideo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다');
      } finally {
        setLoading(false);
      }
    }

    fetchLatestVideo();
  }, [channelId]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8">
        <div className="aspect-video bg-gray-100 animate-pulse rounded-3xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-8 text-red-500 text-center">
        {error}
      </div>
    );
  }

  if (!video) return null;

  return (
    <div className="w-full max-w-5xl mx-auto ">
      <p className='mt-10 sm:mt-16 pl-2 flex items-center text-center 
          font-marydale text-lg sm:text-2xl'>
          Latest
      </p>
      <div className="aspect-video mt-1">
        <iframe
          className="w-full h-full rounded-3xl"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {/* <h2 className="mt-4 text-xl font-semibold text-gray-800">{video.title}</h2>
      <p className="mt-2 text-gray-600">{video.publishedAt}</p> */}
    </div>
  );
}
