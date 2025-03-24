import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UC5akXfOPHnMBz7Iqx5xi3Ug';
const dataFilePath = path.join(process.cwd(), 'app/data/videoData.json');

interface PlaylistItem {
  snippet: {
    resourceId: {
      videoId: string;
    };
    title: string;
    description: string;
  };
}

// 비디오 데이터 읽기 함수
async function readVideoData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading video data:', error);
    return null;
  }
}

export async function GET() {
  try {
    // 1. 파일에서 관리자가 설정한 비디오 정보 읽기
    const savedVideoData = await readVideoData();
    
    // 2. 관리자가 설정한 비디오가 있으면 해당 정보 반환
    if (savedVideoData && savedVideoData.videoId) {
      return NextResponse.json({
        videoId: savedVideoData.videoId,
        title: savedVideoData.title || 'Latest Video'
      });
    }
    
    // 3. 관리자가 설정한 비디오가 없으면 YouTube API로 가져오기 (기존 로직)
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key is not configured' },
        { status: 500 }
      );
    }

    // 기존 YouTube API 호출 로직
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelResponse.json();
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
    );
    const playlistData = await playlistResponse.json();

    const videoIds = playlistData.items.map((item: PlaylistItem) => item.snippet.resourceId.videoId).join(',');
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    const youtubeVideoData = await videoResponse.json();

    const latestNonShortVideo = playlistData.items.find((item: PlaylistItem, index: number) => {
      const videoDetails = youtubeVideoData.items[index];
      const title = item.snippet.title.toLowerCase();
      const description = item.snippet.description.toLowerCase();
      const duration = videoDetails.contentDetails.duration;
      
      const minutes = duration.match(/(\d+)M/)?.[1] || '0';
      const seconds = duration.match(/(\d+)S/)?.[1] || '0';
      const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
      
      const isNotShorts = 
        !title.includes('#shorts') && 
        !title.includes('#short') && 
        !description.includes('#shorts') &&
        !videoDetails.snippet.tags?.some((tag: string) => 
          tag.toLowerCase().includes('short') || 
          tag.toLowerCase().includes('shorts')
        ) &&
        totalSeconds > 60;

      return isNotShorts;
    });

    if (!latestNonShortVideo) {
      return NextResponse.json(
        { error: 'No non-Shorts videos found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      videoId: latestNonShortVideo.snippet.resourceId.videoId,
      title: latestNonShortVideo.snippet.title
    });

  } catch (error) {
    console.error('Error fetching video data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}