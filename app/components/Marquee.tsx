'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface MarqueeProps {
  videoId: string;
  videoTitle: string;
}

export default function Marquee({ videoId, videoTitle }: MarqueeProps) {
  const [mounted, setMounted] = useState(false);
  
  // Only show on client side
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <div className="h-10"></div>; // Empty placeholder with height
  }
  
  return (
    <div className="marquee-container w-full py-2">
      <Link 
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="marquee-content text-black hover:text-gray-500 transition-colors"
      >
        <span className="uppercase text-lg md:text-xl font-normal">
          NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp;
        </span>
      </Link>
    </div>
  );
} 