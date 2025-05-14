"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube } from 'lucide-react';
import Marquee from './components/Marquee';
import Navbar from './components/Navbar';
import NeedSmthMenu from './components/NeedSmthMenu';
import Footer from './components/Footer';

// Media query hook
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Import font styles in next/head
export default function Home() {
  const [videoId, setVideoId] = useState('uLJ_EWGvJzk');
  const [videoTitle, setVideoTitle] = useState('Latest Animation Process');
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [needSmthOpen, setNeedSmthOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    // Fetch the latest video ID
    const fetchVideoData = async () => {
      try {
        // First try to get the data from localStorage
        const savedVideoString = localStorage.getItem('currentVideo');
        if (savedVideoString) {
          try {
            const savedVideo = JSON.parse(savedVideoString);
            setVideoId(savedVideo.videoId);
            setVideoTitle(savedVideo.title || 'Latest Animation Process');
            setLoading(false);
            return; // Exit early if we successfully got data from localStorage
          } catch (e) {
            console.error('Saved video data parsing error:', e);
          }
        }

        // If localStorage fails or is empty, try the API
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/latest-video?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setVideoId(data.videoId);
          setVideoTitle(data.title || 'Latest Animation Process');
          localStorage.setItem('currentVideo', JSON.stringify(data));
        } else {
          // If API fails, use a default video
          const defaultVideo = {
            videoId: 'uLJ_EWGvJzk',
            title: 'Latest Animation Process'
          };
          setVideoId(defaultVideo.videoId);
          setVideoTitle(defaultVideo.title);
        }
      } catch (err) {
        console.error('Error fetching video data:', err);
        // Set default values if everything fails
        setVideoId('uLJ_EWGvJzk');
        setVideoTitle('Latest Animation Process');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
    
    // Prevent scroll when menu or needSmth is open
    if (menuOpen || needSmthOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, needSmthOpen]);

  const toggleNeedSmth = () => {
    setNeedSmthOpen(!needSmthOpen);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <Navbar toggleNeedSmth={toggleNeedSmth} needSmthOpen={needSmthOpen} />
      
      {/* Need Smth Overlay */}
      <NeedSmthMenu isOpen={needSmthOpen} />
      
      {/* Main Content */}
      <main className="md:pt-16 pt-14 pb-20 w-full">
        {/* Marquee Banner */}
        <Marquee videoId={videoId} videoTitle={videoTitle} />
        
        {/* Gallery Section - Full Width */}
        <div className="w-full">
          <div className="flex flex-col">
            {/* Animation Course Card */}
            <div className="flex flex-col md:flex-row gap-0 md:gap-8 border-t pb-8 md:pb-0 border-gray-600">
              <Link 
                href="https://bit.ly/4dDyZvR"
                target="_blank"
                rel="noopener noreferrer"
                className="block group md:w-1/2"
              >
                <div className="aspect-video relative overflow-hidden mb-4 md:mb-0 bg-gray-100">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  >
                    <source src="https://media.githubusercontent.com/media/eunhasoo1/h_ablankcanvas/main/public/video/coloso.mp4" type="video/mp4" />
                  </video>
                </div>
              </Link>
              <Link 
                href="https://bit.ly/4dDyZvR"
                target="_blank"
                rel="noopener noreferrer"
                className=" group md:w-1/2 flex flex-col justify-center px-5 md:px-0 gap-2"
              >
                <h3 className="uppercase text-xl md:text-3xl font-normal">COLOSO COURSE</h3>
                <p className="text-sm md:text-base font-light text-gray-600 mb-4">
                  Available in Korean. Global coming soon.
                </p>
                <span className="uppercase text-xs font-light inline-block group-hover:text-gray-500 transition-colors">
                  <span className="border-b border-black pb-1">Learn More</span>
                </span>
              </Link>
            </div>
            
            {/* Chatflix Card */}
            <div className="flex flex-col md:flex-row gap-0 md:gap-8 border-b border-t pb-8 md:pb-0 border-gray-600">
              <Link 
                href="https://chatflix.app"
                target="_blank"
                rel="noopener noreferrer"
                className="block group md:w-1/2"
              >
                <div className="aspect-video relative overflow-hidden mb-4 bg-gray-100">
                  <Image 
                    src="/image/chatflix.png"
                    alt="Chatflix"
                    fill
                    className="object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
              <Link 
                href="https://chatflix.app"
                target="_blank"
                rel="noopener noreferrer"
                className=" group md:w-1/2 flex flex-col justify-center px-5 md:px-0 gap-4"
              >
                <h3 className="uppercase text-xl md:text-3xl font-normal">MY GO-TO AI</h3>
                <p className="text-sm md:text-base font-light text-gray-600 mb-4">
                  If there's an 'everyday carry software', this is mine.
                </p>
                <span className="uppercase text-xs font-light inline-block group-hover:text-gray-500 transition-colors">
                  <span className="border-b border-black pb-1">Explore Now</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Background Video Section - Full Width */}
        <div className="w-full px-5 mt-20">
          <h2 className="uppercase text-sm font-normal mb-4">LATEST video</h2>
          <Link 
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <div className="aspect-video relative overflow-hidden bg-gray-100 -mx-5">
              {!loading && (
                <iframe
                  className="absolute w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&loop=1&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&color=white&iv_load_policy=3&playlist=${videoId}&vq=hd1080`}
                  title="Latest video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  style={{
                    objectFit: 'cover',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}


