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
  
  // 스트리밍할 텍스트 3줄
  const streamingLines = [
    'VIEWING IS MANDATORY FOR ALL CITIZENS LEVEL 3 AND ABOVE. REPORT',
    'DISLOYAL REACTIONS TO YOUR LOCAL HABLANKCANVAS SECURITY',
    'BUREAU.'
  ];
  
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
      
      // 현재 섹션 계산 (0: 메인, 1: Coloso)
      const section = Math.round(scrollPosition / windowHeight);
      setCurrentSection(section);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 커스텀 커서 처리
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      setShowCustomCursor(true);
    };
    
    const handleMouseLeave = () => {
      setShowCustomCursor(false);
    };
    
    if (currentSection === 0) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      };
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

  return (
    <div className="font-helvetica w-full min-h-dvh flex flex-col snap-y snap-mandatory">
      {/* First Section - Background Video with snap */}
      <section 
        className="snap-start h-screen w-full relative cursor-play"
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
                filter: 'brightness(0.7)',
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

        {/* Left Sidebar - Part of first section */}
        <div className="hidden md:flex bg-[#edece5] p-2 absolute left-0 top-0 bottom-0 w-[68px] z-20 flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Logo */}
          <div className="w-full bg-[#edece5] pt-6 pb-8 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="28" viewBox="0 0 57.803 53.923" className="fill-[#1C1C1C]">
              <path id="패스_21" data-name="패스 21" d="M61.98,65.023H56.125a.269.269,0,0,0,.027-.116c0-.15-.122-.341-.272-.341H54.639c-.15,0-.272.191-.272.341a.269.269,0,0,0,.027.116h-.8a.871.871,0,0,1-.854-.923V12.264a.842.842,0,0,1,.854-.784H59.5a.465.465,0,0,0-.008.078.458.458,0,0,0,.4.466h.854a.485.485,0,0,0,.535-.466.465.465,0,0,0-.008-.078h.714a.863.863,0,0,1,.923.784V64.1A.886.886,0,0,1,61.98,65.023Zm-11.725-.155H41.571a.842.842,0,0,1-.784-.854V12.1a.912.912,0,0,1,.784-.923h2.712c0,.083-.074.1-.074.109,0,.236.261.357.5.357h3.958a.317.317,0,0,0,.357-.357c0-.013.067-.026.066-.109h1.168a.916.916,0,0,1,.854.923V64.015A.854.854,0,0,1,50.255,64.868ZM38.3,64.643H29.776a.839.839,0,0,1-.854-.784V12.023a.971.971,0,0,1,.854-.923h2.871a.456.456,0,0,0,.388.458h2.631a.642.642,0,0,0,.7.629h2.724V63.859A.739.739,0,0,1,38.3,64.643Zm-11.865,0H24.992c.027.024.043-.029.043-.155a.381.381,0,0,0-.38-.31h-5.51c-.1,0-.241.209-.241.31,0,.127.016.179.043.155H17.9a.839.839,0,0,1-.854-.784V12.023A.971.971,0,0,1,17.9,11.1H26.44a.869.869,0,0,1,.854.923V63.859A.76.76,0,0,1,26.44,64.643Zm-11.8,0h-1.4A.594.594,0,0,0,12.7,64.1H7.343a.67.67,0,0,0-.613.543H5.954a.839.839,0,0,1-.854-.784V12.023a.971.971,0,0,1,.854-.923H6.73a.462.462,0,0,0,.466.466H12.7c.327,0,.535-.139.535-.466h1.4a.86.86,0,0,1,.784.923V63.859A.739.739,0,0,1,14.637,64.643Z" transform="translate(-5.1 -11.1)" fill-rule="evenodd"/>
            </svg>
          </div>

          {/* Vertical Text Area with Streaming Effect */}
          <div className="w-full flex-1 flex items-center relative">
            <div className="absolute inset-0 flex items-center">
              <div 
                className="text-[#1C1C1C] text-[7px] leading-tight font-mono uppercase tracking-widest"
                style={{ 
                  whiteSpace: 'pre-wrap',
                  writingMode: 'vertical-rl', 
                  transform: 'rotate(180deg)',
                  letterSpacing: '1.5px',
                  fontWeight: '500',
                  height: '100%',
                  paddingLeft: '24px',
                  paddingRight: '10px',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start'
                }}
              >
                {showFullText ? (
                  streamingLines.join('\n')
                ) : (
                  streamingText
                )}
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="w-full">
            <div className="bg-[#1C1C1C] w-full h-[220px] rounded-full mb-2 relative overflow-hidden">
              {/* Top circle with SVG */}
              <div className="-rotate-90 absolute top-0 left-1/2 transform -translate-x-1/2 w-11 h-11 mt-1 rounded-full bg-[#edece5] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="28" viewBox="0 0 26 27.82">
                  <path id="패스_20" data-name="패스 20" d="M30.685,38.92H28.051a.156.156,0,0,0,.012-.06c0-.077-.055-.176-.122-.176h-.558c-.067,0-.122.1-.122.176a.156.156,0,0,0,.012.06h-.361a.428.428,0,0,1-.384-.476V11.7a.405.405,0,0,1,.384-.4h2.656a.274.274,0,0,0,0,.04c0,.133.094.24.178.24h.384a.232.232,0,0,0,.241-.24.274.274,0,0,0,0-.04h.321a.411.411,0,0,1,.415.4V38.443A.431.431,0,0,1,30.685,38.92Zm-5.274-.08H21.5a.414.414,0,0,1-.353-.44V11.616c0-.243.172-.476.353-.476h1.22c0,.043-.033.049-.033.056a.2.2,0,0,0,.223.184H24.7c.106,0,.161-.063.161-.184,0-.007.03-.013.03-.056h.525a.451.451,0,0,1,.384.476V38.4A.415.415,0,0,1,25.411,38.839Zm-5.375-.116H16.2a.4.4,0,0,1-.384-.4V11.576A.478.478,0,0,1,16.2,11.1h1.291a.226.226,0,0,0,.175.236h1.183a.307.307,0,0,0,.314.324h1.225V38.319A.359.359,0,0,1,20.035,38.723Zm-5.337,0h-.651c.012.012.019-.015.019-.08a.181.181,0,0,0-.171-.16H11.418c-.046,0-.108.108-.108.16s.007.092.019.08h-.47a.4.4,0,0,1-.384-.4V11.576a.478.478,0,0,1,.384-.476H14.7a.428.428,0,0,1,.384.476V38.319A.366.366,0,0,1,14.7,38.723Zm-5.309,0H8.761a.29.29,0,0,0-.244-.28H6.109a.321.321,0,0,0-.276.28H5.484a.4.4,0,0,1-.384-.4V11.576a.478.478,0,0,1,.384-.476h.349a.223.223,0,0,0,.209.24H8.521a.214.214,0,0,0,.241-.24H9.39c.212,0,.353.233.353.476V38.319A.359.359,0,0,1,9.39,38.723Z" transform="translate(-5.1 -11.1)" fill="#242423" fill-rule="evenodd"/>
                </svg>
              </div>
              
              {/* Center Vertical line */}
              <div className="w-[1px] h-[120px] bg-white absolute left-1/2 bottom-6"></div>
              
              {/* Classification + Public Release container */}
              <div className="absolute left-0 bottom-0 w-full h-[140px] flex gap-1 pb-6">
                {/* Left side - Classification */}
                <div className="w-full relative flex pl-2">
                  <div
                    className=" text-white font-mono text-[10px] uppercase tracking-wider text-left"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      left: '17px',
                      bottom: '30px',
                      letterSpacing: '1px'
                    }}
                  >
                    CLASSIFICATION:
                  </div>
                </div>
                
                {/* Right side - Public Release */}
                <div className="w-full relative flex">
                  <div 
                    className=" text-white font-mono text-[10px] uppercase tracking-wider text-left"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      right: '17px',
                      bottom: '30px',
                      letterSpacing: '1px'
                    }}
                  >
                    PUBLIC RELEASE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Top Header with Logo - Only visible on mobile */}
        <div className="md:hidden absolute justify-between top-0 left-0 right-0 h-16 bg-[#edece5] flex items-center justify-left z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 57.803 53.923" className="fill-[#1C1C1C] m-4 ">
            <path id="패스_21" data-name="패스 21" d="M61.98,65.023H56.125a.269.269,0,0,0,.027-.116c0-.15-.122-.341-.272-.341H54.639c-.15,0-.272.191-.272.341a.269.269,0,0,0,.027.116h-.8a.871.871,0,0,1-.854-.923V12.264a.842.842,0,0,1,.854-.784H59.5a.465.465,0,0,0-.008.078.458.458,0,0,0,.4.466h.854a.485.485,0,0,0,.535-.466.465.465,0,0,0-.008-.078h.714a.863.863,0,0,1,.923.784V64.1A.886.886,0,0,1,61.98,65.023Zm-11.725-.155H41.571a.842.842,0,0,1-.784-.854V12.1a.912.912,0,0,1,.784-.923h2.712c0,.083-.074.1-.074.109,0,.236.261.357.5.357h3.958a.317.317,0,0,0,.357-.357c0-.013.067-.026.066-.109h1.168a.916.916,0,0,1,.854.923V64.015A.854.854,0,0,1,50.255,64.868ZM38.3,64.643H29.776a.839.839,0,0,1-.854-.784V12.023a.971.971,0,0,1,.854-.923h2.871a.456.456,0,0,0,.388.458h2.631a.642.642,0,0,0,.7.629h2.724V63.859A.739.739,0,0,1,38.3,64.643Zm-11.865,0H24.992c.027.024.043-.029.043-.155a.381.381,0,0,0-.38-.31h-5.51c-.1,0-.241.209-.241.31,0,.127.016.179.043.155H17.9a.839.839,0,0,1-.854-.784V12.023A.971.971,0,0,1,17.9,11.1H26.44a.869.869,0,0,1,.854.923V63.859A.76.76,0,0,1,26.44,64.643Zm-11.8,0h-1.4A.594.594,0,0,0,12.7,64.1H7.343a.67.67,0,0,0-.613.543H5.954a.839.839,0,0,1-.854-.784V12.023a.971.971,0,0,1,.854-.923H6.73a.462.462,0,0,0,.466.466H12.7c.327,0,.535-.139.535-.466h1.4a.86.86,0,0,1,.784.923V63.859A.739.739,0,0,1,14.637,64.643Z" transform="translate(-5.1 -11.1)" fill-rule="evenodd"/>
          </svg>
          <div className="flex h-full flex-1 w-full">
            <div 
              className="w-full bg-black text-white justify-between font-mono text-[10px] uppercase tracking-wider px-4 py-1 flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              EMPLOYEES ONLY <ArrowRight size={10} />
            </div>
          </div>
        </div>

        {/* Mobile Bottom Controls - Only visible on mobile */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 z-20 flex flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Horizontal Streaming Text */}
          <div className="bg-[#edece5] w-full py-2 px-2">
            <div className="text-[#1C1C1C] text-[6px] font-mono uppercase tracking-wider overflow-hidden">
              {showFullText ? (
                <span className="inline-block">
                  {streamingLines.join(' ')}
                </span>
              ) : (
                <span className="inline-block">
                  {streamingText}
                </span>
              )}
            </div>
          </div>
          
          {/* Classification Bar */}
          <div className="bg-[#1C1C1C] w-full px-4 py-3 flex justify-between items-center">
            <div className="text-white font-mono text-[8px] uppercase tracking-wider">
              CLASSIFICATION: PUBLIC RELEASE
            </div>
            <div className="flex gap-2">
              {socialLinks.filter(item => item.id !== '3').map((item) => (
                <a 
                  key={item.id} 
                  href={item.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white flex items-center justify-center"
                  aria-label={item.title}
                >
                  {React.cloneElement(item.icon as React.ReactElement, { size: 16 })}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div 
          className="relative w-full flex flex-col min-h-dvh transition-all duration-300 z-10 pl-0 md:pl-[68px] pt-16 md:pt-0"
          style={{
            transform: (showPopup && !isClosing) || (isClosing && popupAnimation) ? 'scale(0.95)' : 'scale(1)',
            opacity: (showPopup && !isClosing) || (isClosing && popupAnimation) ? '0.7' : '1',
            pointerEvents: showPopup ? 'none' : 'auto'
          }}
        >
          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center px-5 py-4 max-w-xl mx-auto w-full">
            <div 
              className="absolute right-0 top-0 text-white py-2 px-3 text-xs bg-black/30 hover:bg-black/50 transition-colors font-mono uppercase hidden md:block"
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/" className="flex items-center gap-1">
                EMPLOYEES ONLY <ArrowRight size={12} />
              </Link>
            </div>

            
          </main>
        </div>

        {/* Custom PLAY cursor */}
        {showCustomCursor && currentSection === 0 && (
          <div 
            className="custom-cursor-play"
            style={{
              left: cursorPosition.x,
              top: cursorPosition.y,
            }}
          >
            PLAY
          </div>
        )}
      </section>

      {/* Second Section - Coloso Page */}
      <section 
        className="snap-start h-screen w-full relative overflow-hidden cursor-default"
        onClick={goToBitlyLink}
      >
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/image/coloso.png"
            alt="Coloso"
            fill
            priority
            className="object-cover"
          />
        </div>
        
        <div className="absolute bottom-0 inset-0 flex flex-col justify-end items-end">
          <div 
            className="bg-[#edece5] p-6 md:p-8 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-medium mb-1">COLOSO COURSE</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">YOUR CHARACTERS,<br/>BROUGHT TO LIFE.</h3>
            <div className="text-[#626262] mb-6 text-sm space-y-0.5">
              <p>Coloso character animation course</p>
              <p>Special collaboration with Coloso specialists</p>
              <p>Quality certification: Highest standard</p>
            </div>
            
            <div className="flex justify-between items-center">
              <Link 
                href="https://bit.ly/4dDyZvR" 
                target="_blank"
                className="flex items-center gap-1 text-sm font-medium"
              >
                <span className="border-b border-black pb-0.5">LEARN MORE</span>
                <span className="bg-black text-white rounded-full p-1.5 flex items-center justify-center">
                  <ChevronRight size={16} />
                </span>
              </Link>
              
              <div className="bg-[#1b1b1b] text-white p-2 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                  <line x1="12" y1="16" x2="12" y2="8"></line>
                </svg>
              </div>
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