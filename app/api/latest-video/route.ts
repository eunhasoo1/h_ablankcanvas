import { NextResponse } from 'next/server';

// This endpoint returns the latest YouTube video from our channel
export async function GET() {
  try {
    // In a real scenario, we would fetch this from a database
    // or directly from YouTube API, but since we're using localStorage
    // on the client side for simplicity, we'll just return a default response
    // that will be overridden by localStorage data if available
    return NextResponse.json({
      videoId: 'uLJ_EWGvJzk',
      title: 'Latest Animation Process',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching latest video:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch latest video' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 