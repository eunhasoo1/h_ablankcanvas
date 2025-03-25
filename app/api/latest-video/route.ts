import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'app/data/videoData.json');

// Ensure the data directory exists
async function ensureDataDirectoryExists() {
  const dataDir = path.dirname(dataFilePath);
  try {
    await fs.access(dataDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dataDir, { recursive: true });
    
    // Create default data file
    const defaultData = {
      videoId: 'dQw4w9WgXcQ', // Default placeholder video
      title: 'Latest Video',
      lastUpdated: new Date().toISOString()
    };
    
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

// Read video data function
async function readVideoData() {
  try {
    await ensureDataDirectoryExists();
    
    try {
      const data = await fs.readFile(dataFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is invalid JSON
      const defaultData = {
        videoId: 'dQw4w9WgXcQ', // Default placeholder video
        title: 'Latest Video',
        lastUpdated: new Date().toISOString()
      };
      
      // Create the file with default data
      await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
  } catch (error) {
    console.error('Error reading video data:', error);
    throw new Error('Failed to read video data');
  }
}

// GET handler
export async function GET() {
  try {
    const data = await readVideoData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video data' }, { status: 500 });
  }
}