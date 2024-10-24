
import { XMLParser } from 'fast-xml-parser';
import { NextRequest, NextResponse } from 'next/server';

interface YouTubeRSSEntry {
  'yt:videoId': string;
  title: string;
  published: string;
}

interface YouTubeRSSFeed {
  feed: {
    entry: YouTubeRSSEntry[];
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get('channelId');

  if (!channelId) {
    return NextResponse.json(
      { error: 'Channel ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch YouTube RSS feed');
    }

    const xmlData = await response.text();
    const parser = new XMLParser();
    const result = parser.parse(xmlData) as YouTubeRSSFeed;

    const latestEntry = result.feed.entry[0];
    const videoData = {
      videoId: latestEntry['yt:videoId'],
      title: latestEntry.title,
      publishedAt: new Date(latestEntry.published).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    return NextResponse.json(videoData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다' },
      { status: 500 }
    );
  }
}