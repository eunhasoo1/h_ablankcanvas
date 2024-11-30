'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: Point[];
  alpha: number;
  createdAt: number;
}

const BlankCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const lines = useRef<Line[]>([]);
  const currentLine = useRef<Point[]>([]);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    const animate = () => {
      context.fillStyle = isDarkMode ? '#1a1a1a' : '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw current line
      if (isDrawing && currentLine.current.length > 1) {
        drawLine(context, currentLine.current, 1);
      }
      
      // Draw and fade completed lines
      const currentTime = Date.now();
      lines.current.forEach((line, lineIndex) => {
        const timeSinceCreation = currentTime - line.createdAt;
        if (timeSinceCreation > 300) {
          line.alpha -= 0.005;
        }
        drawLine(context, line.points, line.alpha);
        
        // Remove line if it's completely faded
        if (line.alpha <= 0) {
          lines.current.splice(lineIndex, 1);
        }
      });
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDrawing, isDarkMode]);

  const drawLine = (context: CanvasRenderingContext2D, points: Point[], alpha: number) => {
    if (points.length < 2) return;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    const isMobile = window.innerWidth <= 768;
    const lineWidth = isMobile ? 4 : 6;

    context.lineWidth = lineWidth;

    for (let i = 1; i < points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      context.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    if (points.length > 2) {
      const last = points.length - 1;
      context.quadraticCurveTo(
        points[last - 1].x,
        points[last - 1].y,
        points[last].x,
        points[last].y
      );
    }

    const lineColor = isDarkMode ? 'rgb(255, 255, 255)' : 'rgb(26, 26, 26)';
    
    // Line effect
    context.strokeStyle = `rgba(${lineColor.match(/\d+/g)?.join(', ')}, ${alpha})`;
    context.shadowColor = lineColor;
    context.shadowBlur = isDarkMode ? 10 : 0;
    context.stroke();

    // Glow effect
    context.strokeStyle = `rgba(${lineColor.match(/\d+/g)?.join(', ')}, ${alpha * 0.5})`;
    context.lineWidth = lineWidth + (isDarkMode ? 4 : 2);
    context.stroke();

    // Reset shadow
    context.shadowColor = 'transparent';
    context.shadowBlur = 0;
  };

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDrawing(true);
    const { clientX, clientY } = getEventCoordinates(e);
    currentLine.current = [{ x: clientX, y: clientY }];
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing) return;
    const { clientX, clientY } = getEventCoordinates(e);
    currentLine.current.push({ x: clientX, y: clientY });
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (currentLine.current.length > 1) {
      lines.current.push({ 
        points: [...currentLine.current], 
        alpha: 1,
        createdAt: Date.now()
      });
      currentLine.current = [];
    }
  };

  const getEventCoordinates = (e: React.TouchEvent | React.MouseEvent): { clientX: number; clientY: number } => {
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return { clientX, clientY };
  };

  const goHome = () => {
    router.push('/');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`relative w-full min-h-dvh ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'} touch-none`}>
      <button 
        onClick={goHome}
        className={`absolute top-4 left-4 p-2 z-10 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        <ArrowLeft size={24} />
      </button>
      <button 
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 z-10 ${isDarkMode ? 'text-white' : 'text-black'}`}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      {/* Secret Message */}
      {showMessage && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
          onClick={() => setShowMessage(false)}
        >
          <div className="relative">
            <img
              src="/image/post-it.png"
              alt="Post-it note"
              className="w-80 h-80 object-contain transform "
            />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-marydale text-base md:text-xl text-center whitespace-nowrap">
              You&apos;ve reached the 
              <br /> <span className="italic">secret</span> canvas.<br />
              Have fun :)
            </span>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-full cursor-crosshair"
      />
    </div>
  );
};

export default BlankCanvas;