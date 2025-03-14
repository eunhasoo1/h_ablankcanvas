"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Coffee, ChevronRight, X } from 'lucide-react';
import { Instagram, Youtube } from 'lucide-react';
import { ReactNode } from 'react';
import Image from 'next/image';
import LatestVideo from './components/LatestVideo';
import Message from './components/Message';


interface SocialMediaItem {
  id: string;
  title: string;
  url: string;
  icon: ReactNode;
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

  const socialLinks = [
    {
      id: '1',
      title: 'IG',
      url: 'https://www.instagram.com/h_ablankcanvas/',
      icon: <Instagram size={28} className="flex-shrink-0" />
    },
    {
      id: '2',
      title: 'Haeun',
      description: 'Main channel',
      url: 'https://www.youtube.com/@h_ablankcanvas',
      icon: <Youtube size={28} className="flex-shrink-0" />
    },
    {
      id: '3',
      title: 'hablankcanvas_data',
      description: 'home for all my timelapse vids',
      url: 'https://www.youtube.com/@hablankcanvas_data',
      icon: <Youtube size={28} className="flex-shrink-0" />
    }
  ];

  return (
    <div className="font-helvetica w-full flex flex-col min-h-dvh">
      {/* Main Content Container - 팝업이 열릴 때 축소 효과 적용 */}
      <div 
        className="w-full flex flex-col min-h-dvh transition-all duration-300"
        style={{
          transform: (showPopup && !isClosing) || (isClosing && popupAnimation) ? 'scale(0.95)' : 'scale(1)',
          opacity: (showPopup && !isClosing) || (isClosing && popupAnimation) ? '0.7' : '1',
          filter: (showPopup && !isClosing) || (isClosing && popupAnimation) ? 'blur(1px)' : 'none',
          pointerEvents: showPopup ? 'none' : 'auto'
        }}
      >
        {/* Header - Full width */}
        <div className="w-full bg-[#fafafa] py-4 pt-6">
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={() => setShowPopup(true)} 
              className="w-16 h-16 rounded-full overflow-hidden cursor-pointer border-0 p-0"
            >
              <Image
                src="/image/profilepic.png"
                alt="Profile"
                width={60}
                height={60}
                className="w-full h-full object-cover"
              />
            </button>
            <div className="flex flex-col items-center gap-1 pl-2">
              <button 
                onClick={() => setShowPopup(true)}
                className="flex items-center text-[13px] text-[#8E8E93] cursor-pointer bg-transparent border-0 p-0"
              >
                <span>Haeun</span>
                <ChevronRight size={14} className='translate-y-[1px] text-[#C7C7CC]' />
              </button>
            </div>
          </div>
        </div>

        {/* Content - With padding */}
        <div className="flex-1 px-5 py-4 max-w-xl mx-auto w-full">
          <Message text="Latest" />
          
          <LatestVideo />
          
          <Message text="I make stuff :)" showTail={true} />

          <div className="flex-1 flex flex-col w-full">
            <div className="flex-1 grid grid-cols-1 gap-3 w-full mx-auto md:mx-0">
              {/* Coloso Course */}
              <div className="flex">
                <Link href="https://bit.ly/4dDyZvR" target="_blank" rel="noopener noreferrer" className="w-full">
                  <div className="relative flex flex-col h-full overflow-hidden rounded-3xl group">
                    <img
                      src="/image/coloso.png"
                      alt="Coloso Course"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col text-white py-3 px-4 md:py-4 md:px-5 pr-3 md:pr-4 justify-between">
                      <h2 className="text-md md:text-2xl font-normal">Coloso Course</h2>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl md:text-4xl leading-tight font-medium">
                          Your characters,<br />brought to life.
                        </p>
                        <ArrowRight className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Wake The Dead */}
              <div className="flex-1 mb-3">
                <Link href="https://wakethedead.ai" target="_blank" className="h-full">
                  <div className="relative flex flex-col h-full overflow-hidden rounded-3xl group">
                    <img
                      src="/image/wtd.png"
                      alt="Wake The Dead"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col text-white py-3 px-4 md:py-4 md:px-5 pr-3 md:pr-4 justify-between">
                      <h2 className="text-md md:text-2xl font-normal">Wake The Dead</h2>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl md:text-4xl leading-tight font-medium">
                          Emoji CPR<br />for any content 🚑
                        </p>
                        <ArrowRight className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Bottom Container for Post-it and Social Links */}
              <div className="gap-4 mt-12">
                {/* Social Links Container */}
                <div className="text-[#282828] rounded-3xl pt-2 flex flex-row justify-center gap-4">
                  {socialLinks.filter(item => item.id !== '3').map((item) => (
                    <a 
                      key={item.id} 
                      href={item.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#282828] hover:text-gray-600 transition-colors flex items-center justify-center"
                      aria-label={item.title}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full my-12 mt-80">
            <div className="flex flex-col items-end">
              <Message text="One story at a time" type='send' />
              <span className="text-[11px] text-[#8D8C90] mt-1 mr-1 font-medium">
                Delivered
              </span>
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
                    <div className="text-[#282828]">{item.icon}</div>
                    <div className="flex flex-col">
                      <span className="text-[#282828]">{item.title}</span>
                      {item.description && (
                        <span className="text-xs text-gray-500">{item.description}</span>
                      )}
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
                    <div className="text-[#282828]">{item.icon}</div>
                    <div className="flex flex-col">
                      <span className="text-[#282828]">{item.title}</span>
                      {item.description && (
                        <span className="text-xs text-gray-500">{item.description}</span>
                      )}
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