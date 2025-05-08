"use client"

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, X } from 'lucide-react';
import { Instagram, Youtube } from 'lucide-react';
import { ReactNode } from 'react';
import Image from 'next/image';
import LatestVideo from './components/LatestVideo_new';

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

// TypeWriter component for animated text
const TypeWriter = ({ text, speed = 40 }: { text: string; speed?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <>
      {displayText}
      {!isComplete && (
        <span className="inline-block w-0.5 h-3 bg-gray-400 ml-0.5 align-middle animate-blink"></span>
      )}
    </>
  );
};

// iMessage bubble component
const MessageBubble = ({ text, position = 'left', maxWidth }: { text: string; position?: 'left' | 'right'; maxWidth?: string }) => {
  return (
    <div className="flex w-full justify-start">
      <div 
        className="rounded-xl px-3 py-1.5 text-xs text-black border border-black/30"
        style={{ maxWidth: maxWidth || '100%' }}
      >
        <TypeWriter text={text} speed={30} />
      </div>
    </div>
  );
};

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupAnimation, setPopupAnimation] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animating, setAnimating] = useState(false);
  
  // Refs for scroll handling
  const youtubeRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef<number>(0);
  
  // 모바일 여부 확인 (768px 기준)
  const isMobile = useMediaQuery('(max-width: 768px)');

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

  const toggleDetails = () => {
    setAnimating(true);
    
    setTimeout(() => {
      setShowDetails(!showDetails);
      
      setTimeout(() => {
        setAnimating(false);
      }, 500);
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

  return (
    <div className="font-helvetica w-full flex flex-col min-h-dvh fixed inset-0 overflow-hidden">
      {/* Background Image - Larger on desktop */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/image/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: isMobile ? 'scale(1)' : 'scale(1.5)',
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease-out'
        }}
      ></div>
      
      {/* Remove backdrop blur for mobile - only keep white gradient */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 h-[60vh] bg-gradient-to-t from-white/90 via-white/50 to-transparent pointer-events-none z-0"></div>
      
      {/* Fixed Header - Always visible */}
      <div 
        className="fixed top-0 left-0 w-full p-5 md:p-8 py-6 md:py-6 z-20"
      >
        <div className="flex flex-col">
          <h1 className="text-[22px] font-bold font-['Helvetica_Neue'] leading-[0.9] tracking-tight">HA-<br />EUN</h1>
        </div>
      </div>
      
      {/* Main Content Container */}
      <div 
        ref={contentContainerRef}
        className="w-full flex flex-col min-h-dvh transition-all duration-300 overflow-hidden relative z-10"
        style={{
          transform: (showPopup && !isClosing) || (isClosing && popupAnimation) ? 'scale(0.95)' : 'scale(1)',
          opacity: (showPopup && !isClosing) || (isClosing && popupAnimation) ? '0.7' : '1',
          filter: (showPopup && !isClosing) || (isClosing && popupAnimation) ? 'blur(1px)' : 'none',
          pointerEvents: showPopup ? 'none' : 'auto'
        }}
      >
        {/* Spacer for fixed header */}
        <div className="w-full p-5 md:p-8 py-6 md:py-6">
          <div className="flex flex-col invisible">
            <h1 className="text-[22px] font-bold font-['Helvetica_Neue'] leading-[0.9] tracking-tight">HA-<br />EUN</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full flex items-center justify-center relative z-10">
          <div className="w-full flex flex-col justify-center items-center h-[calc(100vh-120px)]">
            <div className="w-full flex justify-between items-center">
              
              {/* Initial View */}
              <div 
                className={`absolute w-full transition-all duration-500 ease-in-out ${
                  showDetails 
                    ? 'opacity-0 transform translate-y-10 pointer-events-none' 
                    : 'opacity-100 transform translate-y-0'
                } ${animating ? 'pointer-events-none' : ''}`}
              >
                <div className="flex justify-between items-center w-full pb-2 md:pb-24 gap-4 md:gap-36 max-w-screen-xl mx-auto px-4 md:px-6 lg:px-12">
                  {/* YouTube Section - Left side */}
                  <div ref={youtubeRef} className="w-3/5 md:w-72 mx-auto md:mx-0">
                    <div className="mb-2">
                      <h2 className="text-[18px] font-medium font-['Helvetica_Neue'] leading-[0.9] mb-0">YOU-</h2>
                      <h2 className="text-[18px] font-medium font-['Helvetica_Neue'] leading-[0.9]">TUBE</h2>
                    </div>
                    <div className="w-full">
                      <LatestVideo />
                    </div>
                  </div>
                  
                  {/* Plus Button - Both Mobile and Desktop */}
                  <div className="w-auto flex flex-col items-center cursor-pointer">
                    <h2 
                      className="text-[32px] font-normal font-['Helvetica_Neue'] leading-none" 
                      onClick={toggleDetails}
                    >+</h2>
                    <div className="flex items-center gap-3 mt-8">
                      <div className="w-16 h-24 md:w-24 md:h-32 rounded-full overflow-hidden cursor-pointer" onClick={toggleDetails}>
                        <Image 
                          src="/image/coloso.png" 
                          alt="Coloso" 
                          width={80} 
                          height={80} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-16 h-24 md:w-24 md:h-32 rounded-full overflow-hidden border border-gray-200 cursor-pointer" onClick={toggleDetails}>
                        <Image 
                          src="/image/chatflix.png" 
                          alt="Chatflix" 
                          width={80} 
                          height={80} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details View - For Both Mobile and Desktop */}
              <div 
                className={`absolute w-full transition-all duration-500 ease-in-out ${
                  !showDetails 
                    ? 'opacity-0 transform -translate-y-10 pointer-events-none' 
                    : 'opacity-100 transform translate-y-0'
                } ${animating ? 'pointer-events-none' : ''}`}
              >
                <div className="flex flex-col items-center w-full pb-2 md:pb-24 max-w-screen-xl mx-auto px-4 md:px-6 lg:px-12 relative">
                  {/* Back Button - Desktop: Left side, Mobile: Bottom center */}
                  <div className="hidden md:block cursor-pointer text-[24px] fixed left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-10" onClick={toggleDetails}>
                    &lt;
                  </div>
                  
                  <div className="flex flex-row justify-between gap-4 md:gap-40 w-full">
                    {/* Mobile and Desktop layout for Coloso and Chatflix */}
                    <div className="w-1/2 max-w-[280px] md:w-72 mx-auto md:mx-0">
                      <div className="mb-2">
                        <h2 className="text-[18px] font-medium font-['Helvetica_Neue'] leading-[0.9]">COLOSO</h2>
                        <h2 className="text-[18px] font-medium font-['Helvetica_Neue'] leading-[0.9]">한국어</h2>
                      </div>
                      
                      <div className="w-full">
                        <a href="https://bit.ly/4dDyZvR" target="_blank" rel="noopener noreferrer">
                          <img 
                            src="/image/coloso.png" 
                            alt="Coloso" 
                            className="w-full h-auto object-cover"
                          />
                        </a>
                      </div>
                      
                      {/* Coloso Message - Moved below image */}
                      <div className="mt-2 mb-2">
                        <MessageBubble 
                          text="I made this with collaboration with Coloso." 
                          maxWidth="100%"
                        />
                      </div>

                      <div className="flex flex-col text-left my-2">
                        <h3 className="text-[15px] font-medium font-['Helvetica_Neue'] leading-[0.9]">YOUR</h3>
                        <h3 className="text-[15px] font-medium font-['Helvetica_Neue'] leading-[0.9]">CHA-</h3>
                        <h3 className="text-[15px] font-medium font-['Helvetica_Neue'] leading-[0.9]">RACTERS</h3>
                        <h3 className="text-[15px] font-medium font-['Helvetica_Neue'] leading-[0.9]">BROUGHT</h3>
                        <h3 className="text-[15px] font-medium font-['Helvetica_Neue'] leading-[0.9]">TO</h3>
                        <h3 className="text-[15px] font-medium font-['Helvetica_Neue'] leading-[0.9] mb-1">LIFE</h3>
                        <span className="text-[14px] font-normal font-['Helvetica_Neue'] leading-[0.9] ">
                          Character<br />
                          animation<br />
                          course
                        </span>
                      </div>
                    </div>
                    
                    {/* CHATFLIX Section - Right */}
                    <div className="w-1/2 max-w-[280px] md:w-72 mx-auto md:mx-0">
                      <div className="mb-2 flex justify-between items-end">
                        <div>
                          <h2 className="text-[18px] font-medium font-['Helvetica_Neue'] leading-[0.9] mb-0">CHAT-</h2>
                          <h2 className="text-[18px] font-medium font-['Helvetica_Neue'] leading-[0.9]">FLIX</h2>
                        </div>
                      </div>
                      
                      <div className="w-full border-[#707070] border-[1px]">
                        <a href="https://www.chatflix.app" target="_blank" rel="noopener noreferrer">
                          <img 
                            src="/image/chatflix.png" 
                            alt="Chatflix" 
                            className="w-full h-auto object-cover"
                          />
                        </a>
                      </div>
                      
                      {/* Chatflix Message - Moved below image */}
                      <div className="mt-2 mb-2">
                        <MessageBubble 
                          text="ngl, this is an ad. pulling out the family card :)" 
                          maxWidth="100%"
                        />
                      </div>

                      <div className="flex flex-col text-left my-2">
                        <h3 className="text-[15px] font-medium font-['Helvetica_Neue'] leading-[0.9]">ULTIMATE</h3>
                        <h3 className="text-[15px] font-medium font-['Helvetica_Neue'] leading-[0.9]">LLM</h3>
                        <h3 className="text-[15px] font-medium font-['Helvetica_Neue'] leading-[0.9]">COLLECT-</h3>
                        <h3 className="text-[15px] font-medium font-['Helvetica_Neue'] leading-[0.9] mb-1">ION</h3>
                        <span className="text-[14px] font-normal font-['Helvetica_Neue'] leading-[0.9]">
                          Access<br />
                          to all<br />
                          LLMs<br />
                          available
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile-only Back Button - Bottom center */}
                  <div className="md:hidden flex justify-center w-full mt-8">
                    <div 
                      className="cursor-pointer text-[24px] bg-white/20 backdrop-filter backdrop-blur-md h-10 w-10 rounded-full flex items-center justify-center"
                      onClick={toggleDetails}
                    >
                      &lt;
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Social Links Popup */}
      {(showPopup || isClosing) && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 transition-all duration-300" 
          onClick={closePopup}
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