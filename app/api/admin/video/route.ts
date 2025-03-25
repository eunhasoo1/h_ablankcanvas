import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { supabase, isAdmin } from '@/lib/supabase';

const dataFilePath = path.join(process.cwd(), 'app/data/videoData.json');

// Read video data function
async function readVideoData() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading video data:', error);
    return { videoId: '', title: 'Latest Video', lastUpdated: '' };
  }
}

// Write video data function
async function writeVideoData(data: any) {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing video data:', error);
    return false;
  }
}

// Authentication check function
async function checkAuth(request: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return { authenticated: false, error: 'Not authenticated' };
  }

  const adminStatus = await isAdmin(session.user.id);
  if (!adminStatus) {
    return { authenticated: false, error: 'Not authorized' };
  }

  return { authenticated: true, userId: session.user.id };
}

// GET request handler - Get current video data
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

// POST request handler - Update video data
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { authenticated, error } = await checkAuth(request);
    
    if (!authenticated) {
      return NextResponse.json(
        { error: error || 'Authentication required' },
        { status: 401 }
      );
    }

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