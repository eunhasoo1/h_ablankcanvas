'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Point {
  x: number;
  y: number;
  pressure: number;
}

interface Line {
  points: Point[];
  alpha: number;
}

const BlankCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lines = useRef<Line[]>([]);
  const currentLine = useRef<Point[]>([]);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw current line
      if (isDrawing && currentLine.current.length > 1) {
        drawLine(context, currentLine.current, 1);
      }
      
      // Draw and fade completed lines
      lines.current.forEach((line, lineIndex) => {
        drawLine(context, line.points, line.alpha);
        
        line.alpha -= 0.005; // Decrease alpha
        
        // Remove line if it's completely faded
        if (line.alpha <= 0) {
          lines.current.splice(lineIndex, 1);
        }
      });
      
      requestAnimationFrame(animate);
    };

    animate();
  }, [isDrawing]);

  const drawLine = (context: CanvasRenderingContext2D, points: Point[], alpha: number) => {
    if (points.length < 2) return;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      
      const lineProgress = i / (points.length - 1);
      const maxWidth = 30;
      const minWidth = 1;
      
      const easing = (t: number) => {
        return 0.5 - 0.5 * Math.cos(Math.PI * Math.pow(t, 0.6));
      };
      
      const width = (maxWidth - minWidth) * points[i].pressure * easing(lineProgress) + minWidth;
      
      context.lineWidth = width;
      context.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }

    context.lineTo(points[points.length - 1].x, points[points.length - 1].y);

    context.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
    context.stroke();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const pressure = (e as any).pressure !== undefined ? (e as any).pressure : 0.5;
    currentLine.current = [{x: e.clientX, y: e.clientY, pressure}];
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pressure = (e as any).pressure !== undefined ? (e as any).pressure : 0.5;
    currentLine.current.push({x: e.clientX, y: e.clientY, pressure});
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (currentLine.current.length > 1) {
      lines.current.push({points: [...currentLine.current], alpha: 1});
      currentLine.current = [];
    }
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className="relative w-full h-screen bg-background">
      <button 
        onClick={goHome}
        className="absolute top-4 left-4 p-2 z-10"
      >
        <ArrowLeft size={24} />
      </button>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        className="w-full h-screen bg-background cursor-crosshair"
      />
    </div>
  );
};

export default BlankCanvas;