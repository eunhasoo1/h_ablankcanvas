import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCchRDHJJRIneU21J9pyN_eg';

interface PlaylistItem {
  snippet: {
    resourceId: {
      videoId: string;
    };
    title: string;
    description: string;
  };
}

export async function GET() {
  if (!YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key is not configured' },
      { status: 500 }
    );
  }

  try {
    // 1. Get upload playlist ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelResponse.json();
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Get latest videos with more details
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
    );
    const playlistData = await playlistResponse.json();

    // 3. Get detailed video information including contentDetails for duration
    const videoIds = playlistData.items.map((item: PlaylistItem) => item.snippet.resourceId.videoId).join(',');
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    const videoData = await videoResponse.json();

    // 4. Find the latest non-Shorts video
    const latestNonShortVideo = playlistData.items.find((item: PlaylistItem, index: number) => {
      const videoDetails = videoData.items[index];
      const title = item.snippet.title.toLowerCase();
      const description = item.snippet.description.toLowerCase();
      const duration = videoDetails.contentDetails.duration;
      
      // Convert duration (PT1M33S format) to seconds
      const minutes = duration.match(/(\d+)M/)?.[1] || '0';
      const seconds = duration.match(/(\d+)S/)?.[1] || '0';
      const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
      
      // Check multiple criteria to identify non-Shorts
      const isNotShorts = 
        !title.includes('#shorts') && 
        !title.includes('#short') && 
        !description.includes('#shorts') &&
        !videoDetails.snippet.tags?.some((tag: string) => 
          tag.toLowerCase().includes('short') || 
          tag.toLowerCase().includes('shorts')
        ) &&
        totalSeconds > 60; // Additional check for duration

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
    console.error('Error fetching YouTube data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}