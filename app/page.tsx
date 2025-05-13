"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Instagram, Youtube } from 'lucide-react';

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
          const savedVideoString = localStorage.getItem('currentVideo');
          if (savedVideoString) {
            try {
              const savedVideo = JSON.parse(savedVideoString);
              setVideoId(savedVideo.videoId);
              setVideoTitle(savedVideo.title || 'Latest Animation Process');
            } catch (e) {
              console.error('Saved video data parsing error:', e);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching video data:', err);
        const savedVideoString = localStorage.getItem('currentVideo');
        if (savedVideoString) {
          try {
            const savedVideo = JSON.parse(savedVideoString);
            setVideoId(savedVideo.videoId);
            setVideoTitle(savedVideo.title || 'Latest Animation Process');
          } catch (e) {
            console.error('Saved video data parsing error:', e);
          }
        }
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (needSmthOpen) setNeedSmthOpen(false);
  };
  
  const toggleNeedSmth = () => {
    setNeedSmthOpen(!needSmthOpen);
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Only keep animation styles */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-marquee {
          display: inline-block;
          width: max-content;
          animation: marquee 120s linear infinite;
        }
        
        .marquee-content {
          display: flex;
          width: max-content;
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-600">
        <div className="flex justify-between items-center px-5 py-3 w-full">
          <div className="flex-shrink-0">
            {/* Logo */}
            <Link href="/" className="text-lg md:text-xl font-bold">
              <div className="leading-none">
              <div>HA-</div>
              <div>EUN</div>
              </div>
            </Link>
          </div>
          
          {/* Center Nav Items - Centered */}
          <nav className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 gap-8">
            <Link href="/" className="uppercase text-sm font-normal hover:text-gray-500 transition-colors">
              HOME
            </Link>
            <Link href="/the-blank-gallery" className="uppercase text-sm font-normal hover:text-gray-500 transition-colors">
              THE BLANK GALLERY
            </Link>
            <button 
              onClick={toggleNeedSmth}
              className="uppercase text-sm font-normal hover:text-gray-500 transition-colors background-transparent border-none cursor-pointer"
            >
              NEED SMTH?
            </button>
          </nav>
                
          {/* Mobile menu button */}
          <button 
            className="uppercase text-xs font-light flex items-center gap-2 flex-shrink-0"
            onClick={needSmthOpen ? toggleNeedSmth : toggleMenu}
            aria-label={menuOpen || needSmthOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen || needSmthOpen ? (
              <>
                Close <X size={14} />
              </>
            ) : (
              <>
                Menu <Menu size={14} />
              </>
            )}
          </button>
        </div>
      </header>
      
      {/* Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out transform ${
          menuOpen ? 'translate-y-0' : '-translate-y-full'
        } overflow-y-auto`}
        style={{ paddingTop: 'calc(1rem + 42px)' }}
      >
        <div className="max-w-full px-5 py-10">
          
          <nav className="space-y-14 mb-20">
            <Link 
              href="/" 
              className="block group"
              onClick={() => setMenuOpen(false)}
            >
              <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                HOME
              </h3>
            </Link>
            
            <Link 
              href="/the-blank-gallery" 
              className="block group"
              onClick={() => setMenuOpen(false)}
            >
              <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                THE BLANK GALLERY
              </h3>
            </Link>
            
            <button 
              onClick={toggleNeedSmth}
              className="block group w-full text-left border-none bg-transparent"
            >
              <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                NEED SMTH?
              </h3>
            </button>
          </nav>
          
          <div className="pt-8">
            <div className="flex items-center gap-4">
              <Link 
                href="https://www.instagram.com/h_ablankcanvas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              <Link 
                href="https://www.youtube.com/@h_ablankcanvas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Need Smth Overlay */}
      <div 
        className={`fixed inset-0 bg-white z-40 transition-transform duration-500 ease-in-out transform ${
          needSmthOpen ? 'translate-y-0' : '-translate-y-full'
        } overflow-y-auto`}
        style={{ paddingTop: 'calc(1rem + 42px)' }}
      >
        <div className="max-w-full px-5 py-10">
          <h2 className="text-sm mb-12 font-light text-gray-500">
            What do you need?
          </h2>
          
          <nav className="space-y-14 mb-20">
            <Link 
              href="https://www.youtube.com/@h_ablankcanvas" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block group"
            >
              <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                PROCESS VIDEOS
              </h3>
              <p className="text-sm font-light text-gray-600">
                My workflow, from start to finish.
              </p>
            </Link>
            
            <Link 
              href="https://bit.ly/4dDyZvR" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block group"
            >
              <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                ANIMATION COURSE (KR)
              </h3>
              <p className="text-sm font-light text-gray-600">
                Your characters, brought to life
              </p>
            </Link>
            
            <Link 
              href="https://chatflix.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block group"
            >
              <h3 className="text-2xl md:text-5xl font-light mb-2 hover:text-gray-500 transition-colors">
                MY GO-TO AI
              </h3>
              <p className="text-sm font-light text-gray-600">
                The ultimate LLM collection
              </p>
            </Link>
          </nav>
          
          <div className="pt-8">
            <div className="flex items-center gap-4">
              <Link 
                href="https://www.instagram.com/h_ablankcanvas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </Link>
              <Link 
                href="https://www.youtube.com/@h_ablankcanvas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="md:pt-16 pt-14 pb-20 w-full">
        {/* Marquee Banner */}
        <div className="marquee-container overflow-hidden w-full py-2">
          <div className="marquee-content whitespace-nowrap animate-marquee">
            <Link 
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-gray-500 transition-colors"
            >
              <span className="uppercase text-lg md:text-xl font-normal">
                NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp; NEW VIDEO UP NOW! [{videoTitle}] &nbsp;&nbsp;&nbsp;
              </span>
            </Link>
          </div>
        </div>
        
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

      {/* Footer - Full Width */}
      <footer className="w-full border-t border-gray-600 py-8 px-5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex gap-6 mb-4 md:mb-0">
            <Link 
              href="https://www.instagram.com/h_ablankcanvas/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-500 transition-colors text-xs uppercase"
            >
              Instagram
            </Link>
            <Link 
              href="https://www.youtube.com/@h_ablankcanvas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-500 transition-colors text-xs uppercase"
            >
              YouTube
            </Link>
          </div>
          
          <div className="text-xs text-gray-500 font-light">
            © {new Date().getFullYear()} HABLANKCANVAS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}


