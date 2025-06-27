import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This endpoint returns the latest YouTube video from our channel
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'latest_video.json');
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContents);
      return NextResponse.json(data);
    } else {
      return NextResponse.json({
        videoId: 'uLJ_EWGvJzk',
        title: 'Latest Animation Process',
      });
    }
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