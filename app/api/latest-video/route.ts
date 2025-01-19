import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCchRDHJJRIneU21J9pyN_eg';

export async function GET() {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key is not configured' },
      { status: 500 }
    );
  }

  try {
    // 1. 먼저 채널의 uploads 플레이리스트 ID를 가져옵니다
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?` +
      new URLSearchParams({
        key: YOUTUBE_API_KEY,
        id: CHANNEL_ID,
        part: 'contentDetails',
      })
    );

    if (!channelResponse.ok) {
      throw new Error('Failed to fetch channel data');
    }

    const channelData = await channelResponse.json();
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. uploads 플레이리스트에서 최신 영상을 가져옵니다
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?` +
      new URLSearchParams({
        key: YOUTUBE_API_KEY,
        playlistId: uploadsPlaylistId,
        part: 'snippet',
        maxResults: '1',
        order: 'date'
      })
    );
    
    if (!videoResponse.ok) {
      const error = await videoResponse.json();
      console.error('YouTube API Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch from YouTube API' },
        { status: videoResponse.status }
      );
    }

    const data = await videoResponse.json();
    
    if (!data.items?.[0]) {
      return NextResponse.json(
        { error: 'No videos found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      videoId: data.items[0].snippet.resourceId.videoId,
      title: data.items[0].snippet.title,
    });
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 