import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/videoData.json');

// 비디오 데이터 읽기 함수
async function readVideoData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading video data:', error);
    return { videoId: '', title: 'Latest Video', lastUpdated: '' };
  }
}

// 비디오 데이터 쓰기 함수
async function writeVideoData(data: any) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing video data:', error);
    return false;
  }
}

// GET 요청 처리 - 현재 비디오 데이터 가져오기
export async function GET() {
  try {
    const videoData = await readVideoData();
    return NextResponse.json(videoData);
  } catch (error) {
    console.error('Error in GET /api/admin/video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video data' },
      { status: 500 }
    );
  }
}

// POST 요청 처리 - 비디오 데이터 업데이트
export async function POST(request: NextRequest) {
  try {
    const { videoId, title } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const newData = {
      videoId,
      title: title || 'Latest Video',
      lastUpdated: new Date().toISOString()
    };

    const success = await writeVideoData(newData);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update video data' },
        { status: 500 }
      );
    }

    return NextResponse.json(newData);
  } catch (error) {
    console.error('Error in POST /api/admin/video:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 