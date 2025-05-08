"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, X } from 'lucide-react';
import { Instagram, Youtube } from 'lucide-react';
import { ReactNode } from 'react';
import Image from 'next/image';
import Message from './components/Message';

interface SocialMediaItem {
  id: string;
  title: string;
  url: string;
  icon: ReactNode;
  popupIcon?: ReactNode;
  description?: string;
}

// 미디어 쿼리 훅 추가
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

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupAnimation, setPopupAnimation] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [videoData, setVideoData] = useState({ videoId: 'uLJ_EWGvJzk' });
  const [isLoading, setIsLoading] = useState(true);
  const [streamingText, setStreamingText] = useState('');
  const [streamingLine, setStreamingLine] = useState(0);
  const [streamingIndex, setStreamingIndex] = useState(0);
  const [showFullText, setShowFullText] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [footerStreamingText, setFooterStreamingText] = useState('');
  const [isFooterStreaming, setIsFooterStreaming] = useState(false);
  
  // 스트리밍할 텍스트 3줄
  const streamingLines = [
    'VIEWING IS MANDATORY FOR ALL CITIZENS LEVEL 3 AND ABOVE. REPORT',
    'DISLOYAL REACTIONS TO YOUR LOCAL HABLANKCANVAS SECURITY',
    'BUREAU.'
  ];
  
  // 푸터 스트리밍 텍스트
  const footerText = 'MAKING ART THAT REFUSES TO SIT STILL. ONE STORY AT A TIME.';
  
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const footerStreamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 초기 섹션 감지 - 페이지 로드 시 스크롤 위치에 따라 현재 섹션 설정
  useEffect(() => {
    const detectInitialSection = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const section = Math.round(scrollPosition / windowHeight);
      setCurrentSection(section);
    };
    
    detectInitialSection();
  }, []);
  
  // 스트리밍 효과 구현
  useEffect(() => {
    const startStreaming = () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
      
      setStreamingLine(0);
      setStreamingIndex(0);
      setStreamingText('');
      setShowFullText(false);
      
      // 전체 텍스트를 한 글자씩 표시
      const fullText = streamingLines.join('\n');
      let currentIndex = 0;
      
      // Set initial "V" to make sure it's visible from the start
      setStreamingText('V');
      currentIndex = 1;
      
      streamingIntervalRef.current = setInterval(() => {
        if (currentIndex < fullText.length) {
          setStreamingText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (streamingIntervalRef.current) {
            clearInterval(streamingIntervalRef.current);
            streamingIntervalRef.current = null;
            setShowFullText(true);
            
            // 1초 후에 다시 시작
            streamingTimeoutRef.current = setTimeout(() => {
              startStreaming();
            }, 1000);
          }
        }
      }, 50); // 타이핑 속도
    };
    
    startStreaming();
    
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
    };
  }, []);
  
  // 모바일 여부 확인 (768px 기준)
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // 비디오 데이터 가져오기
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
          setVideoData(data);
        }
      } catch (err) {
        console.error('Error fetching video data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, []);

  useEffect(() => {
    if (showPopup) {
      // 팝업이 표시될 때 애니메이션 상태를 true로 설정
      setTimeout(() => {
        setPopupAnimation(true);
        setIsClosing(false);
      }, 10);
      // 팝업이 열릴 때 body에 overflow hidden 추가
      document.body.style.overflow = 'hidden';
    } else {
      // 팝업이 닫힐 때 body의 overflow 복원
      document.body.style.overflow = '';
    }
  }, [showPopup]);

  const closePopup = () => {
    // 닫기 상태로 설정
    setIsClosing(true);
    setPopupAnimation(false);
    
    // 애니메이션 완료 후 팝업 제거
    setTimeout(() => {
      setShowPopup(false);
    }, 300);
  };

  const socialLinks: SocialMediaItem[] = [
    {
      id: '1',
      title: 'I live here',
      description: 'h_ablankcanvas',
      url: 'https://www.instagram.com/h_ablankcanvas/',
      icon: <Instagram size={28} className="flex-shrink-0" />,
      popupIcon: <Image src="/image/Instagram_icon.png" alt="Instagram" width={28} height={28} className="flex-shrink-0" />
    },
    {
      id: '2',
      title: 'Main - The Making of',
      description: 'h_ablankcanvas',
      url: 'https://www.youtube.com/@h_ablankcanvas',
      icon: <Youtube size={28} className="flex-shrink-0" />,
      popupIcon: <Image src="/image/youtubeicon.png" alt="YouTube" width={28} height={28} className="flex-shrink-0" />
    },
    {
      id: '3',
      title: 'Timelapse vids',
      description: 'hablankcanvas_data',
      url: 'https://www.youtube.com/@hablankcanvas_data',
      icon: <Youtube size={28} className="flex-shrink-0" />,
      popupIcon: <Image src="/image/youtubeicon.png" alt="YouTube" width={28} height={28} className="flex-shrink-0" />
    },
  ];

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // 현재 섹션 계산 (0: 메인, 1: Coloso, 2: Chatflix, 3: Footer)
      const section = Math.round(scrollPosition / windowHeight);
      
      // 섹션이 변경되었을 때만 처리
      if (section !== currentSection) {
        setCurrentSection(section);
        
        // 섹션 3(푸터)로 이동했을 때 스트리밍 시작
        if (section === 3 && !isFooterStreaming) {
          startFooterStreaming();
        }
        
        // If we're moving to section 1 or 2, explicitly hide cursor
        if (section !== 0) {
          setShowCustomCursor(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection, isFooterStreaming]);

  // 커스텀 커서 처리
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Check if cursor is over the top navigation bar
      const isOverTopBar = e.clientY < 64; // Height of the nav bar is 64px (16rem)
      
      setCursorPosition({ x: e.clientX, y: e.clientY });
      setShowCustomCursor(!isOverTopBar);
    };
    
    const handleMouseLeave = () => {
      setShowCustomCursor(false);
    };
    
    // Only add cursor event listeners for section 0
    if (currentSection === 0) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      };
    } else {
      // Explicitly hide custom cursor when not in section 0
      setShowCustomCursor(false);
    }
  }, [currentSection]);

  // 유튜브 링크로 이동하는 함수
  const goToYoutubeLink = () => {
    const youtubeLink = `https://www.youtube.com/watch?v=${videoData.videoId}`;
    window.open(youtubeLink, '_blank');
  };

  // Bit.ly 링크로 이동하는 함수
  const goToBitlyLink = () => {
    window.open('https://bit.ly/4dDyZvR', '_blank');
  };

  // Handle cursor state on component mount/unmount
  useEffect(() => {
    // Reset function to ensure cursor state is cleaned up
    const resetCursorState = () => {
      setShowCustomCursor(false);
      document.body.style.cursor = '';
    };
    
    // Initial setup based on section
    if (currentSection !== 0) {
      resetCursorState();
    }
    
    // Cleanup on unmount
    return () => {
      resetCursorState();
    };
  }, [currentSection]);

  // 푸터 스트리밍 효과 함수
  const startFooterStreaming = () => {
    setIsFooterStreaming(true);
    setFooterStreamingText('');
    
    if (footerStreamingIntervalRef.current) {
      clearInterval(footerStreamingIntervalRef.current);
    }
    
    let currentIndex = 0;
    footerStreamingIntervalRef.current = setInterval(() => {
      if (currentIndex < footerText.length) {
        setFooterStreamingText(footerText.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (footerStreamingIntervalRef.current) {
          clearInterval(footerStreamingIntervalRef.current);
          footerStreamingIntervalRef.current = null;
        }
      }
    }, 50); // 타이핑 속도
  };
  
  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (footerStreamingIntervalRef.current) {
        clearInterval(footerStreamingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="font-helvetica w-full min-h-dvh flex flex-col snap-y snap-mandatory">
      {/* First Section - Background Video with snap */}
      <section 
        className="snap-start h-screen w-full relative cursor-play overflow-hidden"
        onClick={goToYoutubeLink}
      >
        {/* Background Video */}
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-black z-0">
          {!isLoading && (
            <iframe
              className="absolute w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoData.videoId}?autoplay=1&mute=1&playsinline=1&loop=1&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&color=white&iv_load_policy=3&playlist=${videoData.videoId}&vq=hd1080`}
              title="Background video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{
                objectFit: 'cover',
                pointerEvents: 'none',
                width: '100vw',
                height: '100vh',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: isMobile 
                  ? 'translate(-50%, -50%) scale(4)'
                  : 'translate(-50%, -50%) scale(1.2)',
              }}
            />
          )}
        </div>

        {/* Top Navigation Bar - Desktop */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-transparent border-b border-[#B1B0AD] hidden md:flex items-center z-20 cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left section with logo and social links */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="h-12 w-12 bg-[#edece5] flex items-center justify-center">
              <div className="font-bold text-md leading-tight tracking-tight text-[#1C1C1C]">
                <div className="-mb-1">HA-</div>
                <div>EUN</div>
              </div>
            </Link>
            
            {/* Social Links - Desktop */}
            <div className="flex items-start ml-2 h-full">
              <a 
                href="https://www.instagram.com/h_ablankcanvas/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-white text-sm uppercase tracking-wider group h-12 pb-2 px-4"
              >
                <div className="flex items-center hover:bg-[#FEB902] transition-colors hover:text-[#1C1C1C] rounded-sm text-xs">
                  INSTAGRAM 
                  <Instagram 
                    size={14} 
                    className="ml-4  group-hover:opacity-100" 
                  />
                </div>
              </a>
              <a 
                href="https://www.youtube.com/@h_ablankcanvas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-white text-sm uppercase tracking-wider group h-12 pb-2 px-4"
              >
                <div className="flex items-center hover:bg-[#FEB902] transition-colors hover:text-[#1C1C1C] rounded-sm text-xs">
                  YOUTUBE
                  <Youtube 
                    size={14} 
                    className="ml-4  group-hover:opacity-100" 
                  />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Top Bar */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-12 bg-transparent border-b border-[#B1B0AD] flex items-center z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Logo */}
          <Link href="/" className="h-12 w-12 bg-[#edece5] flex items-center justify-center">
            <div className="font-bold text-md leading-tight tracking-tight text-[#1C1C1C]">
              <div className="-mb-1">HA-</div>
              <div>EUN</div>
            </div>
          </Link>
          
          {/* Social Links - Right side on mobile */}
          <div className="flex items-center justify-end flex-1 h-full">
            <div className="bg-[#edece5] h-full flex items-center px-2">
              <a 
                href="https://www.instagram.com/h_ablankcanvas/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-[#1C1C1C] px-3 h-full"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://www.youtube.com/@h_ablankcanvas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-[#1C1C1C] px-3 h-full"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div 
          className="relative w-full flex flex-col min-h-dvh transition-all duration-300 z-10 pt-12"
          style={{
            transform: (showPopup && !isClosing) || (isClosing && popupAnimation) ? 'scale(0.95)' : 'scale(1)',
            opacity: (showPopup && !isClosing) || (isClosing && popupAnimation) ? '0.7' : '1',
            pointerEvents: showPopup ? 'none' : 'auto'
          }}
        >
          {/* Main Content - Removed text overlays */}
          <main className="flex-1 flex flex-col items-center justify-center px-5 py-4 max-w-xl mx-auto w-full">
          </main>
        </div>

        {/* Custom PLAY cursor */}
        {showCustomCursor && currentSection === 0 && (
          <div 
            className="custom-cursor-play"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
              display: currentSection === 0 ? 'block' : 'none'
            }}
          >
            PLAY
          </div>
        )}
      </section>

      {/* Second Section - Coloso Page */}
      <section 
        className="snap-start h-screen w-full relative overflow-hidden cursor-default-section"
        onClick={goToBitlyLink}
      >
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            preload="auto"
            controls={false}
          >
            <source src="https://media.githubusercontent.com/media/eunhasoo1/h_ablankcanvas/main/public/video/coloso.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Text overlay on the video */}
        <div className="absolute inset-0 flex flex-col items-center justify-start text-white text-center px-6 pt-20 md:pt-24">
          <h2 className="text-4xl md:text-7xl font-bold mb-2 tracking-tight">Animation Course</h2>
          <p className="text-xl md:text-4xl mb-6 font-light">Your characters, brought to life.</p>
          
          <Link 
            href="https://bit.ly/4dDyZvR" 
            target="_blank"
            className="bg-[#FEB902] text-[#1C1C1C] font-base py-3 px-7 hover:bg-black hover:border hover:border-[#FEB902] hover:text-[#FEB902] transition-colors text-sm md:text-lg tracking-wider"
            onClick={(e) => e.stopPropagation()}
          >
            Learn More
          </Link>
          
          <p className="absolute bottom-24 text-sm md:text-lg font-light">한국어 지원. Global coming soon.</p>
        </div>
      </section>

      {/* Third Section - Chatflix */}
      <section 
        className="snap-start h-screen w-full relative overflow-hidden cursor-default-section bg-white"
        onClick={() => window.open("https://chatflix.app", "_blank")}
      >
        {/* Background Image - Only visible on desktop */}
        <div className="absolute inset-0 w-full h-full bg-white hidden md:block">
          <Image
            src="/image/chatflixbackground.png"
            alt="Chatflix Background"
            fill
            className="object-cover md:object-contain"
            priority
          />
        </div>
        
        {/* Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* Top text content */}
          <div className="pt-20 md:pt-24 flex flex-col items-center justify-start text-center px-6">
            <h2 className="text-4xl md:text-7xl font-bold mb-2 tracking-tight text-[#1C1C1C]">Chatflix</h2>
            <p className="text-xl md:text-4xl mb-6 font-light text-[#1C1C1C]">The Ultimate LLM Collection</p>
            
            <Link 
              href="https://chatflix.app" 
              target="_blank"
              className="bg-[#FEB902] text-[#1C1C1C] font-base py-3 px-7 hover:bg-black hover:border hover:border-[#FEB902] hover:text-[#FEB902] transition-colors text-sm md:text-lg tracking-wider"
              onClick={(e) => e.stopPropagation()}
            >
              Learn More
            </Link>
            
            {/* Mobile Image - Below Button */}
            <div className="w-full md:hidden flex justify-center items-center flex-grow">
              <Image
                src="/image/chatflix.png"
                alt="Chatflix I AM AI"
                width={400}
                height={200}
                className="w-full object-contain"
                priority
              />
            </div>
          </div>
          
          {/* Flexible space to push disclaimer to bottom - Only on desktop */}
          <div className="flex-1 hidden md:block"></div>
          
          {/* Bottom disclaimer */}
          <div className="pb-24 flex items-center justify-center mt-auto">
            <p className=" text-xs md:text-sm text-gray-500 px-4 text-center font-light">Ngl this is an ad. Pulling out the family card :)</p>
          </div>
        </div>
      </section>

      {/* Fourth Section - Final Footer */}
      <section className="snap-start h-screen w-full relative overflow-hidden bg-black flex flex-col">
        {/* HA-EUN Logo in bottom left */}
        <div className="absolute bottom-8 left-8 z-10">
          <Link href="/" className="text-white font-bold text-2xl leading-tight">
            <div>HA-</div>
            <div>EUN</div>
          </Link>
        </div>
        
        {/* Desktop Content Grid */}
        <div className="w-full h-full hidden md:grid grid-cols-3 grid-rows-2 gap-0 items-center justify-center pb-12">
          {/* Left Cell - Social Links */}
          <div className="flex items-center justify-end relative px-0 h-full">
            <div className="border border-[#FEB902] p-4 flex flex-col items-start justify-start h-32 w-full max-w-xs" style={{ borderWidth: '1px' }}>
              <a 
                href="https://www.instagram.com/h_ablankcanvas/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-[#FEB902] text-sm uppercase font-normal hover:bg-[#FEB902] hover:text-[#1C1C1C] transition-colors"
              >
                INSTAGRAM 
                <Instagram size={14} className="ml-4" />
              </a>
              <a 
                href="https://www.youtube.com/@h_ablankcanvas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-[#FEB902] text-sm uppercase font-normal hover:bg-[#FEB902] hover:text-[#1C1C1C] transition-colors"
              >
                YOUTUBE
                <Youtube size={14} className="ml-4" />
              </a>
            </div>
          </div>
          
          {/* Right Cell - Tagline */}
          <div className="flex items-center justify-start pl-0 h-full row-span-2">
            <div className="border-white border-[1px] p-4 flex flex-col justify-start h-32 w-full max-w-xs">
              <p className="text-white text-sm uppercase tracking-wide font-normal">
                {footerStreamingText}
                <span className={isFooterStreaming ? "animate-blink" : "hidden"}>|</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Mobile Content - Stacked Boxes */}
        <div className="md:hidden w-full h-full flex flex-col items-center justify-center px-4 pb-12">
          <div className="flex flex-col w-full max-w-xs">
            {/* Mobile Social Links Box */}
            <div className="border border-[#FEB902] border-b-0 p-4 flex flex-col items-start justify-start w-full" style={{ borderWidth: '1px' }}>
              <a 
                href="https://www.instagram.com/h_ablankcanvas/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-[#FEB902] text-xs uppercase tracking-wide leading-loose font-normal hover:bg-[#FEB902] hover:text-[#1C1C1C] transition-colors"
              >
                INSTAGRAM 
                <Instagram size={14} className="ml-4" />
              </a>
              <a 
                href="https://www.youtube.com/@h_ablankcanvas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-[#FEB902] text-xs uppercase tracking-wide leading-loose font-normal hover:bg-[#FEB902] hover:text-[#1C1C1C] transition-colors"
              >
                YOUTUBE
                <Youtube size={14} className="ml-4" />
              </a>
            </div>
            
            {/* Mobile Tagline Box */}
            <div className="border-white border-[1px] border-t-0 p-4 flex flex-col justify-start w-full">
              <p className="text-white text-xs uppercase tracking-wide font-normal leading-loose">
                {footerStreamingText}
                <span className={isFooterStreaming ? "animate-blink" : "hidden"}>|</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links Popup */}
      {(showPopup || isClosing) && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 transition-all duration-300" 
          onClick={(e) => {
            e.stopPropagation();
            closePopup();
          }}
          style={{
            backdropFilter: 'blur(2px)',
            opacity: popupAnimation ? 1 : 0,
            transition: 'opacity 0.3s ease-out',
            pointerEvents: isClosing ? 'none' : 'auto'
          }}
        >
          {/* 모바일 팝업 */}
          {isMobile ? (
            <div 
              className="bg-[#fafafa] rounded-t-3xl p-6 w-full shadow-xl transition-transform duration-300 ease-out" 
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: 'calc(100vh - 40px)',
                overflowY: 'auto',
                transform: popupAnimation ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.3s ease-out'
              }}
            >
              <div className="relative mb-8">
                <button 
                  onClick={closePopup}
                  className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src="/image/profilepic.png"
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-[13px] text-[#8E8E93]">Haeun</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {socialLinks.map((item) => (
                  <a 
                    key={item.id} 
                    href={item.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="text-[#282828]">{item.popupIcon || item.icon}</div>
                    <div className="flex flex-col">
                      <span className="text-[#282828]">{item.title}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            /* 데스크톱 팝업 */
            <div 
              className="bg-[#fafafa] rounded-3xl p-6 px-5 max-w-xs w-full shadow-xl" 
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: popupAnimation ? 'scale(1)' : 'scale(0.95)',
                transition: 'transform 0.3s ease-out'
              }}
            >
              <div className="relative mb-8">
                <button 
                  onClick={closePopup}
                  className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src="/image/profilepic.png"
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-[13px] text-[#8E8E93]">Haeun</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {socialLinks.map((item) => (
                  <a 
                    key={item.id} 
                    href={item.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="text-[#282828]">{item.popupIcon || item.icon}</div>
                    <div className="flex flex-col">
                      <span className="text-[#282828]">{item.title}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}