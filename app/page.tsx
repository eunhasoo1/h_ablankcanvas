"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const keywordLinks: { [key: string]: string } = {
  'haeun': 'haeun_action',
  'coloso': 'https://bit.ly/4dDyZvR',
  '콜로소': 'https://bit.ly/4dDyZvR',
  'course': 'https://bit.ly/4dDyZvR',
  'timelapse': 'https://www.youtube.com/@hablankcanvas_data',
  'process': 'https://www.youtube.com/@hablankcanvas_data',
  'youtube timelapse': 'https://www.youtube.com/@hablankcanvas_data',
  '타임랩스': 'https://www.youtube.com/@hablankcanvas_data',
  '과정 영상': 'https://www.youtube.com/@hablankcanvas_data',
  'chatflix': 'https://www.chatflix.app',
  'ai': 'https://www.chatflix.app',
  'llm': 'https://www.chatflix.app',
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; text: string, delay: number, size: number }[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    textareaRef.current?.focus();
    return () => clearInterval(timer);
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
    const margin = 150; // Margin from the window edges
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
      do {
        x = Math.random() * (window.innerWidth - margin * 2) + margin;
        y = Math.random() * (window.innerHeight - margin * 2) + margin;
        size = Math.random() * 0.5 + 0.8;
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
    const exactMatch = Object.keys(keywordLinks).find(keyword => 
      isMatch(keyword, trimmedContent, true)
    );
    
    if (exactMatch) {
      setShowArrow(keywordLinks[exactMatch]);
      setSuggestion('');
    } else {
      setShowArrow(null);
      
      // Find matching keywords for autocomplete
      if (trimmedContent.length > 0) {
        const matchingKeyword = Object.keys(keywordLinks).find(keyword => 
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

    if (showArrow && e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (showArrow === 'haeun_action') {
        showHaeunBubbles();
      } else {
        window.open(showArrow, '_blank');
      }
      return;
    }

    // Handle Tab for autocomplete
    if (e.key === 'Tab' && suggestion && !e.nativeEvent.isComposing) {
      e.preventDefault();
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
      
      const exactMatch = Object.keys(keywordLinks).find(keyword => 
        isExactMatch(keyword, newContent.trim())
      );
      if (exactMatch) {
        setShowArrow(keywordLinks[exactMatch]);
      }
      
      // Let React handle the state update, avoid direct DOM manipulation
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newContent.length, newContent.length);
        }
      }, 0);
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
      window.open(showArrow, '_blank');
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
             <button onClick={handleArrowClick} className="ml-2 bg-red-500 rounded-full p-1">
               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
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
            <button onClick={handleArrowClick} className="ml-2 bg-red-500 rounded-full p-1">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          )}
          {!hasSelection && cursorPosition === content.length && !showArrow && (
            <span className={`custom-cursor ${isTyping ? 'no-blink' : ''}`}></span>
          )}
        </div>
      );
    }
  };

  const handleClick = () => {
    textareaRef.current?.focus();
  };

  return (
    <main 
      className="min-h-screen bg-white text-black flex items-center justify-center relative cursor-text"
      onClick={handleClick}
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Image src="/image/pin.png" alt="Pin" width={40} height={40} />
            </div>
            
      <div className="w-full max-w-4xl p-8 text-center -mt-80">
        <div className="text-lg leading-relaxed" style={{ color: 'red' }}>
          {renderTextWithSelection()}
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


