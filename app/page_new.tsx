"use client"

import React, { useState, useEffect } from 'react';
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
        <div className="w-full p-5 md:p-8 py-6 md:py-6">
          <div className="flex flex-col">
            <h1 className="text-[22px] font-bold font-['Helvetica_Neue'] leading-[0.9] tracking-tight">HA-<br />EUN</h1>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full">
          <div className="flex-1 flex flex-col w-full">
            <div className="flex-1 flex flex-col gap-6 md:gap-24 w-full">
              
              {/* YouTube Section - Positioned to the right */}
              <div className="w-full flex justify-end mt-16 md:mt-20">
                <div className="w-3/5 mr-5 md:mr-8">
                  <div className="mb-2">
                    <h2 className="text-[16px] font-medium font-['Helvetica_Neue'] leading-[0.9] mb-0">YOU-</h2>
                    <h2 className="text-[16px] font-medium font-['Helvetica_Neue'] leading-[0.9]">TUBE</h2>
                  </div>
                  <div className="w-full">
                    <LatestVideo />
                  </div>
                </div>
              </div>

              {/* COLOSO Section - Positioned to the left */}
              <div className="w-full mt-14 md:mt-16">
                <div className="w-3/5 ml-5 md:ml-8">
                  <div className="mb-2">
                    <h2 className="text-[16px] font-medium font-['Helvetica_Neue'] leading-[0.9]">COLOSO</h2>
                    <h2 className="text-[16px] font-medium font-['Helvetica_Neue'] leading-[0.9]">KR</h2>
                  </div>
                  <div className="w-full">
                    <a href="https://bit.ly/4dDyZvR" target="_blank" rel="noopener noreferrer">
                      <img 
                        src="/image/coloso.png" 
                        alt="Coloso" 
                        className="w-full"
                      />
                    </a>
                  </div>

                  <div className="flex flex-col text-left my-2">
                    <h3 className="text-[13px] font-medium font-['Helvetica_Neue'] leading-[0.9]">YOUR</h3>
                    <h3 className="text-[13px] font-medium font-['Helvetica_Neue'] leading-[0.9]">CHARACTERS</h3>
                    <h3 className="text-[13px] font-medium font-['Helvetica_Neue'] leading-[0.9]">BROUGHT</h3>
                    <h3 className="text-[13px] font-medium font-['Helvetica_Neue'] leading-[0.9]">TO</h3>
                    <h3 className="text-[13px] font-medium font-['Helvetica_Neue'] leading-[0.9] mb-1">LIFE</h3>
                    <span className="text-[12px] font-normal font-['Helvetica_Neue'] leading-[0.9] ">
                      Character<br />
                      animation<br />
                      course
                    </span>
                  </div>
                </div>
              </div>
              
              {/* CHATFLIX Section - Positioned to the right */}
              <div className="w-full flex justify-end mt-8 md:mt-16">
                <div className="w-3/5 mr-5 md:mr-8">
                  <div className="mb-2">
                    <h2 className="text-[16px] font-medium font-['Helvetica_Neue'] leading-[0.9] mb-0">CHAT-</h2>
                    <h2 className="text-[16px] font-medium font-['Helvetica_Neue'] leading-[0.9]">FLIX</h2>
                  </div>
                  <div className="w-full border-[#707070] border-[1px]">
                    <a href="https://www.chatflix.app" target="_blank" rel="noopener noreferrer">
                      <img 
                        src="/image/chatflix.png" 
                        alt="Chatflix" 
                        className="w-full"
                      />
                    </a>
                  </div>

                  <div className="flex flex-col text-left my-2">
                    <h3 className="text-[13px] font-medium font-['Helvetica_Neue'] leading-[0.9]">ACCESS</h3>
                    <h3 className="text-[13px] font-medium font-['Helvetica_Neue'] leading-[0.9]">TO ALL</h3>
                    <h3 className="text-[13px] font-medium font-['Helvetica_Neue'] leading-[0.9]">YOUR FAV</h3>
                    <h3 className="text-[13px] font-medium font-['Helvetica_Neue'] leading-[0.9] mb-1">LLMS</h3>
                    <span className="text-[12px] font-normal font-['Helvetica_Neue'] leading-[0.9]">
                      chatgpt, <br />
                      deepseek, <br />
                      claude <br />
                      ...etc
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Media Links at the bottom */}
          <div className="w-full flex mt-32 md:mt-32 mb-8 px-5 md:px-8 ">
            <div className="flex flex-col gap-2">
              <a
                href="https://www.instagram.com/h_ablankcanvas/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <div className="">
                  <h2 className="text-[16px] font-medium font-['Helvetica_Neue'] leading-[0.9] mb-0">INSTA-</h2>
                  <h2 className="text-[16px] font-medium font-['Helvetica_Neue'] leading-[0.9]">GRAM</h2>
                </div>
              </a>
              <a
                href="https://www.instagram.com/h_ablankcanvas/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-normal font-['Helvetica_Neue'] leading-[0.9] hover:opacity-70 transition-opacity"
              >
                h_ablankcanvas
              </a>
            </div>
            
            <div className="flex flex-col gap-2 ml-12">
              <a
                href="https://www.youtube.com/@h_ablankcanvas"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                <div className="">
                  <h2 className="text-[16px] font-medium font-['Helvetica_Neue'] leading-[0.9] mb-0">YOU-</h2>
                  <h2 className="text-[16px] font-medium font-['Helvetica_Neue'] leading-[0.9]">TUBE</h2>
                </div>
              </a>
              <a
                href="https://www.youtube.com/@h_ablankcanvas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-normal font-['Helvetica_Neue'] leading-[0.9] hover:opacity-70 transition-opacity"
              >
                h_ablankcanvas
              </a>
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