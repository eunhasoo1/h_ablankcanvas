"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const keywordConfig: { [key: string]: { href: string; image?: string } } = {
  'coloso': { href: 'https://bit.ly/4dDyZvR', image: '/image/coloso.png' },
  '콜로소': { href: 'https://bit.ly/4dDyZvR', image: '/image/coloso.png' },
  'course': { href: 'https://bit.ly/4dDyZvR', image: '/image/coloso.png' },
  'chatflix': { href: 'https://www.chatflix.app', image: '/image/chatflix.png' },
  'ai': { href: 'https://www.chatflix.app', image: '/image/chatflix.png' },
  'llm': { href: 'https://www.chatflix.app', image: '/image/chatflix.png' },
  'timelapse': { href: 'https://www.youtube.com/@hablankcanvas_data', image: '/image/youtubeicon.png' },
  'process': { href: 'https://www.youtube.com/@hablankcanvas_data', image: '/image/youtubeicon.png' },
  'youtube timelapse': { href: 'https://www.youtube.com/@hablankcanvas_data', image: '/image/youtubeicon.png' },
  '타임랩스': { href: 'https://www.youtube.com/@hablankcanvas_data', image: '/image/youtubeicon.png' },
  '과정 영상': { href: 'https://www.youtube.com/@hablankcanvas_data', image: '/image/youtubeicon.png' },
  'haeun': { href: 'haeun_action' },
};

export default function Home() {
  const [dateTime, setDateTime] = useState(new Date());
  const [content, setContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [showArrow, setShowArrow] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [linkImageSrc, setLinkImageSrc] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const arrowButtonRef = useRef<HTMLButtonElement>(null);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; text: string, delay: number, size: number }[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    textareaRef.current?.focus();

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      clearInterval(timer);
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}. ${month}. ${day}. ${hours}:${minutes}:${seconds}`;
  };

  const showHaeunBubbles = () => {
    const margin = isMobile ? 50 : 150; // Margin from the window edges
    const minDistance = 100; // Minimum distance between bubbles
    const newBubbles: { id: number; x: number; y: number; text: string; delay: number; size: number }[] = [];

    const isOverlapping = (x: number, y: number, size: number) => {
      for (const bubble of newBubbles) {
        const distance = Math.sqrt(Math.pow(x - bubble.x, 2) + Math.pow(y - bubble.y, 2));
        if (distance < minDistance) {
          return true;
        }
      }
      return false;
    };

    for (let i = 0; i < 10; i++) {
      let x, y, size;
      let attempts = 0;
      do {
        x = Math.random() * (window.innerWidth - margin * 2) + margin;
        y = Math.random() * (window.innerHeight - margin * 2) + margin;
        size = Math.random() * 0.5 + 0.8;
        if (++attempts > 100) break; // Safety break to prevent infinite loops
      } while (isOverlapping(x, y, size));

      const text = Math.random() < 0.5 ? "that's me!" : "Hi!";
      newBubbles.push({
        id: Date.now() + i,
        x,
        y,
        text,
        delay: i * 100,
        size,
      });
    }

    setBubbles(newBubbles);

    setTimeout(() => {
      setBubbles([]);
    }, 3000);
  }

  const completeSuggestion = () => {
    if (!suggestion) return;

    const newContent = content + suggestion;
    setContent(newContent);
    setCursorPosition(newContent.length);
    setSelectionStart(newContent.length);
    setSelectionEnd(newContent.length);
    setSuggestion('');

    // Check if completed keyword has a link
    const hasKorean = (str: string) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(str);
    const isExactMatch = (keyword: string, input: string) => {
      if (hasKorean(keyword) || hasKorean(input)) {
        return keyword === input;
      } else {
        return keyword.toLowerCase() === input.toLowerCase();
      }
    };

    const exactMatch = Object.keys(keywordConfig).find(keyword =>
      isExactMatch(keyword, newContent.trim())
    );
    if (exactMatch) {
      setShowArrow(keywordConfig[exactMatch].href);
      setLinkImageSrc(keywordConfig[exactMatch].image || null);
    }

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newContent.length, newContent.length);
      }
    }, 0);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setCursorPosition(e.target.selectionStart || 0);
    setSelectionStart(e.target.selectionStart || 0);
    setSelectionEnd(e.target.selectionEnd || 0);
    setIsTyping(true);

    const trimmedContent = newContent.trim();

    // Helper function to check if string contains Korean characters
    const hasKorean = (str: string) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(str);

    // Helper function for comparison (case insensitive for English, exact for Korean)
    const isMatch = (keyword: string, input: string, exact: boolean = true) => {
      if (hasKorean(keyword) || hasKorean(input)) {
        return exact ? keyword === input : keyword.startsWith(input);
      } else {
        return exact ? keyword.toLowerCase() === input.toLowerCase() : keyword.toLowerCase().startsWith(input.toLowerCase());
      }
    };

    // Check for exact match
    const exactMatch = Object.keys(keywordConfig).find(keyword =>
      isMatch(keyword, trimmedContent, true)
    );

    if (exactMatch) {
      setShowArrow(keywordConfig[exactMatch].href);
      setLinkImageSrc(keywordConfig[exactMatch].image || null);
      setSuggestion('');
    } else {
      setShowArrow(null);
      setLinkImageSrc(null);

      // Find matching keywords for autocomplete
      if (trimmedContent.length > 0) {
        const matchingKeyword = Object.keys(keywordConfig).find(keyword =>
          isMatch(keyword, trimmedContent, false) && !isMatch(keyword, trimmedContent, true)
        );

        if (matchingKeyword) {
          setSuggestion(matchingKeyword.substring(trimmedContent.length));
        } else {
          setSuggestion('');
        }
      } else {
        setSuggestion('');
      }
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing state after 0.2 second
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if ((e.key === 'Enter' || e.keyCode === 13) && !e.nativeEvent.isComposing) {
      if (isMobile && suggestion) {
        e.preventDefault();
        completeSuggestion();
        return;
      }

      if (showArrow) {
        e.preventDefault();
        arrowButtonRef.current?.click();
        return;
      }
    }

    // Handle Tab for autocomplete
    if (e.key === 'Tab' && suggestion && !e.nativeEvent.isComposing) {
      e.preventDefault();
      completeSuggestion();
      return;
    }

    // Handle Ctrl+A (Select All)
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      setSelectionStart(0);
      setSelectionEnd(content.length);
      setCursorPosition(content.length);
      textarea.setSelectionRange(0, content.length);
      return;
    }

    // Handle Delete and Backspace for selected text
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectionStart !== selectionEnd) {
      e.preventDefault();
      const start = Math.min(selectionStart, selectionEnd);
      const end = Math.max(selectionStart, selectionEnd);
      const newContent = content.substring(0, start) + content.substring(end);
      setContent(newContent);
      setCursorPosition(start);
      setSelectionStart(start);
      setSelectionEnd(start);
      textarea.value = newContent;
      textarea.setSelectionRange(start, start);
      setIsTyping(true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing state after 0.2 second
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 200);
      return;
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();

      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 200);

      let newPosition = cursorPosition;

      if (e.key === 'ArrowLeft' && newPosition > 0) {
        newPosition--;
      } else if (e.key === 'ArrowRight' && newPosition < content.length) {
        newPosition++;
      } else if (e.key === 'ArrowUp') {
        // Move to beginning of line or previous line
        const lines = content.substring(0, newPosition).split('\n');
        if (lines.length > 1) {
          const currentLineStart = newPosition - lines[lines.length - 1].length;
          const prevLineStart = currentLineStart - lines[lines.length - 2].length - 1;
          const currentColumn = lines[lines.length - 1].length;
          const prevLineLength = lines[lines.length - 2].length;
          newPosition = Math.max(0, prevLineStart + Math.min(currentColumn, prevLineLength));
        } else {
          newPosition = 0;
        }
      } else if (e.key === 'ArrowDown') {
        // Move to end of line or next line
        const beforeCursor = content.substring(0, newPosition);
        const afterCursor = content.substring(newPosition);
        const currentLineEnd = afterCursor.indexOf('\n');

        if (currentLineEnd !== -1) {
          const lines = beforeCursor.split('\n');
          const currentColumn = lines[lines.length - 1].length;
          const nextLineStart = newPosition + currentLineEnd + 1;
          const restOfContent = content.substring(nextLineStart);
          const nextLineEnd = restOfContent.indexOf('\n');
          const nextLineLength = nextLineEnd === -1 ? restOfContent.length : nextLineEnd;
          newPosition = nextLineStart + Math.min(currentColumn, nextLineLength);
        } else {
          newPosition = content.length;
        }
      }

      if (e.shiftKey) {
        // Text selection with shift + arrow keys
        if (selectionStart === selectionEnd) {
          // Start new selection
          setSelectionStart(cursorPosition);
        }
        setSelectionEnd(newPosition);
        textarea.setSelectionRange(Math.min(selectionStart, newPosition), Math.max(selectionStart, newPosition));
      } else {
        // Clear selection and move cursor
        setSelectionStart(newPosition);
        setSelectionEnd(newPosition);
        textarea.setSelectionRange(newPosition, newPosition);
      }

      setCursorPosition(newPosition);
    }
  };

  const handleArrowClick = () => {
    if (showArrow) {
      if (showArrow === 'haeun_action') {
        showHaeunBubbles();
      }
    }
  };

  const renderTextWithSelection = () => {
    if (content.length === 0) {
      return <span className={`custom-cursor ${isTyping ? 'no-blink' : ''}`}></span>;
    }

    const hasSelection = selectionStart !== selectionEnd;
    const start = Math.min(selectionStart, selectionEnd);
    const end = Math.max(selectionStart, selectionEnd);

    if (!hasSelection) {
      // No selection, just render text with cursor
      const beforeCursor = content.substring(0, cursorPosition);
      const afterCursor = content.substring(cursorPosition);

      return (
        <div className="flex items-center justify-center">
          <span>{beforeCursor}</span>
          {!showArrow && !suggestion && <span className={`custom-cursor ${isTyping ? 'no-blink' : ''}`}></span>}
          <span>{afterCursor}</span>
          {suggestion && (
            <span style={{ color: '#ccc' }}>{suggestion}</span>
          )}
          {showArrow && (
            showArrow === 'haeun_action' ? (
              <button ref={arrowButtonRef} onClick={handleArrowClick} className="ml-2 bg-red-500 rounded-full p-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            ) : (
              <a href={showArrow} target="_blank" rel="noopener noreferrer" ref={arrowButtonRef as React.RefObject<HTMLAnchorElement>} className="ml-2 bg-red-500 rounded-full p-1 inline-flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            )
          )}
        </div>
      );
    } else {
      // Has selection, render with highlight
      const beforeSelection = content.substring(0, start);
      const selectedText = content.substring(start, end);
      const afterSelection = content.substring(end);

      return (
        <div className="flex items-center justify-center">
          <span>{beforeSelection}</span>
          <span
            style={{
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
            }}
          >
            {selectedText}
          </span>
          <span>{afterSelection}</span>
          {showArrow && (
            showArrow === 'haeun_action' ? (
              <button ref={arrowButtonRef} onClick={handleArrowClick} className="ml-2 bg-red-500 rounded-full p-1">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            ) : (
              <a href={showArrow} target="_blank" rel="noopener noreferrer" ref={arrowButtonRef as React.RefObject<HTMLAnchorElement>} className="ml-2 bg-red-500 rounded-full p-1 inline-flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
            )
          )}
          {!hasSelection && cursorPosition === content.length && !showArrow && (
            <span className={`custom-cursor ${isTyping ? 'no-blink' : ''}`}></span>
          )}
        </div>
      );
    }
  };

     const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
     // Check if the click target or its parent is an anchor tag, button, or a link image.
     let target = e.target as HTMLElement;
     while (target && target.tagName !== 'BODY') {
       if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('[data-link-image]')) {
         // If it's a link, let the default browser action happen and don't focus the textarea.
         return;
       }
       target = target.parentElement!;
     }

     textareaRef.current?.focus();
   };

  return (
    <main
      className="h-dvh bg-white text-black flex items-center justify-center relative cursor-text"
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Image src="/image/pin.png" alt="Pin" width={40} height={40} />
            </div>

      <div className="w-full max-w-4xl p-8 text-center -mt-80">
        <div className="relative inline-block">
          <div className="text-lg leading-relaxed" style={{ color: 'red' }}>
            {renderTextWithSelection()}
          </div>
          {linkImageSrc && showArrow && showArrow !== 'haeun_action' && (
            <a 
              href={showArrow}
              target="_blank"
              rel="noopener noreferrer"
              data-link-image="true"
              className="fade-in absolute top-full left-1/2 -translate-x-1/2 mt-4 cursor-pointer"
            >
              <Image src={linkImageSrc} alt="Link image" width={150} height={150} className="rounded-lg" />
            </a>
          )}
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
        />
            </div>

      <div className="absolute bottom-4 right-8 font-marydale text-sm">
        {formatDate(dateTime)}
        </div>

      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            '--bubble-size': bubble.size,
            animationDelay: `${bubble.delay}ms`,
          } as React.CSSProperties}
        >
          {bubble.text}
        </div>
      ))}
    </main>
  );
}


