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
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      new URLSearchParams({
        key: YOUTUBE_API_KEY,
        channelId: CHANNEL_ID,
        part: 'snippet,id',
        order: 'date',
        maxResults: '1',
        type: 'video'
      })
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error('YouTube API Error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch from YouTube API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.items?.[0]) {
      return NextResponse.json(
        { error: 'No videos found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      videoId: data.items[0].id.videoId,
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